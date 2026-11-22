require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ket noi MongoDB Atlas
let isDbConnected = false;
const mongoUri = process.env.MONGODB_URI;

if (mongoUri && !mongoUri.includes('<USERNAME>') && !mongoUri.includes('<PASSWORD>')) {
  mongoose.connect(mongoUri)
    .then(() => {
      isDbConnected = true;
      console.log('Ket noi MongoDB Atlas thanh cong!');
    })
    .catch((err) => {
      console.error('Loi ket noi MongoDB Atlas:', err.message);
      console.log('May chu van chay o che do bo nho tam de ban kiem thu.');
    });
} else {
  console.log('Chua cau hinh MONGODB_URI trong file .env -> Dang dung bo nho tam.');
}

// Schema MongoDB cho ma OTP va mat khau da doi
const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastSentAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  resetToken: { type: String, default: null },
  resetTokenExpiresAt: { type: Date, default: null }
});

const accountResetSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const OtpModel = mongoose.model('Otp', otpSchema);
const AccountResetModel = mongoose.model('AccountReset', accountResetSchema);

// Bo nho du phong khi chua ket noi DB
const memoryOtp = new Map();
const memoryPasswords = new Map();

function normalizePhone(raw) {
  return String(raw || '').replace(/[\s.-]/g, '').trim();
}

function isValidVnPhone(phone) {
  return /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash || '').split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

async function getOtpRecord(phone) {
  if (isDbConnected) return await OtpModel.findOne({ phone });
  return memoryOtp.get(phone) || null;
}

async function saveOtpRecord(phone, data) {
  if (isDbConnected) {
    return await OtpModel.findOneAndUpdate(
      { phone },
      { $set: { phone, ...data } },
      { upsert: true, new: true }
    );
  }
  const merged = { ...(memoryOtp.get(phone) || {}), phone, ...data };
  memoryOtp.set(phone, merged);
  return merged;
}

async function deleteOtpRecord(phone) {
  if (isDbConnected) await OtpModel.deleteOne({ phone });
  else memoryOtp.delete(phone);
}

async function saveNewPassword(phone, passwordHash) {
  if (isDbConnected) {
    await AccountResetModel.findOneAndUpdate(
      { phone },
      { $set: { phone, passwordHash, updatedAt: new Date() } },
      { upsert: true }
    );
  } else {
    memoryPasswords.set(phone, passwordHash);
  }
}

async function getStoredPassword(phone) {
  if (isDbConnected) {
    const doc = await AccountResetModel.findOne({ phone });
    return doc ? doc.passwordHash : null;
  }
  return memoryPasswords.get(phone) || null;
}

async function sendOtpToTelegram(phone, code) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const text = `[HueIC] Ma OTP dat lai mat khau cho SDT ${phone} la: ${code}\nMa co hieu luc trong 3 phut. Khong chia se ma nay cho nguoi khac.`;
  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error('Telegram API loi: ' + errText);
  }
  return true;
}

// API kiem tra trang thai may chu
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDbConnected ? 'mongodb_connected' : 'memory_mode',
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
  });
});

