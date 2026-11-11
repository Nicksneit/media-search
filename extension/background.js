importScripts('shared.js');

// ================= TRANSLATIONS =================
const translations = {
  uk: 'Шукати "{name}" для "%s"',
  ru: 'Искать "{name}" для "%s"',
  en: 'Search "{name}" for "%s"',
  fr: 'Rechercher "{name}" pour "%s"',
  de: 'Suchen "{name}" für "%s"',
  es: 'Buscar "{name}" para "%s"',
  it: 'Cerca "{name}" per "%s"',
  pl: 'Szukaj "{name}" dla "%s"'
};

// Buttons added on first install, so the extension is useful right away.
const DEFAULT_BUTTONS = [
  { name: 'IMDb', url: 'https://www.imdb.com/find/?q=', sel: '', type: 'large', color: '#f5c518', textColor: '#000000', active: true },
  { name: 'Rotten Tomatoes', url: 'https://www.rottentomatoes.com/search?search=', sel: '', type: 'large', color: '#fa320a', textColor: '#ffffff', active: true },
  { name: 'Letterboxd', url: 'https://letterboxd.com/search/{searchTerms}/', sel: '', type: 'mini', color: '#00a15c', textColor: '#ffffff', active: true },
  { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=', sel: '', type: 'mini', color: '#c4302b', textColor: '#ffffff', active: true }
];

// ================= STORAGE =================
function getStorage(keys) {
  return chrome.storage.local.get(keys).catch(() => ({}));
}

// ================= CONTEXT MENUS =================
// Calls are queued so that rapid setting changes never skip an update.
let menuQueue = Promise.resolve();

function updateMenus() {
  menuQueue = menuQueue.then(rebuildMenus).catch((e) => console.warn('Menu update failed', e));
  return menuQueue;
}

async function rebuildMenus() {
  await chrome.contextMenus.removeAll();

  const res = await getStorage(['userButtons', 'genSettings']);
  const buttons = Array.isArray(res.userButtons) ? res.userButtons : [];
  const lang = res.genSettings?.language || MS.defaultLang();
  const showContext = res.genSettings?.showContext !== false;
  if (!showContext) return;

  const template = translations[lang] || translations.en;
  buttons.forEach((btn, index) => {
    if (!btn || !btn.active || !btn.name || !btn.url) return;
    // "%" is special in menu titles, so it is escaped in the button name.
    const safeName = String(btn.name).replace(/%/g, '%%');
    chrome.contextMenus.create(
      {
        id: `ms-${index}`,
        title: template.replace('{name}', () => safeName),
        contexts: ['selection']
      },
      () => void chrome.runtime.lastError
    );
  });
}

// ================= TRANSLATE (runs here to avoid page CORS/CSP limits) =================
async function translate(text, tl) {
  if (typeof text !== 'string' || !text.trim()) return { ok: false };
  if (!MS.SUPPORTED.includes(tl)) tl = 'en';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encodeURIComponent(text.slice(0, 1500))}`;
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return { ok: false };
    const d = await r.json();
    const out = (d[0] || []).map((i) => (i && i[0]) || '').join('');
    return out ? { ok: true, text: out } : { ok: false };
  } catch (e) {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

// ================= EVENTS =================
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const res = await getStorage(['userButtons']);
    if (!Array.isArray(res.userButtons) || res.userButtons.length === 0) {
      await chrome.storage.local.set({ userButtons: DEFAULT_BUTTONS });
    }
  }
  updateMenus();
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove(['sharedText', 'sharedTextAt']);
  updateMenus();
});

// Rebuild menus whenever buttons or settings change.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && (changes.userButtons || changes.genSettings)) updateMenus();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id || !msg) return;

  if (msg.action === 'open_popup') {
    try {
      chrome.action.openPopup().catch(() => console.warn('Popup open failed'));
    } catch (e) {
      console.warn('Popup open failed');
    }
    return;
  }

  if (msg.action === 'translate') {
    translate(msg.text, msg.tl).then(sendResponse);
    return true; // async response
  }
});

// ================= CONTEXT MENU CLICK =================
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (!info.selectionText || !String(info.menuItemId).startsWith('ms-')) return;

  const query = MS.cleanQuery(info.selectionText);
  const index = parseInt(String(info.menuItemId).slice(3), 10);
  const res = await getStorage(['userButtons']);
  const btn = Array.isArray(res.userButtons) ? res.userButtons[index] : null;
  if (!btn) return;

  const url = MS.buildSearchUrl(btn.url, query);
  if (url) chrome.tabs.create({ url });
});
