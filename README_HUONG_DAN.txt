HUONG DAN CHAY & DUA WEB HUEIC LEN MANG (GUI MA OTP VE DIEN THOAI)
===================================================================

1. Giai nen thu muc hueic-webapp-server vao o D: (hoac trong thu muc du an).
   * Ban co the copy them 4 file giao dien da chinh sua (giao_vien.html,
     hoc_sinh.html, phu_huynh.html, quan_tri.html) va thu muc assets/
     vao ben trong thu muc public/.

2. Mo file .env va dien 3 thong so cua ban:
   - MONGODB_URI: Chuoi ket noi copy tu MongoDB Atlas (nho them /hueic_db o cuoi)
   - TELEGRAM_BOT_TOKEN: Ma bot lay tu @BotFather tren Telegram
   - TELEGRAM_CHAT_ID: So ID lay tu @userinfobot tren Telegram

3. Chay thu tren may tinh (mo Terminal trong VS Code tai thu muc nay):
   npm install
   node server.js

   -> Mo trinh duyet vao: http://localhost:3000
   -> Bam "Quen mat khau?" -> Nhap so dien thoai -> Ma OTP 6 so se gui thang
      ve dien thoai cua ban qua Telegram.

4. Dua len mang mien phi (Render.com) de dien thoai truy cap tu xa:
   - Day thu muc nay len GitHub (file .gitignore da tu dong chan .env va node_modules).
   - Vao https://render.com -> New -> Web Service -> chon repo GitHub vua day.
   - Build Command: npm install
   - Start Command: node server.js
   - Vao muc Environment Variables tren Render, them du 3 bien:
     MONGODB_URI, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
   - Bam Deploy Web Service va cho hien chu "Live".