// API 1: Gui ma OTP quen mat khau
app.post('/api/forgot-password', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    if (!isValidVnPhone(phone)) {
      return res.status(400).json({ message: 'So dien thoai khong hop le (vi du: 0903000001).' });
    }

    const existing = await getOtpRecord(phone);
    if (existing && existing.lastSentAt) {
      const elapsedSec = Math.floor((Date.now() - new Date(existing.lastSentAt).getTime()) / 1000);
      if (elapsedSec < 60) {
        return res.status(429).json({
          message: `Vui long cho ${60 - elapsedSec} giay truoc khi yeu cau gui lai ma.`
        });
      }
    }

    const code = String(crypto.randomInt(100000, 1000000));
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 3 * 60 * 1000);

    await saveOtpRecord(phone, {
      code,
      expiresAt,
      lastSentAt: now,
      attempts: 0,
      resetToken: null,
      resetTokenExpiresAt: null
    });

    const sentTelegram = await sendOtpToTelegram(phone, code);
    if (sentTelegram) {
      console.log(`[OTP] Da gui ma xac nhan toi Telegram cho SDT ${phone}`);
      return res.json({
        success: true,
        message: 'Ma OTP 6 so da duoc gui ve dien thoai cua ban. Hieu luc trong 3 phut.'
      });
    }

    // Neu chua gan Telegram token, ghi log tai terminal server de kiem thu noi bo
    console.log(`[OTP - CHE DO TEST] SDT: ${phone} | Ma OTP: ${code}`);
    return res.json({
      success: true,
      message: 'Da tao ma OTP. Hay cau hinh Telegram trong .env de nhan tren dien thoai (hien dang xem ma trong Terminal).'
    });
  } catch (err) {
    console.error('Loi /api/forgot-password:', err.message);
    res.status(500).json({ message: 'Khong gui duoc ma OTP, vui long thu lai sau.' });
  }
});

// API 2: Xac thuc ma OTP 6 so
app.post('/api/verify-otp', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const code = String(req.body.code || '').trim();

    if (!phone || !code) {
      return res.status(400).json({ message: 'Vui long nhap day du so dien thoai va ma OTP.' });
    }

    const record = await getOtpRecord(phone);
    if (!record) {
      return res.status(400).json({ message: 'Chua co ma OTP hoac ma da duoc su dung.' });
    }

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      await deleteOtpRecord(phone);
      return res.status(400).json({ message: 'Ma OTP da het han. Vui long yeu cau gui ma moi.' });
    }

    if ((record.attempts || 0) >= 5) {
      await deleteOtpRecord(phone);
      return res.status(429).json({ message: 'Nhap sai qua 5 lan. Vui long yeu cau ma OTP moi.' });
    }

    if (record.code !== code) {
      await saveOtpRecord(phone, { attempts: (record.attempts || 0) + 1 });
      return res.status(400).json({ message: 'Ma OTP khong chinh xac.' });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await saveOtpRecord(phone, { resetToken, resetTokenExpiresAt });

    res.json({
      success: true,
      resetToken,
      message: 'Xac thuc OTP thanh cong. Moi ban dat mat khau moi.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Loi xac thuc OTP: ' + err.message });
  }
});

// API 3: Dat lai mat khau moi
app.post('/api/reset-password', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const resetToken = String(req.body.resetToken || '').trim();
    const newPassword = String(req.body.newPassword || '');

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mat khau moi phai co it nhat 6 ky tu.' });
    }

    const record = await getOtpRecord(phone);
    if (
      !record ||
      !record.resetToken ||
      record.resetToken !== resetToken ||
      Date.now() > new Date(record.resetTokenExpiresAt).getTime()
    ) {
      return res.status(400).json({ message: 'Phien dat lai mat khau da het han. Vui long thuc hien lai.' });
    }

    const passwordHash = hashPassword(newPassword);
    await saveNewPassword(phone, passwordHash);
    await deleteOtpRecord(phone);

    res.json({
      success: true,
      message: 'Doi mat khau thanh cong! Ban co the dang nhap bang mat khau moi.'
    });
  } catch (err) {
    res.status(500).json({ message: 'Loi doi mat khau: ' + err.message });
  }
});

// API 4: Kiem tra mat khau da doi (neu nguoi dung dang nhap bang SDT da doi mat khau)
app.post('/api/check-reset-login', async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const password = String(req.body.password || '');
    const storedHash = await getStoredPassword(phone);
    if (!storedHash) return res.json({ hasCustomPassword: false });

    const matched = verifyPassword(password, storedHash);
    res.json({ hasCustomPassword: true, matched });
  } catch (err) {
    res.status(500).json({ hasCustomPassword: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Web & May chu HueIC dang chay tai: http://localhost:${PORT}`);
});
