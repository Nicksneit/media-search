// Loaded in <head> of the extension pages: sets the last used theme before the first paint.
(function () {
  let t = 'dark';
  try { t = localStorage.getItem('ms-theme') || 'dark'; } catch (e) { /* storage blocked */ }
  document.documentElement.dataset.theme = t;
})();
