<p align="center">
  <img src="screenshots/promo-marquee.png" alt="Media Search" width="100%">
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/aohdkmnbfpakkigbdlaobohflagmmgpa"><img src="https://img.shields.io/badge/Chrome%20Web%20Store-Install-4285F4?logo=googlechrome&logoColor=white&style=for-the-badge" alt="Install from Chrome Web Store"></a>
</p>

<p align="center">
  <b>English</b> · <a href="README.ru.md">Русский</a> · <a href="README.uk.md">Українська</a>
</p>

# Media Search

A Chrome extension that searches any movie, series or game title on your favorite sites in one click.

Select a title on any page and press ⚡: your own search buttons appear right next to the text. One more click and the search opens on IMDb, Rotten Tomatoes, Letterboxd, YouTube or any other site you add.

## Screenshots

| | |
|---|---|
| ![Search menu next to the selection](screenshots/shot1.png) | ![Extension popup with recent searches](screenshots/shot2.png) |
| **Search any title in one click.** The menu opens right next to the selected text. | **The popup in the toolbar.** Recent searches, the Alt+S hotkey and ⚡ to jump to the first result. |
| ![Settings grouped into sections](screenshots/shot3.png) | ![Search buttons in the light theme](screenshots/shot4.png) |
| **Make it yours.** Reorder the panel, set the menu width and size, hide the ⚡ buttons. | **Your sites, your buttons.** Any search site, your colors and order, in a dark, light or auto theme. |
| ![Translation of the selected text](screenshots/shot5.png) | |
| **Translate and copy.** Translate the selection into 40+ languages without leaving the page. | |

## Features

**Search**
- Unlimited custom search buttons: name, search URL, background and text color, large or mini size
- Search menu right next to the selected text, or the classic popup in the toolbar
- ⚡ next to each row opens the first search result directly (optional CSS selector)
- Search from the right-click menu
- Alt+S hotkey (can be changed in `chrome://extensions/shortcuts`)
- Keyboard control in the menu: arrows / Tab to move, Enter to open, 1–9 to open a button, Esc to close

**Selection panel**
- Four quick buttons: ⚡ search, 🔍 Google, 🌍 translate, 📋 copy
- Change their order and switch off the ones you don't need
- Translation into 44 languages, or automatically into the interface language
- Show the panel only while a key is held — on all sites or only on sites from your list

**Look and feel**
- Dark, light and auto theme
- Menu width (200–400 px) and size (60–100 %)
- Optional site icons and optional ⚡ buttons on the right
- Long names shrink to fit before they get "…"
- Your own font, button font size and logo

**Convenience**
- Recent searches in the popup (optional, last 15)
- Hide a button without deleting it — separately for the panel and the context menu
- Drag and drop to reorder buttons
- Settings are saved automatically
- Backup and restore of all settings
- Interface in 8 languages: English, Ukrainian, Russian, German, French, Spanish, Italian, Polish

## Installation

**Chrome Web Store** — search for "Media Search".

**Manually (developer mode)**
1. Download the latest release and unpack it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the unpacked folder.

Requires Chrome 127 or newer.

## How to add a search site

1. Open any site, search for any word and copy the address of the results page.
2. Remove the word from the address — what is left is the **search URL**, for example `https://www.google.com/search?q=`.
   If the word sits in the middle of the address, put `{searchTerms}` in its place: `https://letterboxd.com/search/{searchTerms}/`.
3. Optional: a **CSS selector** for ⚡ — the link of the first result, e.g. `a[href*="/film/"]`.

The full guide with examples is built into the settings page.

## Privacy

No accounts, no tracking, no ads.

- Settings and search history are stored only in your browser (`chrome.storage.local`).
- The selected text is sent only where you send it: to the search site you click, or to Google Translate when you press 🌍.
- Site icons come from Chrome's own favicon cache — no requests to outside services.

## Permissions

| Permission | Why |
|---|---|
| `contextMenus` | Search items in the right-click menu |
| `scripting`, `activeTab` | Read the selected text when you open the popup or press the hotkey |
| `storage` | Save your buttons, settings and (optional) search history |
| `favicon` | Show site icons on the buttons (optional) |
| `translate.googleapis.com` | Translate the selection when you press 🌍 |
| Content script on http/https pages | Show the panel next to the text you select |

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
