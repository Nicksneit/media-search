# Media Search

**English** · [Русский](#русский) · [Українська](#українська)

---

## English

Select a movie, series or game title on any web page and search it on your favorite sites in one click.

### How it works

1. Select a title on any page. A small panel appears next to the selection.
2. Click the toolbar icon to open your search buttons (movie databases, trackers, streaming sites, YouTube, or any site with a search URL).
3. Or right-click the selection and pick a site from the context menu.

### Features

- **Your own search buttons:** name, link, color, size (large or compact), order.
- **⚡ "First result" button:** opens the first search result directly, using a CSS selector you set per site.
- **Quick tools next to the selection:** Google search 🔍, translation 🌍, copy 📋. Each can be switched off.
- **Optional "hold a key" mode:** show the panel only while a chosen key is held, on all sites or only on sites from your list.
- **8 interface languages:** English, Українська, Русский, Français, Deutsch, Español, Italiano, Polski.
- **Customization:** fonts, font size and logo. Backup and restore of all settings.

### Search link format

Put the site's search address in the button's link field. The selected text is appended to the end of it:

```
https://www.google.com/search?q=
```

If the text must go in the middle of the address, use `{searchTerms}`:

```
https://letterboxd.com/search/{searchTerms}/
```

### Installation

**From the Chrome Web Store:** _link will be added after publication._

**Manually (developer mode):**

1. Download `media-search-x.y.z.zip` from the [Releases](../../releases) page and unzip it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and choose the unzipped folder.

Requires Chrome 127 or newer.

### Privacy

No account, no tracking, no ads. Settings are stored only in your browser. Selected text is sent to a website only when you click a button for it. The translate button sends the selected text to Google Translate.

Full text: [Privacy Policy](https://nicksneit.github.io/media-search/privacy-policy.html)

### Permissions

| Permission | Why it is needed |
| --- | --- |
| `contextMenus` | Search items in the right-click menu |
| `activeTab`, `scripting` | Read the selected text in the current tab when you open the popup |
| `storage` | Save your buttons and settings locally |
| `translate.googleapis.com` | Translation, only when you press the translate button |
| Content script on http/https pages | Show the panel next to selected text |

---

## Русский

Выделите название фильма, сериала или игры на любой странице и найдите его на любимых сайтах в один клик.

### Как это работает

1. Выделите название на странице. Рядом появится небольшая панель.
2. Нажмите на значок расширения, чтобы открыть кнопки поиска (базы фильмов, трекеры, стриминги, YouTube или любой сайт с поисковой ссылкой).
3. Или щёлкните правой кнопкой по выделению и выберите сайт в контекстном меню.

### Возможности

- **Собственные кнопки поиска:** название, ссылка, цвет, размер (большая или компактная), порядок.
- **Кнопка ⚡ «первый результат»:** сразу открывает первый найденный результат по CSS-селектору, который вы задаёте для каждого сайта.
- **Быстрые инструменты рядом с выделением:** поиск в Google 🔍, перевод 🌍, копирование 📋. Каждый можно отключить.
- **Режим «с зажатой клавишей»:** панель показывается только при зажатой выбранной клавише, на всех сайтах или только на сайтах из вашего списка.
- **Интерфейс на 8 языках:** English, Українська, Русский, Français, Deutsch, Español, Italiano, Polski.
- **Настройка внешнего вида:** шрифты, размер шрифта и логотип. Резервная копия и восстановление всех настроек.

### Формат поисковой ссылки

В поле ссылки кнопки укажите поисковый адрес сайта. Выделенный текст добавится в его конец:

```
https://www.google.com/search?q=
```

Если текст нужно вставить в середину адреса, используйте `{searchTerms}`:

```
https://letterboxd.com/search/{searchTerms}/
```

### Установка

**Из Chrome Web Store:** _ссылка появится после публикации._

**Вручную (режим разработчика):**

1. Скачайте `media-search-x.y.z.zip` на странице [Releases](../../releases) и распакуйте его.
2. Откройте `chrome://extensions` и включите **Режим разработчика**.
3. Нажмите **Загрузить распакованное расширение** и выберите распакованную папку.

Нужен Chrome версии 127 или новее.

### Конфиденциальность

Без аккаунта, слежки и рекламы. Настройки хранятся только в вашем браузере. Выделенный текст передаётся на сайт только когда вы нажимаете соответствующую кнопку. Кнопка перевода отправляет выделенный текст в Google Translate.

Полный текст: [Политика конфиденциальности](https://nicksneit.github.io/media-search/privacy-policy.html) (на английском)

### Разрешения

| Разрешение | Зачем нужно |
| --- | --- |
| `contextMenus` | Пункты поиска в контекстном меню |
| `activeTab`, `scripting` | Прочитать выделенный текст в текущей вкладке при открытии popup |
| `storage` | Локально сохранить ваши кнопки и настройки |
| `translate.googleapis.com` | Перевод, только по нажатию кнопки перевода |
| Контент-скрипт на http/https страницах | Показ панели рядом с выделенным текстом |

---

## Українська

Виділіть назву фільму, серіалу чи гри на будь-якій сторінці й знайдіть її на улюблених сайтах одним кліком.

### Як це працює

1. Виділіть назву на сторінці. Поруч з'явиться невелика панель.
2. Натисніть на значок розширення, щоб відкрити кнопки пошуку (бази фільмів, трекери, стримінги, YouTube або будь-який сайт із пошуковим посиланням).
3. Або клацніть правою кнопкою по виділенню та оберіть сайт у контекстному меню.

### Можливості

- **Власні кнопки пошуку:** назва, посилання, колір, розмір (велика або компактна), порядок.
- **Кнопка ⚡ «перший результат»:** одразу відкриває перший знайдений результат за CSS-селектором, який ви задаєте для кожного сайту.
- **Швидкі інструменти поруч із виділенням:** пошук у Google 🔍, переклад 🌍, копіювання 📋. Кожен можна вимкнути.
- **Режим «із затиснутою клавішею»:** панель показується лише коли затиснута обрана клавіша, на всіх сайтах або лише на сайтах зі списку.
- **Інтерфейс 8 мовами:** English, Українська, Русский, Français, Deutsch, Español, Italiano, Polski.
- **Налаштування вигляду:** шрифти, розмір шрифту та логотип. Резервна копія та відновлення всіх налаштувань.

### Формат пошукового посилання

У полі посилання кнопки вкажіть пошукову адресу сайту. Виділений текст додасться в її кінець:

```
https://www.google.com/search?q=
```

Якщо текст потрібно вставити всередину адреси, використовуйте `{searchTerms}`:

```
https://letterboxd.com/search/{searchTerms}/
```

### Встановлення

**З Chrome Web Store:** _посилання з'явиться після публікації._

**Вручну (режим розробника):**

1. Завантажте `media-search-x.y.z.zip` зі сторінки [Releases](../../releases) і розпакуйте його.
2. Відкрийте `chrome://extensions` та увімкніть **Режим розробника**.
3. Натисніть **Завантажити розпаковане розширення** і виберіть розпаковану теку.

Потрібен Chrome версії 127 або новіший.

### Конфіденційність

Без акаунта, стеження та реклами. Налаштування зберігаються лише у вашому браузері. Виділений текст передається на сайт лише коли ви натискаєте відповідну кнопку. Кнопка перекладу надсилає виділений текст до Google Translate.

Повний текст: [Політика конфіденційності](https://nicksneit.github.io/media-search/privacy-policy.html) (англійською)

### Дозволи

| Дозвіл | Навіщо потрібен |
| --- | --- |
| `contextMenus` | Пункти пошуку в контекстному меню |
| `activeTab`, `scripting` | Прочитати виділений текст у поточній вкладці під час відкриття popup |
| `storage` | Локально зберегти ваші кнопки та налаштування |
| `translate.googleapis.com` | Переклад, лише після натискання кнопки перекладу |
| Контент-скрипт на http/https сторінках | Показ панелі поруч із виділеним текстом |
