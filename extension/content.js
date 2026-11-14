(function () {
  if (window.__MS_EXTENSION_INIT__) return;
  window.__MS_EXTENSION_INIT__ = true;

  // ================= SAFE HELPERS =================
  const alive = () => {
    try { return !!chrome?.runtime?.id; } catch (e) { return false; }
  };

  function safeStorageSet(data, callback) {
    if (!alive()) return;
    try { chrome.storage.local.set(data, callback); } catch (e) { /* context invalidated */ }
  }

  function safeSendMessage(message, callback) {
    if (!alive()) return;
    try {
      chrome.runtime.sendMessage(message, (resp) => {
        const err = chrome.runtime.lastError; // read to avoid "Unchecked runtime.lastError"
        if (callback) callback(err ? null : resp);
      });
    } catch (e) {
      if (callback) callback(null);
    }
  }

  function debounce(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  // ================= CONFIG (read once, kept in sync) =================
  let settings = MS.withDefaults(null);
  let buttons = [];

  function loadConfig(done) {
    if (!alive()) return;
    try {
      chrome.storage.local.get(['genSettings', 'userButtons'], (res) => {
        if (chrome.runtime.lastError) return;
        settings = MS.withDefaults(res?.genSettings);
        buttons = Array.isArray(res?.userButtons) ? res.userButtons : [];
        if (done) done();
      });
    } catch (e) { /* context invalidated */ }
  }

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.genSettings) settings = MS.withDefaults(changes.genSettings.newValue);
      if (changes.userButtons) buttons = Array.isArray(changes.userButtons.newValue) ? changes.userButtons.newValue : [];
      applyButtonVisibility();
      hideMenu(); // rebuilt with the new settings on the next open
      if (settings.showMS === false) hidePanel();
    });
  } catch (e) { /* context invalidated */ }

  // ================= KEYS =================
  const MODIFIERS = new Set(['shift', 'control', 'alt', 'meta']);
  const pressedKeys = new Set();

  document.addEventListener('keydown', (e) => {
    const key = String(e.key || '').toLowerCase();
    pressedKeys.add(key);
    if (handleMenuKey(e)) return; // keyboard control of the open ⚡ menu
    // Typing hides the panel, but holding a modifier / the configured hold key must not.
    if (e.repeat || MODIFIERS.has(key)) return;
    if (settings.holdKey && key === String(settings.holdKey).toLowerCase()) return;
    hidePanel();
  }, true);
  document.addEventListener('keyup', (e) => pressedKeys.delete(String(e.key || '').toLowerCase()), true);
  window.addEventListener('blur', () => pressedKeys.clear());

  // ================= STYLES =================
  function injectStyles() {
    const STYLE_ID = 'ms-extension-main-styles';
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes msFade {
        0% {opacity:0; transform: scale(0.6) translateY(8px);}
        100% {opacity:1; transform: scale(1) translateY(0);}
      }
      #ms-container {
        position: absolute; display: none; gap: 5px; z-index: 2147483647;
        align-items: center; pointer-events: auto;
      }
      #ms-container.active { display: flex !important; animation: msFade 0.15s ease forwards; }

      .ms-popup-generic-btn {
        box-sizing: border-box !important;
        line-height: 1 !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        min-height: 22px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: bold !important;
        text-align: center !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6) !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
        transition: transform 0.1s, filter 0.1s !important;
        user-select: none !important;
      }
      .ms-popup-generic-btn:hover { filter: brightness(1.0); transform: scale(1.1); }
      .ms-popup-generic-btn:active { transform: scale(0.9); }

      #ms-popup-btn { background: linear-gradient(135deg, #1a1a1a, #333); color: #00b36b; }
      #gs-popup-btn { background: linear-gradient(135deg, #16202c, #253447); color: #3498db; }
      #tr-popup-btn { background: linear-gradient(135deg, #1e2a38, #34495e); color: #5dade2; }
      #cp-popup-btn { background: linear-gradient(135deg, #1a1a2e, #313157); color: #9d9dff; }

      #ms-tr-result {
        position: absolute; background: #1e1e1e; color: #eee;
        padding: 12px; border-radius: 8px; border: 1px solid #444;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 2147483647;
        font-family: sans-serif; font-size: 14px; line-height: 1.4;
        visibility: hidden; pointer-events: auto; text-align: left;
        animation: msFade 0.2s ease;
      }
      #ms-tr-result .ms-tr-head {
        display: flex; justify-content: space-between; margin-bottom: 8px;
        border-bottom: 1px solid #333; padding-bottom: 4px;
      }
      #ms-tr-result .ms-tr-title { font-size: 10px; color: #aaa; font-weight: bold; text-transform: uppercase; }
      #ms-tr-result .ms-tr-close { cursor: pointer; color: #888; font-size: 12px; }
      #ms-tr-result .ms-tr-body { max-height: 350px; overflow-y: auto; word-wrap: break-word; white-space: pre-wrap; }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  // ================= TRANSLATION POPUP =================
  const TR_TEXT = {
    uk: { title: 'Переклад', error: 'Помилка перекладу' },
    ru: { title: 'Перевод', error: 'Ошибка перевода' },
    en: { title: 'Translation', error: 'Translation error' },
    fr: { title: 'Traduction', error: 'Erreur de traduction' },
    de: { title: 'Übersetzung', error: 'Übersetzungsfehler' },
    es: { title: 'Traducción', error: 'Error de traducción' },
    it: { title: 'Traduzione', error: 'Errore di traduzione' },
    pl: { title: 'Tłumaczenie', error: 'Błąd tłumaczenia' }
  };

  let outsideClickHandler = null;
  let trRequestId = 0;

  function closeTranslationPopup() {
    trRequestId++; // ignore any response still in flight
    document.getElementById('ms-tr-result')?.remove();
    if (outsideClickHandler) {
      document.removeEventListener('mousedown', outsideClickHandler);
      outsideClickHandler = null;
    }
  }

  // lang = target language code (any from MS.TRANSLATE_LANGS); the popup's own words use the interface language
  function showTranslationPopup(text, anchor, lang) {
    const ui = MS.SUPPORTED.includes(settings.language) ? settings.language : MS.defaultLang();
    injectStyles();
    let popup = document.getElementById('ms-tr-result');
    let body;

    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'ms-tr-result';

      const head = document.createElement('div');
      head.className = 'ms-tr-head';
      const title = document.createElement('span');
      title.className = 'ms-tr-title';
      title.textContent = `${(TR_TEXT[ui] || TR_TEXT.en).title} → ${MS.TRANSLATE_LANGS[lang] || lang.toUpperCase()}`;
      const close = document.createElement('span');
      close.className = 'ms-tr-close';
      close.textContent = '✕';
      close.addEventListener('click', (e) => { e.stopPropagation(); closeTranslationPopup(); });
      head.append(title, close);

      body = document.createElement('div');
      body.className = 'ms-tr-body';
      body.dir = 'auto'; // right-to-left targets (Arabic, Hebrew, Persian) read correctly
      popup.append(head, body);
      document.body.appendChild(popup);

      outsideClickHandler = (e) => {
        if (!popup.contains(e.target)) closeTranslationPopup();
      };
      setTimeout(() => {
        if (outsideClickHandler) document.addEventListener('mousedown', outsideClickHandler);
      }, 10);
    } else {
      body = popup.querySelector('.ms-tr-body');
    }

    body.textContent = text; // never innerHTML: the text comes from an external service

    const popupWidth = 400;
    popup.style.width = `${popupWidth}px`;
    popup.style.visibility = 'hidden';

    const popupHeight = popup.offsetHeight;
    const margin = 50;
    const selection = window.getSelection();
    let rect = selection.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : null;
    if (!rect || (!rect.width && !rect.height)) {
      const y = anchor.y - window.scrollY, x = anchor.x - window.scrollX;
      rect = { top: y, bottom: y, left: x, right: x };
    }

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 10;
    if (top + popupHeight > window.scrollY + window.innerHeight - margin) {
      top = rect.top + window.scrollY - popupHeight - 10;
    }
    const maxX = window.scrollX + window.innerWidth - popupWidth - margin;
    left = Math.max(window.scrollX + margin, Math.min(left, maxX));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.visibility = 'visible';
  }

  // ================= PANEL =================
  let container = null;

  function hidePanel() {
    container?.classList.remove('active');
    hideMenu();
  }

  // ================= INLINE SEARCH MENU (opened by ⚡ next to the panel) =================
  // Same buttons, colors, fonts and layout as the extension popup, just smaller.
  // Lives in a closed shadow root, so page CSS cannot break it.
  let menuHost = null;
  let menuRoot = null;
  let menuText = '';
  let menuItems = [];   // buttons in visual order, for keyboard navigation
  let menuActive = -1;  // index in menuItems highlighted by the keyboard

  function inlineScale() {
    const v = Number(settings.inlineScale);
    return (Number.isFinite(v) ? Math.min(100, Math.max(60, v)) : 75) / 100;
  }

  function menuIsOpen() {
    return !!menuHost && menuHost.isConnected && menuHost.style.getPropertyValue('display') !== 'none';
  }

  function hideMenu() {
    if (menuHost) menuHost.style.setProperty('display', 'none', 'important');
  }

  function menuFont() {
    if (settings.useCustomFont && settings.customFontName) {
      return `'${String(settings.customFontName).replace(/['"\\;{}]/g, '')}', 'Rubik', sans-serif`;
    }
    return String(settings.font || "'Rubik', sans-serif").replace(/[;{}<>]/g, '') + ", -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
  }

  function menuCss() {
    const s = inlineScale();
    const px = (v) => `${Math.round(v * s * 10) / 10}px`;
    const fontSize = Math.max(8, Math.round(Math.min(24, Math.max(8, Number(settings.fontSize) || 14)) * s));
    const LIGHT = '--m-bg: #f4f5f7; --m-text: #222; --m-border: #d9dde2; --m-shadow: rgba(0,0,0,.18); --m-go-bg: #ffffff; --m-go-border: #d9dde2; --m-muted: #777;' +
      ' --m-btn: 0 1px 2px rgba(16,24,40,.22), 0 2px 6px rgba(16,24,40,.12), inset 0 1px 0 rgba(255,255,255,.28), inset 0 -2px 0 rgba(0,0,0,.14);' +
      ' --m-btn-h: 0 3px 6px rgba(16,24,40,.22), 0 8px 18px rgba(16,24,40,.16), inset 0 1px 0 rgba(255,255,255,.3), inset 0 -2px 0 rgba(0,0,0,.14);';
    const DARK = '--m-bg: #0f0f0f; --m-text: #eee; --m-border: #333; --m-shadow: rgba(0,0,0,.6); --m-go-bg: #1a1a1a; --m-go-border: #333; --m-muted: #777;' +
      ' --m-btn: 0 1px 2px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.12), inset 0 -2px 0 rgba(0,0,0,.22);' +
      ' --m-btn-h: 0 4px 14px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.14), inset 0 -2px 0 rgba(0,0,0,.22);';
    const themeCss = settings.theme === 'light'
      ? `.wrap { ${LIGHT} }`
      : settings.theme === 'auto'
        ? `.wrap { ${DARK} } @media (prefers-color-scheme: light) { .wrap { ${LIGHT} } }`
        : `.wrap { ${DARK} }`;
    return `
      :host { all: initial; }
      ${themeCss}
      @keyframes msMenuIn { from { opacity: 0; transform: translateY(-4px) scale(.97); } to { opacity: 1; transform: none; } }
      .wrap {
        box-sizing: border-box; width: ${px(settings.menuWidth)}; padding: ${px(12)};
        background: var(--m-bg); color: var(--m-text); border: 1px solid var(--m-border); border-radius: ${px(12)};
        box-shadow: 0 8px 24px var(--m-shadow);
        display: flex; flex-direction: column; gap: ${px(6)};
        font-family: ${menuFont()}; font-size: ${fontSize}px; font-weight: 500;
        animation: msMenuIn .12s ease;
      }
      /* one gap for rows and for buttons inside a row */
      .row { display: flex; gap: ${px(6)}; align-items: center; }
      .mini-group { flex: 1; display: flex; gap: ${px(6)}; min-width: 0; }
      button {
        all: unset; box-sizing: border-box; cursor: pointer; display: block;
        height: ${px(38)}; line-height: ${px(38)}; padding: 0 ${px(4)};
        border-radius: ${px(6)}; text-align: center; font: inherit;
        text-transform: uppercase; text-shadow: 2px 2px 3px rgba(0,0,0,.8);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        /* own GPU layer + only transform/shadow/brightness animated → text scales smoothly, no jitter */
        position: relative; transform: translateZ(0); backface-visibility: hidden; will-change: transform;
        -webkit-font-smoothing: antialiased;
        transition: transform .18s cubic-bezier(.2,.8,.2,1), box-shadow .18s ease, filter .18s ease;
      }
      button:active { transform: translateZ(0) scale(.97); transition-duration: .08s; }
      /* depth: soft drop shadow + light top edge + darker bottom edge (visible in both themes) */
      .big, .mini { flex: 1; min-width: 0; box-shadow: var(--m-btn); }
      /* growth stays below half of the gap, so a button never covers its neighbours */
      .big:hover { transform: translateZ(0) scale(1.02); box-shadow: var(--m-btn-h); filter: brightness(1.06); z-index: 1; }
      .mini:hover { transform: translateZ(0) scale(1.03); box-shadow: var(--m-btn-h); filter: brightness(1.06); z-index: 1; }
      .go {
        flex: none; width: ${px(42)}; padding: 0; background: var(--m-go-bg); color: #00ff88;
        border: 1px solid var(--m-go-border); font-size: ${px(18)}; text-shadow: none; box-shadow: var(--m-btn);
      }
      .go:hover { transform: translateZ(0) scale(1.06); z-index: 1; box-shadow: 0 0 4px rgba(255,149,0,.3), var(--m-btn-h); filter: drop-shadow(0 0 3px rgba(255,170,0,.45)); }
      .empty { color: var(--m-muted); font-size: ${px(11)}; text-align: center; padding: ${px(4)}; }
      .ico {
        width: 1.25em; height: 1.25em; margin-right: .4em; vertical-align: -.25em;
        border-radius: 3px; filter: drop-shadow(0 1px 1px rgba(0,0,0,.5));
      }
      button.kbd { outline: 2px solid #44BBA4; outline-offset: 1px; transform: translateZ(0) scale(1.02); z-index: 1; }
    `;
  }

  function ensureMenuHost() {
    if (menuHost && menuHost.isConnected) return;
    menuHost = document.createElement('div');
    menuHost.id = 'ms-inline-menu';
    menuHost.style.cssText = 'all: initial !important; position: absolute !important; z-index: 2147483647 !important; display: none !important; top: 0 !important; left: 0 !important;';
    menuRoot = menuHost.attachShadow({ mode: 'closed' });
    // keep the page selection alive and stop page handlers from seeing these clicks
    menuHost.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); });
    document.body.appendChild(menuHost);
  }

  function openSearchFromMenu(index, direct) {
    const btn = buttons[index];
    const text = menuText;
    hidePanel();
    if (!btn || !text) return;
    const url = MS.buildSearchUrl(btn.url, MS.cleanQuery(text));
    if (url && /^spotify:/i.test(url)) {
      MS.addHistory(text);
      window.location.href = url; // hands off to the desktop app, the page stays
      return;
    }
    safeSendMessage({ action: 'open_search', index, text, direct: !!direct });
  }

  function buildMenu() {
    ensureMenuHost();
    menuRoot.textContent = '';
    menuItems = [];
    menuActive = -1;
    const style = document.createElement('style');
    style.textContent = menuCss();
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    menuRoot.append(style, wrap);

    const makeBtn = (cls, label, cfg) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = cls;
      b.title = label;
      if (cfg) {
        b.style.background = cfg.color || '#333';
        b.style.color = cfg.textColor || '#fff';
        const icon = settings.showFavicons ? MS.faviconUrl(cfg.url, 32) : '';
        if (icon) {
          const img = document.createElement('img');
          img.className = 'ico';
          img.alt = '';
          img.src = icon;
          img.addEventListener('error', () => img.remove());
          b.appendChild(img);
        }
      }
      b.appendChild(document.createTextNode(label));
      menuItems.push(b);
      return b;
    };

    const addRow = (items, large) => {
      const row = document.createElement('div');
      row.className = 'row';
      if (large) {
        const { cfg, index } = items[0];
        const b = makeBtn('big', cfg.name, cfg);
        b.addEventListener('click', () => openSearchFromMenu(index, false));
        row.appendChild(b);
      } else {
        const group = document.createElement('div');
        group.className = 'mini-group';
        items.forEach(({ cfg, index }) => {
          const b = makeBtn('mini', cfg.name, cfg);
          b.addEventListener('click', () => openSearchFromMenu(index, false));
          group.appendChild(b);
        });
        row.appendChild(group);
      }
      if (settings.showGo) {
        const go = makeBtn('go', '⚡');
        go.title = '';
        // ⚡ opens the first result of the last button in the row (same as the popup)
        go.addEventListener('click', () => openSearchFromMenu(items[items.length - 1].index, true));
        row.appendChild(go);
      }
      wrap.appendChild(row);
    };

    const visible = buttons
      .map((cfg, index) => ({ cfg, index }))
      .filter(({ cfg }) => cfg && cfg.active && cfg.name && cfg.url);

    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = '—';
      wrap.appendChild(empty);
      return;
    }

    let miniBuffer = [];
    const flushMinis = () => { if (miniBuffer.length) { addRow(miniBuffer, false); miniBuffer = []; } };
    visible.forEach((item) => {
      if (item.cfg.type === 'large') {
        flushMinis();
        addRow([item], true);
      } else {
        miniBuffer.push(item);
        if (miniBuffer.length === 2) flushMinis();
      }
    });
    flushMinis();
  }

  function positionMenu() {
    const anchor = container.querySelector('#ms-popup-btn').getBoundingClientRect();
    const panelRect = container.getBoundingClientRect();
    menuHost.style.setProperty('visibility', 'hidden', 'important');
    menuHost.style.setProperty('display', 'block', 'important');
    const w = menuHost.offsetWidth, h = menuHost.offsetHeight;
    const gap = 6, margin = 6;

    let left = anchor.left;
    if (left + w > window.innerWidth - margin) left = window.innerWidth - margin - w;
    left = Math.max(margin, left);

    let top = panelRect.bottom + gap; // below the panel by default
    if (top + h > window.innerHeight - margin && panelRect.top - gap - h >= margin) {
      top = panelRect.top - gap - h; // not enough room below: open above
    }

    // !important: the host's "all: initial !important" would otherwise win over left/top
    menuHost.style.setProperty('left', `${left + window.scrollX}px`, 'important');
    menuHost.style.setProperty('top', `${top + window.scrollY}px`, 'important');
    menuHost.style.setProperty('visibility', 'visible', 'important');
  }

  function toggleMenu(text, fromKeyboard) {
    if (menuIsOpen()) { hideMenu(); return; }
    menuText = text;
    buildMenu();
    positionMenu();
    // long names shrink a little before "…" (buttons are text blocks here, so the button is the label)
    MS.fitLabels(menuItems.filter((b) => !b.classList.contains('go')), (b) => b);
    menuRoot.querySelectorAll('.mini-group').forEach((g) => MS.evenRow(g.querySelectorAll('.mini')));
    if (fromKeyboard) highlightMenuItem(0);
  }

  function highlightMenuItem(i) {
    if (!menuItems.length) return;
    menuActive = (i + menuItems.length) % menuItems.length;
    menuItems.forEach((b, n) => b.classList.toggle('kbd', n === menuActive));
  }

  // Arrows / Tab move, Enter opens, 1–9 open the n-th search button, Esc closes.
  // Returns true when the key was used by the menu.
  function handleMenuKey(e) {
    if (!menuIsOpen() || e.ctrlKey || e.metaKey || e.altKey) return false;
    const k = e.key;
    let used = true;
    if (k === 'ArrowDown' || k === 'ArrowRight' || (k === 'Tab' && !e.shiftKey)) highlightMenuItem(menuActive + 1);
    else if (k === 'ArrowUp' || k === 'ArrowLeft' || (k === 'Tab' && e.shiftKey)) highlightMenuItem(menuActive < 0 ? -1 : menuActive - 1);
    else if (k === 'Enter') (menuItems[menuActive] || menuItems[0])?.click();
    else if (/^[1-9]$/.test(k)) {
      const searchBtns = menuItems.filter((b) => !b.classList.contains('go'));
      const b = searchBtns[Number(k) - 1];
      if (b) b.click(); else used = false;
    } else used = false;
    if (used) { e.preventDefault(); e.stopPropagation(); }
    return used;
  }

  // Places the small ⚡ panel next to the current selection. Returns false when there is none.
  function showPanelAtSelection(mouse) {
    const selection = window.getSelection();
    let rect = selection.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : null;
    if (!rect || (!rect.width && !rect.height)) {
      if (mouse) {
        // selection inside <input>/<textarea>: use the mouse position instead
        rect = { top: mouse.clientY, bottom: mouse.clientY, left: mouse.clientX, right: mouse.clientX };
      } else {
        const el = document.activeElement;
        if (!el || el === document.body) return false;
        const r = el.getBoundingClientRect();
        rect = { top: r.top, bottom: r.top, left: r.left + Math.min(r.width, 200), right: r.left + Math.min(r.width, 200) };
      }
    }
    const panel = ensurePanel();
    let left = rect.right + window.scrollX + 5;
    let top = rect.top + window.scrollY - 28;
    if (left + 120 > window.scrollX + window.innerWidth) left = rect.left + window.scrollX - 125;
    if (top < window.scrollY + 5) top = rect.bottom + window.scrollY + 5;

    panel.style.left = `${Math.max(window.scrollX + 2, left)}px`;
    panel.style.top = `${top}px`;
    panel.classList.add('active');
    return true;
  }

  // Hotkey (chrome://extensions/shortcuts) → background → here
  try {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (!msg || msg.action !== 'show_menu' || sender.id !== chrome.runtime.id) return;
      const text = getSelectedText();
      if (!text) { sendResponse({ ok: false, reason: 'no_text' }); return; }
      if (!settings.inlineButtons) { sendResponse({ ok: false, reason: 'popup_mode' }); return; }
      if (!showPanelAtSelection(null)) { sendResponse({ ok: false }); return; }
      hideMenu();
      toggleMenu(text, true);
      sendResponse({ ok: true });
    });
  } catch (e) { /* context invalidated */ }

  document.addEventListener('mousedown', (e) => {
    if (!menuIsOpen()) return;
    if (e.composedPath().includes(menuHost)) return;
    if (e.target?.closest?.('#ms-popup-btn')) return; // ⚡ toggles the menu itself
    hideMenu();
  }, true);

  function getSelectedText() {
    return window.getSelection().toString().trim();
  }

  function flashButton(btn, symbol) {
    const old = btn.textContent;
    btn.textContent = symbol;
    setTimeout(() => { btn.textContent = old; }, 700);
  }

  function copyText(text, btn) {
    const done = () => flashButton(btn, '✓');
    const fallback = () => { try { if (document.execCommand('copy')) done(); } catch (e) { /* ignore */ } };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback(); // plain http pages have no Clipboard API; copies the current selection
  }

  function applyButtonVisibility() {
    if (!container) return;
    const map = { 'gs-popup-btn': 'showGS', 'tr-popup-btn': 'showTR', 'cp-popup-btn': 'showCP' };
    for (const [id, key] of Object.entries(map)) {
      const el = container.querySelector('#' + id);
      if (el) el.style.display = settings[key] === false ? 'none' : '';
    }
    // order chosen in the settings (appendChild moves the existing element)
    MS.normalizeOrder(settings.panelOrder).forEach((k) => {
      const el = container.querySelector(`#${k}-popup-btn`);
      if (el) container.appendChild(el);
    });
  }

  function bindButton(id, handler) {
    container.querySelector('#' + id).addEventListener('mousedown', (e) => {
      e.preventDefault(); // keep the text selection
      e.stopPropagation();
      handler(e);
    });
  }

  function ensurePanel() {
    if (container && container.isConnected) return container;
    injectStyles();

    container = document.createElement('div');
    container.id = 'ms-container';

    [
      ['ms-popup-btn', '⚡'],
      ['gs-popup-btn', '🔍'],
      ['tr-popup-btn', '🌍'],
      ['cp-popup-btn', '📋']
    ].forEach(([id, txt]) => {
      const b = document.createElement('div');
      b.id = id;
      b.className = 'ms-popup-generic-btn';
      b.textContent = txt;
      container.appendChild(b);
    });
    document.body.appendChild(container);

    bindButton('ms-popup-btn', () => {
      const s = getSelectedText();
      if (!s) return;
      if (settings.inlineButtons) { toggleMenu(s); return; }
      safeStorageSet({ sharedText: s, sharedTextAt: Date.now() }, () => safeSendMessage({ action: 'open_popup' }));
    });

    bindButton('gs-popup-btn', () => {
      const s = getSelectedText();
      if (s) window.open(`https://www.google.com/search?q=${encodeURIComponent(s.slice(0, 500))}`, '_blank', 'noopener');
    });

    bindButton('tr-popup-btn', (e) => {
      const text = getSelectedText();
      if (!text) return;
      const lang = MS.translateTarget(settings);
      const ui = MS.SUPPORTED.includes(settings.language) ? settings.language : MS.defaultLang();
      const anchor = { x: e.pageX, y: e.pageY };
      showTranslationPopup('...', anchor, lang);
      const myId = ++trRequestId;
      safeSendMessage({ action: 'translate', text, tl: lang }, (resp) => {
        if (myId !== trRequestId) return; // popup was closed or a newer request started
        showTranslationPopup(resp?.ok ? resp.text : (TR_TEXT[ui] || TR_TEXT.en).error, anchor, lang);
      });
    });

    bindButton('cp-popup-btn', (e) => {
      const text = getSelectedText();
      if (text) copyText(text, e.currentTarget || container.querySelector('#cp-popup-btn'));
    });

    applyButtonVisibility();
    return container;
  }

  function mustHoldKey() {
    const host = window.location.hostname.toLowerCase();
    if (settings.requireHoldKeyAll) return true;
    if (settings.requireHoldKeyOnList) {
      return (settings.holdKeySites || []).some((site) => {
        const s = String(site).toLowerCase().trim();
        return s && host.includes(s);
      });
    }
    return false;
  }

  const handleMouseUp = debounce((e) => {
    if (!alive()) return;
    if (container && container.contains(e.target)) return;
    if (menuHost && menuHost.contains(e.target)) return;

    const selection = window.getSelection();
    if (!selection.toString().trim()) { hidePanel(); return; }
    if (settings.showMS === false) { hidePanel(); return; }

    if (mustHoldKey() && settings.holdKey && !pressedKeys.has(String(settings.holdKey).toLowerCase())) {
      hidePanel();
      return;
    }

    showPanelAtSelection(e);
  }, 120);

  document.addEventListener('mouseup', handleMouseUp);

  // ================= AUTO-REDIRECT (the ⚡ button in the popup) =================
  function runAutoRedirect() {
    const selectors = buttons
      .filter((b) => b && b.sel && b.url && MS.sameSite(b.url, location.href))
      .map((b) => b.sel);
    if (!selectors.length) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      for (const sel of selectors) {
        let el = null;
        try { el = document.querySelector(sel); } catch (e) { /* invalid selector */ }
        if (!el) continue;
        const link = el.href ? el : (el.closest('a[href]') || el.querySelector('a[href]'));
        // Only follow links that stay on the same site as the search page.
        if (link && link.href && MS.sameSite(link.href, location.href)) {
          clearInterval(interval);
          location.replace(link.href); // replace: the Back button must not bounce into the redirect again
          return;
        }
      }
      if (attempts >= 40) clearInterval(interval);
    }, 100);
  }

  // ================= INIT =================
  loadConfig(() => {
    if (location.hash === '#auto-redirect') runAutoRedirect();
  });
})();
