const translations = {
  uk: {
    hint_no_text: "Виділіть назву на сторінці",
    hint_with_text: 'Запит: "{text}"',
  },
  ru: {
    hint_no_text: "Выделите название на странице",
    hint_with_text: 'Запрос: "{text}"',
  },
  en: {
    hint_no_text: "Select the title on the page",
    hint_with_text: 'Query: "{text}"',
  },
  fr: {
    hint_no_text: "Sélectionnez le titre sur la page",
    hint_with_text: 'Requête : "{text}"',
  },
  de: {
    hint_no_text: "Wählen Sie den Titel auf der Seite aus",
    hint_with_text: 'Anfrage: "{text}"',
  },
  es: {
    hint_no_text: "Seleccione el título en la página",
    hint_with_text: 'Consulta: "{text}"',
  },
  it: {
    hint_no_text: "Seleziona il titolo sulla pagina",
    hint_with_text: 'Query: "{text}"',
  },
  pl: {
    hint_no_text: "Wybierz tytuł na stronie",
    hint_with_text: 'Zapytanie: "{text}"',
  }
};
const SHARED_TEXT_TTL = 15000; // ms: a text handed over by the on-page ⚡ button expires

function makeButton(className, text, cfg, settings) {
  const b = document.createElement('button');
  b.className = className;
  b.textContent = text;
  if (cfg) {
    b.style.background = cfg.color || '#333';
    b.style.color = cfg.textColor || '#fff';
  }
  return b;
}

async function getSelectedText(data) {
  const fresh = data.sharedText && Date.now() - (data.sharedTextAt || 0) < SHARED_TEXT_TTL;
  if (data.sharedText) await chrome.storage.local.remove(['sharedText', 'sharedTextAt']);
  if (fresh) return String(data.sharedText).trim();

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return '';
    const res = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: () => window.getSelection().toString()
    });
    const hit = (res || []).map((r) => (r.result || '').trim()).find(Boolean);
    return hit || '';
  } catch (e) {
    return ''; // restricted pages (chrome://, Web Store, ...)
  }
}

async function init() {
  if (!chrome.runtime?.id) return;
  const container = document.getElementById('main-container');
  const data = await chrome.storage.local.get(['sharedText', 'sharedTextAt', 'userButtons', 'genSettings']);
  const settings = data.genSettings || {};

  const lang = translations[settings.language] ? settings.language : (translations[MS.defaultLang()] ? MS.defaultLang() : 'en');

  const logoData = settings.customLogo;
  if (typeof logoData === 'string' && logoData.startsWith('data:image/')) {
    const logoImg = document.createElement('img');
    logoImg.src = logoData;
    logoImg.style.cssText = 'width: 48px; height: 48px; display: block; margin: 0 auto 12px; border-radius: 10px; object-fit: cover; border: 1px solid #333;';
    container.prepend(logoImg);
  }

  let finalFont = settings.font || "'Rubik', sans-serif";
  if (settings.useCustomFont && settings.customFontName) {
    finalFont = `'${String(settings.customFontName).replace(/['"\\;{}]/g, '')}', sans-serif`;
  }
  const fontSize = Math.min(24, Math.max(8, Number(settings.fontSize) || 11));
  document.body.style.fontFamily = finalFont;

  const selectedText = await getSelectedText(data);
  const hint = document.getElementById('hint');
  hint.textContent = selectedText
    ? translations[lang].hint_with_text.replace('{text}', () => selectedText)
    : translations[lang].hint_no_text;

  function openSearch(cfg, direct) {
    if (!selectedText || !cfg) return;
    const url = MS.buildSearchUrl(cfg.url, MS.cleanQuery(selectedText));
    if (!url) return;
    if (/^spotify:/i.test(url)) {
      window.location.href = url; // opens the desktop app, no new tab
      return;
    }
    chrome.tabs.create({ url: direct && !url.includes('#') ? url + '#auto-redirect' : url });
  }

  function styled(btn) {
    btn.style.fontSize = fontSize + 'px';
    btn.style.fontFamily = finalFont;
    return btn;
  }

  function addRow(cfgs, large) {
    const row = document.createElement('div');
    row.className = 'row';
    let main;
    if (large) {
      main = styled(makeButton('btn-search', cfgs[0].name, cfgs[0]));
      main.addEventListener('click', () => openSearch(cfgs[0], false));
      row.appendChild(main);
    } else {
      const group = document.createElement('div');
      group.className = 'mini-group';
      cfgs.forEach((cfg) => {
        const mini = styled(makeButton('btn-mini', cfg.name, cfg));
        mini.addEventListener('click', () => openSearch(cfg, false));
        group.appendChild(mini);
      });
      row.appendChild(group);
    }
    const go = makeButton('btn-go', '⚡');
    // ⚡ opens the first result of the last button in the row
    go.addEventListener('click', () => openSearch(cfgs[cfgs.length - 1], true));
    row.appendChild(go);
    container.appendChild(row);
  }

  const btns = (Array.isArray(data.userButtons) ? data.userButtons : []).filter((b) => b && b.active);
  let miniBuffer = [];
  const flushMinis = () => { if (miniBuffer.length) { addRow(miniBuffer, false); miniBuffer = []; } };

  btns.forEach((btn) => {
    if (btn.type === 'large') {
      flushMinis(); // keeps the order the user set in options
      addRow([btn], true);
    } else {
      miniBuffer.push(btn);
      if (miniBuffer.length === 2) flushMinis();
    }
  });
  flushMinis();
}

document.addEventListener('DOMContentLoaded', init);
