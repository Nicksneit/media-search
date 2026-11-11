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
  let settings = {};
  let buttons = [];

  function loadConfig(done) {
    if (!alive()) return;
    try {
      chrome.storage.local.get(['genSettings', 'userButtons'], (res) => {
        if (chrome.runtime.lastError) return;
        settings = res?.genSettings || {};
        buttons = Array.isArray(res?.userButtons) ? res.userButtons : [];
        if (done) done();
      });
    } catch (e) { /* context invalidated */ }
  }

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.genSettings) settings = changes.genSettings.newValue || {};
      if (changes.userButtons) buttons = Array.isArray(changes.userButtons.newValue) ? changes.userButtons.newValue : [];
      applyButtonVisibility();
      if (settings.showMS === false) hidePanel();
    });
  } catch (e) { /* context invalidated */ }

  // ================= KEYS =================
  const MODIFIERS = new Set(['shift', 'control', 'alt', 'meta']);
  const pressedKeys = new Set();

  document.addEventListener('keydown', (e) => {
    const key = String(e.key || '').toLowerCase();
    pressedKeys.add(key);
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

  function showTranslationPopup(text, anchor, lang) {
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
      title.textContent = `${(TR_TEXT[lang] || TR_TEXT.en).title} (${lang.toUpperCase()})`;
      const close = document.createElement('span');
      close.className = 'ms-tr-close';
      close.textContent = '✕';
      close.addEventListener('click', (e) => { e.stopPropagation(); closeTranslationPopup(); });
      head.append(title, close);

      body = document.createElement('div');
      body.className = 'ms-tr-body';
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
  }

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
      if (s) safeStorageSet({ sharedText: s, sharedTextAt: Date.now() }, () => safeSendMessage({ action: 'open_popup' }));
    });

    bindButton('gs-popup-btn', () => {
      const s = getSelectedText();
      if (s) window.open(`https://www.google.com/search?q=${encodeURIComponent(s.slice(0, 500))}`, '_blank', 'noopener');
    });

    bindButton('tr-popup-btn', (e) => {
      const text = getSelectedText();
      if (!text) return;
      const lang = MS.SUPPORTED.includes(settings.language) ? settings.language : MS.defaultLang();
      const anchor = { x: e.pageX, y: e.pageY };
      showTranslationPopup('...', anchor, lang);
      const myId = ++trRequestId;
      safeSendMessage({ action: 'translate', text, tl: lang }, (resp) => {
        if (myId !== trRequestId) return; // popup was closed or a newer request started
        showTranslationPopup(resp?.ok ? resp.text : (TR_TEXT[lang] || TR_TEXT.en).error, anchor, lang);
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

    const selection = window.getSelection();
    if (!selection.toString().trim()) { hidePanel(); return; }
    if (settings.showMS === false) { hidePanel(); return; }

    if (mustHoldKey() && settings.holdKey && !pressedKeys.has(String(settings.holdKey).toLowerCase())) {
      hidePanel();
      return;
    }

    const panel = ensurePanel();
    let rect = selection.rangeCount ? selection.getRangeAt(0).getBoundingClientRect() : null;
    if (!rect || (!rect.width && !rect.height)) {
      // selection inside <input>/<textarea>: use the mouse position instead
      rect = { top: e.clientY, bottom: e.clientY, left: e.clientX, right: e.clientX };
    }

    let left = rect.right + window.scrollX + 5;
    let top = rect.top + window.scrollY - 28;
    if (left + 120 > window.scrollX + window.innerWidth) left = rect.left + window.scrollX - 125;
    if (top < window.scrollY + 5) top = rect.bottom + window.scrollY + 5;

    panel.style.left = `${Math.max(window.scrollX + 2, left)}px`;
    panel.style.top = `${top}px`;
    panel.classList.add('active');
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
