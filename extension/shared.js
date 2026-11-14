// Shared helpers: loaded by the service worker (importScripts), content script, popup and options page.
(function (root) {
  const SUPPORTED = ['uk', 'ru', 'en', 'fr', 'de', 'es', 'it', 'pl'];
  const MAX_QUERY = 300;

  // Languages offered for the 🌍 translation (Google Translate codes → native names).
  const TRANSLATE_LANGS = {
    en: 'English', uk: 'Українська', ru: 'Русский', de: 'Deutsch', fr: 'Français', es: 'Español',
    it: 'Italiano', pl: 'Polski', pt: 'Português', nl: 'Nederlands', cs: 'Čeština', sk: 'Slovenčina',
    bg: 'Български', ro: 'Română', hu: 'Magyar', el: 'Ελληνικά', sv: 'Svenska', da: 'Dansk',
    no: 'Norsk', fi: 'Suomi', lt: 'Lietuvių', lv: 'Latviešu', et: 'Eesti', sr: 'Српски',
    hr: 'Hrvatski', sl: 'Slovenščina', be: 'Беларуская', kk: 'Қазақ тілі', ka: 'ქართული',
    hy: 'Հայերեն', az: 'Azərbaycanca', tr: 'Türkçe', he: 'עברית', ar: 'العربية', fa: 'فارسی',
    hi: 'हिन्दी', th: 'ไทย', vi: 'Tiếng Việt', id: 'Bahasa Indonesia', ms: 'Bahasa Melayu',
    ja: '日本語', ko: '한국어', 'zh-CN': '中文（简体）', 'zh-TW': '中文（繁體）'
  };

  // Target language of the 🌍 button: a chosen language, or "auto" = the interface language.
  function translateTarget(settings) {
    const s = settings || {};
    if (s.translateTo && s.translateTo !== 'auto' && TRANSLATE_LANGS[s.translateTo]) return s.translateTo;
    return SUPPORTED.includes(s.language) ? s.language : defaultLang();
  }

  // Single source of default settings: every page merges the stored values over these.
  const DEFAULT_SETTINGS = {
    theme: 'dark',            // 'dark' | 'light' | 'auto'
    translateTo: 'auto',      // 'auto' = interface language, or a code from TRANSLATE_LANGS
    showMS: true,
    inlineButtons: true,
    inlineScale: 75,
    menuWidth: 250,           // width of the search-button menu (popup and ⚡ menu), px at 100%
    showGo: true,             // small ⚡ "first result" buttons at the right of every row
    panelOrder: ['ms', 'gs', 'tr', 'cp'], // order of the 4 buttons in the selection panel
    showFavicons: true,
    keepHistory: true,
    showGS: true,
    showTR: true,
    showCP: true,
    showContext: false,
    requireHoldKeyAll: false,
    requireHoldKeyOnList: false,
    holdKey: '',
    holdKeySites: [],
    font: "'Rubik', sans-serif",
    useCustomFont: false,
    customFontName: '',
    fontSize: 14,
    customLogo: ''
  };

  const PANEL_KEYS = ['ms', 'gs', 'tr', 'cp'];
  // Any order of the 4 keys; unknown / duplicate entries dropped, missing ones appended.
  function normalizeOrder(order) {
    const list = Array.isArray(order) ? order.filter((k, i) => PANEL_KEYS.includes(k) && order.indexOf(k) === i) : [];
    PANEL_KEYS.forEach((k) => { if (!list.includes(k)) list.push(k); });
    return list;
  }
  function clampWidth(v) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(400, Math.max(200, Math.round(n / 10) * 10)) : 250;
  }

  function withDefaults(stored) {
    const s = Object.assign({}, DEFAULT_SETTINGS, stored && typeof stored === 'object' ? stored : {});
    if (!['dark', 'light', 'auto'].includes(s.theme)) s.theme = DEFAULT_SETTINGS.theme;
    s.menuWidth = clampWidth(s.menuWidth);
    s.panelOrder = normalizeOrder(s.panelOrder);
    return s;
  }

  // Applies the theme to an extension page and remembers it, so the next page opens without a flash.
  function applyTheme(theme) {
    const t = ['dark', 'light', 'auto'].includes(theme) ? theme : DEFAULT_SETTINGS.theme;
    try { document.documentElement.dataset.theme = t; } catch (e) { /* no document (service worker) */ }
    try { localStorage.setItem('ms-theme', t); } catch (e) { /* storage blocked */ }
  }

  function defaultLang() {
    try {
      const l = (chrome.i18n.getUILanguage() || 'en').toLowerCase().split('-')[0];
      return SUPPORTED.includes(l) ? l : 'en';
    } catch (e) {
      return 'en';
    }
  }

  // Keeps letters (any alphabet), combining marks, digits and whitespace.
  function cleanQuery(text) {
    return String(text || '')
      .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_QUERY)
      .trim();
  }

  // Builds a search URL from a button template. Only http(s) and spotify: are allowed.
  function buildSearchUrl(baseUrl, query) {
    const base = String(baseUrl || '').trim();
    if (!base || !query) return null;
    const isSpotify = /^spotify:/i.test(base);
    if (!isSpotify && !/^https?:\/\//i.test(base)) return null;
    const q = encodeURIComponent(isSpotify ? query + ' soundtrack' : query);
    return base.includes('{searchTerms}') ? base.split('{searchTerms}').join(q) : base + q;
  }

  function hostOf(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
      return u.hostname.toLowerCase().replace(/^www\./, '');
    } catch (e) {
      return '';
    }
  }

  // True when both URLs are http(s) and belong to the same site (subdomains allowed).
  function sameSite(a, b) {
    const ha = hostOf(a), hb = hostOf(b);
    if (!ha || !hb) return false;
    return ha === hb || ha.endsWith('.' + hb) || hb.endsWith('.' + ha);
  }

  // Site icon from Chrome's own favicon cache (no request to any outside service).
  // Sites the user has never visited get Chrome's default globe icon.
  function faviconUrl(buttonUrl, size) {
    try {
      const u = new URL(String(buttonUrl || '').replace('{searchTerms}', ''));
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
      return chrome.runtime.getURL(`/_favicon/?pageUrl=${encodeURIComponent(u.origin)}&size=${size || 32}`);
    } catch (e) {
      return '';
    }
  }

  // Long button names first shrink a little (down to minRatio of the font size), then get "…".
  // getLabel(button) returns the element whose text may overflow.
  let measureCtx = null;
  function fitLabels(buttons, getLabel, minRatio) {
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    const ratio = minRatio || 0.7;
    buttons.forEach((b) => {
      const label = getLabel(b);
      if (!label) return;
      // start from the configured size every time (refits after a web font finished loading)
      if (b.dataset.baseSize === undefined) b.dataset.baseSize = b.style.fontSize || '';
      b.style.fontSize = b.dataset.baseSize;
      let size = parseFloat(getComputedStyle(b).fontSize) || 14;
      const min = size * ratio;
      // Width the label would need without "…" (canvas: exact, not rounded, not cut by the ellipsis)
      // plus the site icon, against the free space inside the button.
      const needed = () => {
        const cs = getComputedStyle(label);
        measureCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        let text = label.textContent || '';
        if (cs.textTransform === 'uppercase') text = text.toUpperCase();
        let w = measureCtx.measureText(text).width;
        const img = b.querySelector('img');
        if (img) {
          const ics = getComputedStyle(img);
          w += img.offsetWidth + (parseFloat(ics.marginLeft) || 0) + (parseFloat(ics.marginRight) || 0);
        }
        return w;
      };
      const room = () => {
        const cs = getComputedStyle(b);
        return b.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
      };
      while (needed() > room() - 1 && size > min) {
        size = Math.max(min, size - 0.5);
        b.style.fontSize = `${size}px`;
      }
    });
  }

  // Buttons that share a row get the same (smallest) font size, so the row looks even.
  function evenRow(buttons) {
    const list = Array.from(buttons);
    if (list.length < 2) return;
    const min = Math.min(...list.map((b) => parseFloat(getComputedStyle(b).fontSize) || 14));
    list.forEach((b) => { b.style.fontSize = `${min}px`; });
  }

  const HISTORY_MAX = 15;

  // Remembers a search query, only when the user turned history on in the settings.
  async function addHistory(text) {
    const q = cleanQuery(text);
    if (!q) return;
    try {
      const r = await chrome.storage.local.get(['genSettings', 'searchHistory']);
      if (!withDefaults(r.genSettings).keepHistory) return;
      const list = (Array.isArray(r.searchHistory) ? r.searchHistory : [])
        .filter((x) => typeof x === 'string' && x.toLowerCase() !== q.toLowerCase());
      list.unshift(q);
      await chrome.storage.local.set({ searchHistory: list.slice(0, HISTORY_MAX) });
    } catch (e) { /* context invalidated */ }
  }

  root.MS = { SUPPORTED, PANEL_KEYS, normalizeOrder, clampWidth, TRANSLATE_LANGS, translateTarget, DEFAULT_SETTINGS, withDefaults, applyTheme, defaultLang, cleanQuery, buildSearchUrl, sameSite, faviconUrl, addHistory, fitLabels, evenRow };
})(globalThis);
