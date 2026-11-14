# Changelog

**English** · [Русский](CHANGELOG.ru.md) · [Українська](CHANGELOG.uk.md)

## 1.2.0 — 2026-11-15

### New
- **Search menu next to the selection.** ⚡ can open the search buttons right next to the selected text instead of the extension popup. Same buttons, colors and fonts, with its own size setting (60–100 %).
- **Hotkey Alt+S** to search the selected text without the mouse (changeable in `chrome://extensions/shortcuts`). Keyboard control in the menu: arrows / Tab, Enter, 1–9, Esc.
- **Panel buttons order.** The 4 buttons of the selection panel (⚡ 🔍 🌍 📋) can be reordered; 🔍, 🌍 and 📋 can be switched off.
- **Menu width** setting (200–400 px) for the popup and the on-page menu.
- **⚡ buttons on the right** of each row can be hidden with one switch.
- **Hide a button without deleting it** — separate switches for the panel and the right-click menu.
- **Translation language** setting: 44 languages, or "Auto" (the interface language, as before). Right-to-left languages are displayed correctly.
- **Dark, light and auto theme** for the settings, the popup and the on-page menu.
- **Recent searches** in the popup (optional, last 15, stored only in the browser, can be cleared).
- **Site icons** on the buttons (optional, taken from Chrome's favicon cache).
- **Drag and drop** to reorder search buttons in the settings.
- **Autosave** of all settings.

### Improved
- Settings are grouped into sections: Appearance, Panel on text selection, Site buttons menu, Popup and more.
- The popup no longer stretches with long button names: fixed width, rounded frame, long names shrink to fit and then get "…"; buttons in one row share the same font size.
- Equal 6 px gaps between all buttons; smoother hover zoom without text jitter; buttons have depth (shadows) in both themes.
- The card header in the settings shows the button's own name.
- Search tabs open right after the current tab.
- New defaults: on-page menu, site icons and history on; right-click menu off; button font size 14 px.

### Fixed
- On the very first opening of the settings all switches were off, so the first save disabled the panel, Google, translate, copy and the context menu.
- Typos in the French, Italian and Polish instructions; clearer German wording; Ukrainian title of the settings tab.

### Technical
- New permission `favicon` (no warning for users), `commands` for the hotkey, `_favicon/*` as a web-accessible resource.
- Minimum Chrome version is still 127.
