/**
 * ==============================================================================
 * BỘ CÔNG CỤ CHỈNH SỬA TRỰC TIẾP GIAO DIỆN & THÔNG SỐ (LIVE UI & DATA CUSTOMIZER)
 * Tác giả: HueIC Smartschool S-Edu 2026
 * Chức năng:
 *   1. Chỉnh sửa văn bản trực tiếp trên màn hình (Inline ContentEditable Mode).
 *   2. Tùy chỉnh thông số hệ thống (Tên trường, Tên SV, Mã SV, GVCN, Lớp, Học phí).
 *   3. Tùy biến màu sắc, cỡ chữ, độ bo góc toàn trang (Live Theme Engine).
 *   4. Lưu trữ vĩnh viễn vào LocalStorage, tự động khôi phục và đồng bộ tức thì.
 * ==============================================================================
 */

(function () {
  'use strict';

  // 1. CẤU HÌNH THEME & THÔNG SỐ MẶC ĐỊNH
  const DEFAULT_CONFIG = {
    themeColor: 'DEFAULT',
    fontSize: '15px',
    borderRadius: '16px',
    schoolName: 'Trường Cao Đẳng Công Nghiệp Huế (HueIC)',
    slogan: 'Cổng Đào Tạo & Sổ Liên Lạc Điện Tử Thông Minh',
    studentName: 'Nguyễn Hoàng Long',
    studentCode: 'HUEIC2601',
    className: 'CĐ CNTT K48A',
    teacherName: 'Thầy Nguyễn Văn An',
    tuitionAmount: '2850000',
    attendanceRate: '96%'
  };

  function getConfig() {
    try {
      const saved = localStorage.getItem('sll_custom_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : { ...DEFAULT_CONFIG };
    } catch (e) {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem('sll_custom_config', JSON.stringify(cfg));
  }

  // 2. BỘ PALETTE THEME MÀU SẮC
  const THEMES = {
    DEFAULT: { label: 'Xanh Navy (Mặc định HueIC)', primary: '#1e3a8a', bar: '#173a7d' },
    EMERALD: { label: 'Xanh Ngọc (Emerald)', primary: '#0e6251', bar: '#065f46' },
    INDIGO: { label: 'Tím Hiện Đại (Indigo)', primary: '#4f46e5', bar: '#4338ca' },
    AMBER: { label: 'Vàng Hổ Phách (Amber)', primary: '#d97706', bar: '#b45309' },
    CRIMSON: { label: 'Đỏ Thẫm (Crimson)', primary: '#b91c1c', bar: '#991b1b' },
    DARK: { label: 'Giao Diện Tối (Dark Mode)', primary: '#38bdf8', bar: '#0f172a' }
  };

  // Áp dụng Theme và Font size
  function applyThemeSettings(cfg) {
    if (!cfg) return;
    document.documentElement.style.fontSize = cfg.fontSize === '17px' ? '17px' : (cfg.fontSize === '19px' ? '19px' : '15px');

    let styleEl = document.getElementById('sll-live-theme-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'sll-live-theme-style';
      document.head.appendChild(styleEl);
    }

    if (cfg.themeColor === 'DARK') {
      styleEl.innerHTML = `
        body {
          background-color: #0b0f19 !important;
          color: #f1f5f9 !important;
        }
        header, .bg-amber-600, .bg-indigo-700, .bg-emerald-800, .bg-blue-900, .bg-\\[\\#173a7d\\], .bg-blue-950, .bg-indigo-900 {
          background-color: #0f172a !important;
          border-bottom: 1px solid #1e293b !important;
        }
        .bg-white, .bg-slate-50, .bg-slate-100 {
          background-color: #1e293b !important;
          color: #f8fafc !important;
          border-color: #334155 !important;
        }
        .text-slate-900, .text-slate-800, .text-slate-700 {
          color: #f1f5f9 !important;
        }
        .text-slate-600, .text-slate-500 {
          color: #94a3b8 !important;
        }
        .border-slate-100, .border-slate-200, .border-slate-300 {
          border-color: #334155 !important;
        }
        .rounded-2xl, .rounded-3xl {
          border-radius: ${cfg.borderRadius || '16px'} !important;
        }
      `;
    } else if (cfg.themeColor !== 'DEFAULT' && THEMES[cfg.themeColor]) {
      const t = THEMES[cfg.themeColor];
      styleEl.innerHTML = `
        header, .bg-amber-600, .bg-indigo-700, .bg-emerald-800, .bg-blue-900, .bg-\\[\\#173a7d\\], .bg-blue-950, .bg-indigo-900 {
          background-color: ${t.bar} !important;
        }
        button.bg-amber-600, button.bg-indigo-600, button.bg-emerald-700, button.bg-blue-800, button.bg-\\[\\#173a7d\\], button.bg-blue-900 {
          background-color: ${t.primary} !important;
        }
        .text-amber-700, .text-indigo-700, .text-emerald-700, .text-blue-800, .text-\\[\\#1e3a8a\\], .text-\\[\\#0e6251\\] {
          color: ${t.primary} !important;
        }
        .border-amber-500, .border-indigo-500, .border-emerald-500, .border-blue-800 {
          border-color: ${t.primary} !important;
        }
        .rounded-2xl, .rounded-3xl {
          border-radius: ${cfg.borderRadius || '16px'} !important;
        }
      `;
    } else {
      styleEl.innerHTML = cfg.borderRadius ? `
        .rounded-2xl, .rounded-3xl {
          border-radius: ${cfg.borderRadius} !important;
        }
      ` : '';
    }
  }

  // 3. ĐƯỜNG DẪN DOM DUY NHẤT & KHÔI PHỤC VĂN BẢN ĐÃ SỬA
  function getPageKey() {
    let name = window.location.pathname.split('/').pop() || 'index.html';
    if (!name || name === '') name = 'index.html';
    return 'sll_text_edits_' + name;
  }

  function getElementDomPath(el) {
    if (!el || el === document.body || el === document.documentElement) return '';
    if (el.id && !el.id.startsWith('sll-')) return '#' + el.id;
    const stack = [];
    while (el && el.parentNode && el.nodeName !== 'BODY' && el.nodeName !== 'HTML') {
      if (el.id && !el.id.startsWith('sll-')) {
        stack.unshift('#' + el.id);
        break;
      }
      let sibIndex = 1;
      let sibName = el.nodeName;
      let prev = el.previousElementSibling;
      while (prev) {
        if (prev.nodeName === sibName) sibIndex++;
        prev = prev.previousElementSibling;
      }
      stack.unshift(sibName.toLowerCase() + ':nth-of-type(' + sibIndex + ')');
      el = el.parentElement;
    }
    return stack.join(' > ');
  }

  let isEditModeActive = false;

  function applySavedTextEdits() {
    if (isEditModeActive) return; // Không can thiệp khi đang ở chế độ gõ sửa
    try {
      const pageKey = getPageKey();
      const edits = JSON.parse(localStorage.getItem(pageKey) || '{}');
      const paths = Object.keys(edits);
      if (paths.length === 0) return;

      paths.forEach(path => {
        try {
          const item = edits[path];
          const targetHtml = typeof item === 'object' ? item.html : item;
          let el = null;
          try {
            el = document.querySelector(path);
          } catch(err) {}

          // Fallback đối chiếu nội dung gốc nếu vị trí chuyển đổi nhẹ
          if (!el && item.origSnippet && item.tag) {
            const candidates = document.querySelectorAll(item.tag);
            for (let c of candidates) {
              if (c.innerText.trim() === item.origSnippet.trim()) {
                el = c;
                break;
              }
            }
          }

          if (el && el.innerHTML !== targetHtml) {
            el.innerHTML = targetHtml;
            el.setAttribute('data-sll-orig-html', targetHtml);
            el.setAttribute('data-sll-orig-text', el.innerText.trim());
          }
        } catch (e) {}
      });
    } catch (e) {}
  }

  // 4. BỘ ĐIỀU KHIỂN SỬA CHỮ TRỰC TIẾP (INLINE CONTENTEDITABLE ENGINE)
  const EDITABLE_TAGS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'TD', 'TH', 'LABEL', 'STRONG', 'B', 'EM', 'CODE', 'A', 'BUTTON', 'LI'];

  function isEligibleElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.closest('#sll-studio-drawer') || el.closest('#sll-studio-launcher') || el.closest('#sll-inline-edit-top-banner') || el.closest('#sll-studio-toast')) return false;
    if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'IMG', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.nodeName)) return false;
    if (el.children.length > 3) return false;
    const text = el.innerText ? el.innerText.trim() : '';
    return text.length > 0;
  }

  function createTopBanner() {
    let banner = document.getElementById('sll-inline-edit-top-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'sll-inline-edit-top-banner';
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(90deg, #d97706 0%, #b45309 100%);
        color: white;
        padding: 9px 16px;
        font-size: 13px;
        font-weight: 700;
        font-family: 'Be Vietnam Pro', sans-serif;
        text-align: center;
        z-index: 999999;
        box-shadow: 0 4px 15px rgba(180, 83, 9, 0.35);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      `;
      banner.innerHTML = `
        <span style="display: flex; align-items: center; gap: 6px;">
          <span>✏️</span>
          <span><strong>CHẾ ĐỘ SỬA CHỮ TRỰC TIẾP:</strong> Bạn hãy nhấp chuột vào bất kỳ chữ nào trên trang để gõ sửa như Word!</span>
        </span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="sll-quick-save-btn" style="background: #15803d; hover:background: #166534; color: white; border: none; padding: 5px 14px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 800; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <span>💾</span>
            <span>LƯU NGAY</span>
          </button>
          <button id="sll-quick-exit-btn" style="background: rgba(0,0,0,0.25); color: white; border: none; padding: 5px 10px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 700;">
            ✕ Thoát
          </button>
        </div>
      `;
      document.body.appendChild(banner);

      document.getElementById('sll-quick-save-btn').onclick = () => {
        const count = saveInlineEdits();
        showToast(`💾 Đã lưu thành công ${count} câu chữ vừa sửa vào bộ nhớ!`);
      };

      document.getElementById('sll-quick-exit-btn').onclick = () => {
        const toggleBtn = document.getElementById('sll-toggle-edit-mode-btn');
        if (toggleBtn) toggleBtn.click();
        else disableInlineEditing();
      };
    }
  }

  function enableInlineEditing() {
    isEditModeActive = true;
    createTopBanner();

    const all = document.querySelectorAll(EDITABLE_TAGS.join(','));
    all.forEach(el => {
      if (isEligibleElement(el)) {
        if (!el.hasAttribute('data-sll-orig-html')) {
          el.setAttribute('data-sll-orig-html', el.innerHTML);
          el.setAttribute('data-sll-orig-text', el.innerText.trim());
        }
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('data-sll-editable', 'true');
        el.style.outline = '1.5px dashed #2563eb';
        el.style.outlineOffset = '2px';
        el.style.cursor = 'text';
      }
    });
  }

  function disableInlineEditing() {
    isEditModeActive = false;
    const banner = document.getElementById('sll-inline-edit-top-banner');
    if (banner) banner.remove();

    document.querySelectorAll('[data-sll-editable="true"]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.style.outline = 'none';
      el.style.cursor = '';
    });
  }

  function saveInlineEdits() {
    const pageKey = getPageKey();
    let edits = {};
    try {
      edits = JSON.parse(localStorage.getItem(pageKey) || '{}');
    } catch (e) {
      edits = {};
    }

    let savedCount = 0;
    const editableElements = document.querySelectorAll('[data-sll-editable="true"]');
    editableElements.forEach(el => {
      const orig = el.getAttribute('data-sll-orig-html');
      const current = el.innerHTML;
      if (orig !== null && current !== orig) {
        const path = getElementDomPath(el);
        if (path) {
          edits[path] = {
            html: current,
            origSnippet: el.getAttribute('data-sll-orig-text') || '',
            tag: el.nodeName.toLowerCase()
          };
          savedCount++;
        }
      }
    });

    localStorage.setItem(pageKey, JSON.stringify(edits));
    return savedCount;
  }

  // 5. GIAO DIỆN BẢNG ĐIỀU KHIỂN NỔI (STUDIO DRAWER & LAUNCHER)
  function initLiveEditorUI() {
    const config = getConfig();
    applyThemeSettings(config);

    // Chạy khôi phục văn bản ngay và lập lịch đồng bộ với React
    applySavedTextEdits();
    setTimeout(applySavedTextEdits, 250);
    setTimeout(applySavedTextEdits, 650);
    setTimeout(applySavedTextEdits, 1200);

    // MutationObserver theo dõi thay đổi DOM từ React khi chuyển tab
    let debounceTimer = null;
    const rootEl = document.getElementById('root');
    if (rootEl) {
      const observer = new MutationObserver(() => {
        if (isEditModeActive) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applySavedTextEdits, 150);
      });
      observer.observe(rootEl, { childList: true, subtree: true });
    }

    // 5.1. Nút mở bảng điều khiển nổi ở góc dưới trái
    const floatBtn = document.createElement('div');
    floatBtn.id = 'sll-studio-launcher';
    floatBtn.style.cssText = `
      position: fixed;
      bottom: 22px;
      left: 22px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #1e3a8a 0%, #4338ca 100%);
      color: white;
      padding: 10px 18px;
      border-radius: 9999px;
      box-shadow: 0 10px 25px -3px rgba(30, 58, 138, 0.45), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      font-family: 'Be Vietnam Pro', sans-serif;
      font-size: 13px;
      font-weight: 800;
      user-select: none;
      transition: all 0.25s ease;
      border: 2px solid rgba(255, 255, 255, 0.25);
    `;
    floatBtn.innerHTML = `
      <span style="font-size: 16px;">🎨</span>
      <span>Tùy Chỉnh Giao Diện & Thông Số</span>
      <span style="background: rgba(255,255,255,0.22); padding: 2px 7px; border-radius: 9999px; font-size: 10px; text-transform: uppercase;">Live</span>
    `;

    floatBtn.onmouseenter = () => { floatBtn.style.transform = 'translateY(-2px) scale(1.03)'; };
    floatBtn.onmouseleave = () => { floatBtn.style.transform = 'translateY(0) scale(1)'; };
    floatBtn.onclick = toggleStudioDrawer;
    document.body.appendChild(floatBtn);

    // 5.2. Khung Bảng Điều Khiển Trượt (Drawer Panel)
    const drawer = document.createElement('div');
    drawer.id = 'sll-studio-drawer';
    drawer.style.cssText = `
      position: fixed;
      top: 0;
      right: -440px;
      width: 410px;
      max-width: 92vw;
      height: 100vh;
      background: #ffffff;
      box-shadow: -10px 0 35px rgba(0, 0, 0, 0.22);
      z-index: 100000;
      font-family: 'Be Vietnam Pro', sans-serif;
      transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-left: 1px solid #e2e8f0;
    `;

    drawer.innerHTML = `
      <!-- Header -->
      <div style="background: #172554; color: white; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 22px;">⚙️</span>
          <div>
            <h3 style="margin: 0; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Studio Tùy Biến Trực Tiếp</h3>
            <p style="margin: 2px 0 0 0; font-size: 11px; opacity: 0.8;">Chỉnh sửa màu sắc, thông số & câu chữ</p>
          </div>
        </div>
        <button id="sll-close-drawer-btn" style="background: rgba(255,255,255,0.15); border: none; color: white; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">✕</button>
      </div>

      <!-- Tab Buttons -->
      <div style="display: flex; background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 4px;">
        <button id="sll-tab-btn-ui" style="flex: 1; padding: 10px 6px; border: none; background: white; font-weight: 800; font-size: 12px; border-radius: 8px; cursor: pointer; color: #1e3a8a; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">🎨 Giao Diện</button>
        <button id="sll-tab-btn-data" style="flex: 1; padding: 10px 6px; border: none; background: transparent; font-weight: 700; font-size: 12px; border-radius: 8px; cursor: pointer; color: #64748b;">⚙️ Thông Số</button>
        <button id="sll-tab-btn-text" style="flex: 1; padding: 10px 6px; border: none; background: transparent; font-weight: 700; font-size: 12px; border-radius: 8px; cursor: pointer; color: #64748b;">✏️ Sửa Chữ</button>
      </div>

      <!-- Tab Content Area -->
      <div style="flex: 1; overflow-y: auto; padding: 18px;" class="custom-scroll">
        
        <!-- TAB 1: GIAO DIỆN & MÀU SẮC -->
        <div id="sll-tab-content-ui" style="display: block;">
          <div style="margin-bottom: 18px;">
            <label style="display: block; font-size: 12px; font-weight: 800; color: #1e293b; margin-bottom: 8px;">1. Bảng màu chủ đạo (Theme):</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              ${Object.keys(THEMES).map(k => `
                <button class="sll-theme-opt-btn" data-theme="${k}" style="padding: 10px; border: 2px solid ${config.themeColor === k ? '#2563eb' : '#e2e8f0'}; border-radius: 10px; background: ${config.themeColor === k ? '#eff6ff' : '#f8fafc'}; text-align: left; cursor: pointer; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                  <span style="width: 14px; height: 14px; border-radius: 50%; background: ${THEMES[k].primary}; display: inline-block; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></span>
                  <span style="color: #1e293b;">${THEMES[k].label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div style="margin-bottom: 18px;">
            <label style="display: block; font-size: 12px; font-weight: 800; color: #1e293b; margin-bottom: 6px;">2. Cỡ chữ toàn hệ thống:</label>
            <select id="sll-fontsize-select" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; outline: none;">
              <option value="15px" ${config.fontSize === '15px' ? 'selected' : ''}>Tiêu chuẩn (15px - Khuyên dùng)</option>
              <option value="17px" ${config.fontSize === '17px' ? 'selected' : ''}>To rõ ràng (17px - Dễ đọc hơn)</option>
              <option value="19px" ${config.fontSize === '19px' ? 'selected' : ''}>Cực lớn (19px - Cho phụ huynh lớn tuổi)</option>
            </select>
          </div>

          <div style="margin-bottom: 22px;">
            <label style="display: block; font-size: 12px; font-weight: 800; color: #1e293b; margin-bottom: 6px;">3. Kiểu dáng bo góc thẻ Card:</label>
            <select id="sll-radius-select" style="width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; outline: none;">
              <option value="16px" ${config.borderRadius === '16px' ? 'selected' : ''}>Bo cong mềm mại hiện đại (16px - Chuẩn)</option>
              <option value="24px" ${config.borderRadius === '24px' ? 'selected' : ''}>Bo tròn lớn nổi bật (24px)</option>
              <option value="8px" ${config.borderRadius === '8px' ? 'selected' : ''}>Vuông vắn công sở (8px)</option>
            </select>
          </div>

          <button id="sll-apply-ui-btn" style="width: 100%; padding: 12px; background: #1e3a8a; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);">
            💾 Áp Dụng & Lưu Giao Diện
          </button>
        </div>

        <!-- TAB 2: THÔNG SỐ DỮ LIỆU HỆ THỐNG -->
        <div id="sll-tab-content-data" style="display: none;">
          <p style="font-size: 11px; color: #64748b; margin-bottom: 14px; line-height: 1.5;">
            Sửa đổi các thông số bên dưới, hệ thống sẽ lưu vĩnh viễn và tự động đồng bộ ngay lập tức tới tất cả các cổng Học sinh, Giáo viên, Phụ huynh và Quản trị.
          </p>

          <div style="font-size: 12px;">
            <div style="margin-bottom: 11px;">
              <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Tên Nhà Trường:</label>
              <input id="sll-input-school-name" type="text" value="${config.schoolName}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; box-sizing: border-box;" />
            </div>

            <div style="margin-bottom: 11px;">
              <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Họ tên Sinh viên:</label>
              <input id="sll-input-student-name" type="text" value="${config.studentName}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; box-sizing: border-box;" />
            </div>

            <div style="margin-bottom: 11px;">
              <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Mã Sinh viên:</label>
              <input id="sll-input-student-code" type="text" value="${config.studentCode}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; box-sizing: border-box;" />
            </div>

            <div style="margin-bottom: 11px;">
              <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Lớp học phần:</label>
              <input id="sll-input-class-name" type="text" value="${config.className}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; box-sizing: border-box;" />
            </div>

            <div style="margin-bottom: 11px;">
              <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Giảng viên Cố vấn (GVCN):</label>
              <input id="sll-input-teacher-name" type="text" value="${config.teacherName}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; box-sizing: border-box;" />
            </div>

            <div style="margin-bottom: 14px;">
              <label style="display: block; font-weight: 700; color: #334155; margin-bottom: 4px;">Số tiền học phí (VNĐ):</label>
              <input id="sll-input-tuition" type="text" value="${config.tuitionAmount}" style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; font-weight: 600; box-sizing: border-box;" />
            </div>

            <button id="sll-apply-data-btn" style="width: 100%; padding: 12px; background: #0e6251; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(14, 98, 81, 0.3);">
              💾 Cập Nhật Thông Số Hệ Thống
            </button>
          </div>
        </div>

        <!-- TAB 3: CHẾ ĐỘ SỬA CHỮ TRỰC TIẾP (INLINE CONTENTEDITABLE) -->
        <div id="sll-tab-content-text" style="display: none;">
          <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
            <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 800; color: #3730a3;">✏️ Sửa Chữ Trực Tiếp Trên Màn Hình</h4>
            <p style="margin: 0; font-size: 11px; color: #4338ca; line-height: 1.6;">
              Khi bật chế độ này, bạn có thể <strong>nhấp chuột trực tiếp vào bất kỳ tiêu đề, đoạn văn, số liệu nào</strong> trên trang web để gõ sửa tùy thích như trong Microsoft Word!
            </p>
          </div>

          <button id="sll-toggle-edit-mode-btn" style="width: 100%; padding: 13px; background: #d97706; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25); display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>✏️</span>
            <span id="sll-toggle-edit-mode-text">Bật Chế Độ Sửa Chữ Trực Tiếp</span>
          </button>

          <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 8px;">
            <button id="sll-save-inline-edits-btn" style="width: 100%; padding: 11px; background: #16a34a; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer; box-shadow: 0 2px 6px rgba(22, 163, 74, 0.25);">
              💾 Lưu Lại Các Câu Chữ Đã Sửa
            </button>
            <button id="sll-reset-inline-edits-btn" style="width: 100%; padding: 9px; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; border-radius: 10px; font-weight: 700; font-size: 11px; cursor: pointer;">
              🔄 Khôi Phục Câu Chữ Ban Đầu
            </button>
          </div>
        </div>

      </div>

      <!-- Footer Reset -->
      <div style="padding: 12px 18px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">HueIC Studio 2026</span>
        <button id="sll-factory-reset-btn" style="background: transparent; border: none; color: #ef4444; font-size: 11px; font-weight: 700; cursor: pointer;">
          Khôi phục gốc toàn bộ
        </button>
      </div>
    `;

    document.body.appendChild(drawer);

    // 5.3. Sự kiện chuyển Tab
    const tabBtnUi = document.getElementById('sll-tab-btn-ui');
    const tabBtnData = document.getElementById('sll-tab-btn-data');
    const tabBtnText = document.getElementById('sll-tab-btn-text');
    const tabContentUi = document.getElementById('sll-tab-content-ui');
    const tabContentData = document.getElementById('sll-tab-content-data');
    const tabContentText = document.getElementById('sll-tab-content-text');

    function switchTab(activeBtn, activeContent) {
      [tabBtnUi, tabBtnData, tabBtnText].forEach(b => {
        b.style.background = 'transparent';
        b.style.color = '#64748b';
        b.style.boxShadow = 'none';
      });
      [tabContentUi, tabContentData, tabContentText].forEach(c => c.style.display = 'none');

      activeBtn.style.background = 'white';
      activeBtn.style.color = '#1e3a8a';
      activeBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
      activeContent.style.display = 'block';
    }

    tabBtnUi.onclick = () => switchTab(tabBtnUi, tabContentUi);
    tabBtnData.onclick = () => switchTab(tabBtnData, tabContentData);
    tabBtnText.onclick = () => switchTab(tabBtnText, tabContentText);

    // 5.4. Đóng mở Drawer
    document.getElementById('sll-close-drawer-btn').onclick = toggleStudioDrawer;

    // 5.5. Chọn Theme
    let currentThemeSelected = config.themeColor;
    drawer.querySelectorAll('.sll-theme-opt-btn').forEach(btn => {
      btn.onclick = () => {
        drawer.querySelectorAll('.sll-theme-opt-btn').forEach(b => {
          b.style.borderColor = '#e2e8f0';
          b.style.background = '#f8fafc';
        });
        btn.style.borderColor = '#2563eb';
        btn.style.background = '#eff6ff';
        currentThemeSelected = btn.getAttribute('data-theme');
        applyThemeSettings({
          ...config,
          themeColor: currentThemeSelected,
          fontSize: document.getElementById('sll-fontsize-select').value,
          borderRadius: document.getElementById('sll-radius-select').value
        });
      };
    });

    // 5.6. Bấm Áp Dụng Giao Diện
    document.getElementById('sll-apply-ui-btn').onclick = () => {
      const newCfg = {
        ...config,
        themeColor: currentThemeSelected,
        fontSize: document.getElementById('sll-fontsize-select').value,
        borderRadius: document.getElementById('sll-radius-select').value
      };
      saveConfig(newCfg);
      applyThemeSettings(newCfg);
      showToast('🎉 Đã lưu giao diện mới thành công!');
      toggleStudioDrawer();
    };

    // 5.7. Bấm Áp Dụng Thông Số
    document.getElementById('sll-apply-data-btn').onclick = () => {
      const schoolName = document.getElementById('sll-input-school-name').value.trim();
      const sName = document.getElementById('sll-input-student-name').value.trim();
      const sCode = document.getElementById('sll-input-student-code').value.trim();
      const cName = document.getElementById('sll-input-class-name').value.trim();
      const tName = document.getElementById('sll-input-teacher-name').value.trim();
      const tuition = document.getElementById('sll-input-tuition').value.trim();

      const newCfg = {
        ...config,
        schoolName: schoolName || config.schoolName,
        studentName: sName || config.studentName,
        studentCode: sCode || config.studentCode,
        className: cName || config.className,
        teacherName: tName || config.teacherName,
        tuitionAmount: tuition || config.tuitionAmount
      };
      saveConfig(newCfg);

      // Cập nhật sâu vào cơ sở dữ liệu dùng chung (sll_local_db)
      try {
        const db = JSON.parse(localStorage.getItem('sll_local_db') || '{}');
        if (db && db.students && db.students[0]) {
          db.students[0].full_name = sName;
          db.students[0].student_code = sCode;
          db.students[0].class_name = cName;
        }
        if (db && db.users) {
          const uTeacher = db.users.find(u => u.role === 'TEACHER');
          if (uTeacher) {
            uTeacher.full_name = tName;
            uTeacher.class_name = cName;
          }
          const uStudent = db.users.find(u => u.role === 'STUDENT');
          if (uStudent) {
            uStudent.full_name = sName;
            uStudent.student_code = sCode;
            uStudent.class_name = cName;
          }
          const uParent = db.users.find(u => u.role === 'PARENT');
          if (uParent && uParent.student) {
            uParent.student.full_name = sName;
            uParent.student.student_code = sCode;
            uParent.student.class_name = cName;
            uParent.student.advisor_name = tName;
          }
        }
        if (db) {
          if (!db.tuition) db.tuition = {};
          db.tuition.amount = tuition;
        }
        localStorage.setItem('sll_local_db', JSON.stringify(db));
        window.dispatchEvent(new StorageEvent('storage', { key: 'sll_local_db', newValue: JSON.stringify(db) }));
      } catch (err) {}

      showToast('💾 Đã cập nhật thông số hệ thống! Đang đồng bộ tới tất cả các cổng...');
      setTimeout(() => window.location.reload(), 500);
    };

    // 5.8. BẬT / TẮT Chế độ sửa chữ
    const toggleEditBtn = document.getElementById('sll-toggle-edit-mode-btn');
    const toggleEditText = document.getElementById('sll-toggle-edit-mode-text');

    toggleEditBtn.onclick = () => {
      isEditModeActive = !isEditModeActive;
      if (isEditModeActive) {
        enableInlineEditing();
        toggleEditText.innerText = 'TẮT Chế Độ Sửa Chữ';
        toggleEditBtn.style.background = '#dc2626';
        showToast('✏️ Đã BẬT sửa chữ! Nhấp vào chữ bất kỳ trên trang để gõ sửa.');
        toggleStudioDrawer();
      } else {
        disableInlineEditing();
        toggleEditText.innerText = 'Bật Chế Độ Sửa Chữ Trực Tiếp';
        toggleEditBtn.style.background = '#d97706';
        showToast('Đã tắt chế độ sửa chữ.');
      }
    };

    // Nút lưu chữ đã sửa
    document.getElementById('sll-save-inline-edits-btn').onclick = () => {
      const count = saveInlineEdits();
      showToast(`💾 Đã lưu vĩnh viễn ${count} câu chữ vừa sửa!`);
    };

    // Nút khôi phục chữ ban đầu
    document.getElementById('sll-reset-inline-edits-btn').onclick = () => {
      const pageKey = getPageKey();
      localStorage.removeItem(pageKey);
      showToast('Đã xóa câu chữ tùy biến. Đang khôi phục...');
      setTimeout(() => window.location.reload(), 400);
    };

    // Nút khôi phục gốc toàn bộ hệ thống
    document.getElementById('sll-factory-reset-btn').onclick = () => {
      if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ giao diện và dữ liệu về trạng thái ban đầu của HueIC?')) {
        localStorage.removeItem('sll_custom_config');
        localStorage.removeItem('sll_local_db');
        localStorage.removeItem('sll_parent_chat');
        const pageKey = getPageKey();
        localStorage.removeItem(pageKey);
        showToast('Đang khôi phục toàn bộ dữ liệu gốc...');
        setTimeout(() => window.location.reload(), 500);
      }
    };
  }

  function toggleStudioDrawer() {
    const drawer = document.getElementById('sll-studio-drawer');
    if (!drawer) return;
    const isOpen = drawer.style.right === '0px';
    drawer.style.right = isOpen ? '-440px' : '0px';
  }

  // 6. THÔNG BÁO TOAST NỔI
  function showToast(msg) {
    let t = document.getElementById('sll-studio-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'sll-studio-toast';
      t.style.cssText = `
        position: fixed;
        bottom: 78px;
        left: 22px;
        background: #0f172a;
        color: white;
        padding: 11px 18px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        z-index: 999999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        font-family: 'Be Vietnam Pro', sans-serif;
        border: 1px solid rgba(255,255,255,0.15);
        transition: opacity 0.3s;
      `;
      document.body.appendChild(t);
    }
    t.innerText = msg;
    t.style.opacity = '1';
    clearTimeout(t.timer);
    t.timer = setTimeout(() => { t.style.opacity = '0'; }, 3200);
  }

  // Khởi chạy khi DOM tải xong
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiveEditorUI);
  } else {
    initLiveEditorUI();
  }
})();
