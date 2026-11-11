// Shared helpers: loaded by the service worker (importScripts), content script, popup and options page.
(function (root) {
  const SUPPORTED = ['uk', 'ru', 'en', 'fr', 'de', 'es', 'it', 'pl'];
  const MAX_QUERY = 300;

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

  root.MS = { SUPPORTED, defaultLang, cleanQuery, buildSearchUrl, sameSite };
})(globalThis);
