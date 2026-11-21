let userButtons = [];
let currentFontSize = 14;
let currentScale = 75; // size of the on-page ⚡ menu, %
let pendingTranslateTo = 'auto'; // translation target until the list is built
let currentWidth = 250;          // width of the search-button menu, px
// autosave state
let settingsLoaded = false;
let saveTimer = null;
let saveBlocked = false;
let customLogo = "";
let selectedHoldKey = '';

const translations = {
  uk: {
    page_title: "Налаштування Media Search",
    h1: "Media Search",
    reset_logo: "Скинути до стандартного",
    instructions_summary: "Повна інструкція та Приклади",
    instructions_content: `
        <p><strong>1. Назва кнопки:</strong> Текст, який буде відображатися на самій кнопці (наприклад: <code>KINOBAZA</code>).</p>
        <p><strong>2. URL пошуку:</strong> Посилання, яке відкривається після пошуку на сайті. <br>
        <span>Як отримати:</span> Зайдіть на сайт, введіть у пошук будь-яке слово, скопіюйте посилання та видаліть з нього це слово.<br>
        <i>Приклад Google:</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. CSS Селектор (⚡ Блискавка):</strong> Код елемента для автоматичного переходу до першого результату.<br>
<span>Як отримати:</span> Вставте <b>a[href*="/movie/"]</b> де <b>/movie/</b> — це останній розділ перед назвою в адресному рядку, коли ви перейшли на сторінку фільму через пошук, серіалу або гри на цільовому сайті.
<div class="example-box">
<strong>Приклад</strong><br>
Сторінка фільму, на яку перейшли через пошук: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Нам потрібен розділ: <b>/movie/</b><br>
Результат виглядає так: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Приклад двох розділів</strong><br>
Якщо на сайті фільми та серіали розміщені в різних розділах, додайте селектори через кому.<br>
Приклад: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
Це буде перший результат, який відкриється автоматично, незалежно від того, в якому він розділі.
</div>
<div class="example-box">
<strong>Популярні приклади селекторів:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — для Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — для Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — для Trakt</li>
</ul>
</div>
<p><i>Важливо: Переконайтеся, що ви берете розділ саме зі сторінки результатів пошуку.
Наприклад: іноді в адресному рядку на сторінці фільму вказано /movie/, а в результатах пошуку посилання веде на /title/.</i></p>
<p><i>Порада: Якщо автоматичний перехід (⚡) не спрацював, спробуйте інший селектор або залиште поле порожнім.</i></p>
    `,
    general_settings: "Загальні налаштування",
    show_ms_button: "Показувати кнопку MS",
    show_context_menu: "Контекстне меню",
    font_selection: "Вибір шрифту",
    custom_font: "Власний шрифт",
    custom_font_placeholder: "Назва з Google Fonts",
    button_font_size: "Розмір шрифту кнопок (px)",
    search_buttons: "Кнопки пошуку",
    add_new_button: "+ ДОДАТИ НОВУ КНОПКУ",
    save_settings: "ЗБЕРЕГТИ НАЛАШТУВАННЯ",
    export_backup: "Експорт (Backup)",
    import_restore: "Імпорт (Restore)",
    name_placeholder: "Назва кнопки",
    url_placeholder: "URL пошуку",
    sel_placeholder: "CSS Селектор",
    large: "Велика",
    mini: "Міні",
    background: "Фон",
    text: "Текст",
    on: "On",
    delete: "Видалити",
    confirm_delete: "Видалити?",
    saved: "ЗБЕРЕЖЕНО ✓",
    save_settings_js: "ЗБЕРЕГТИ НАЛАШТУВАННЯ",
    file_error: "Помилка формату файлу.",
    interface_language: "Мова інтерфейсу",
    show_gs_button: "Пошук Google",
    show_tr_button: "Кнопка перекладу",
    show_cp_button: "Кнопка копіювання",
    require_hold_all: "Показувати кнопки при виділенні з зажатою клавішою на ВСІХ сайтах",
    require_hold_list: "Показувати кнопки при виділенні з зажатою клавішою тільки на сайтах зі списку",
    hold_key_label: "Клавіша-модифікатор",
    capture_key_btn: "Натисніть для вибору клавіші",
    hold_sites_label: "Список сайтів (один домен на рядок)",
  },
  ru: {
    page_title: "Настройки Media Search",
    h1: "Media Search",
    reset_logo: "Сбросить к стандартному",
    instructions_summary: "Полная инструкция и Примеры",
    instructions_content: `
        <p><strong>1. Название кнопки:</strong> Текст, который будет отображаться на самой кнопке (например: <code>KINOBAZA</code>).</p>
        <p><strong>2. URL поиска:</strong> Ссылка, которая открывается после поиска на сайте. <br>
        <span>Как получить:</span> Зайдите на сайт, введите в поиск любое слово, скопируйте ссылку и удалите из нее это слово.<br>
        <i>Пример Google:</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. CSS Селектор (⚡ Молния):</strong> Код элемента для автоматического перехода к первому результату.<br>
<span>Как получить:</span> Вставьте <b>a[href*="/movie/"]</b>, где <b>/movie/</b> — это последний раздел перед названием в адресной строке, когда вы перешли на страницу фильма через поиск, сериала или игры на целевом сайте.
<div class="example-box">
<strong>Пример</strong><br>
Страница фильма, на которую перешли через поиск: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Нужный раздел: <b>/movie/</b><br>
Результат выглядит так: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Пример двух разделов</strong><br>
Если на сайте фильмы и сериалы размещены в разных разделах, добавьте селекторы через запятую.<br>
Пример: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
Это будет первый результат, который откроется автоматически, независимо от того, в каком он разделе.
</div>
<div class="example-box">
<strong>Популярные примеры селекторов:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — для Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — для Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — для Trakt</li>
</ul>
</div>
<p><i>Важно: Убедитесь, что вы берете раздел именно со страницы результатов поиска.
Например: иногда в адресной строке на странице фильма указано /movie/, а в результатах поиска ссылка ведет на /title/.</i></p>
<p><i>Совет: Если автоматический переход (⚡) не сработал, попробуйте другой селектор или оставьте поле пустым.</i></p>
    `,
    general_settings: "Общие настройки",
    show_ms_button: "Показывать кнопку MS",
    show_context_menu: "Контекстное меню",
    font_selection: "Выбор шрифта",
    custom_font: "Свой шрифт",
    custom_font_placeholder: "Название с Google Fonts",
    button_font_size: "Размер шрифта кнопок (px)",
    search_buttons: "Кнопки поиска",
    add_new_button: "+ ДОБАВИТЬ НОВУЮ КНОПКУ",
    save_settings: "СОХРАНИТЬ НАСТРОЙКИ",
    export_backup: "Экспорт (Backup)",
    import_restore: "Импорт (Restore)",
    name_placeholder: "Название кнопки",
    url_placeholder: "URL поиска",
    sel_placeholder: "CSS Селектор",
    large: "Большая",
    mini: "Мини",
    background: "Фон",
    text: "Текст",
    on: "On",
    delete: "Удалить",
    confirm_delete: "Удалить?",
    saved: "СОХРАНЕНО ✓",
    save_settings_js: "СОХРАНИТЬ НАСТРОЙКИ",
    file_error: "Ошибка формата файла.",
    interface_language: "Язык интерфейса",
    show_gs_button: "Поиск Google",
    show_tr_button: "Кнопка перевода",
    show_cp_button: "Кнопка копирования",
    require_hold_all: "Показывать кнопки при выделении с зажатой клавишей на ВСЕХ сайтах",
    require_hold_list: "Показывать кнопки при выделении с зажатой клавишей ТОЛЬКО на сайтах из списка",
    hold_key_label: "Клавиша-модификатор",
    capture_key_btn: "Нажмите для выбора клавиши",
    hold_sites_label: "Список сайтов (один домен в строке)",
  },
  en: {
    page_title: "Media Search Settings",
    h1: "Media Search",
    reset_logo: "Reset to default",
    instructions_summary: "Full Instructions and Examples",
    instructions_content: `
        <p><strong>1. Button Name:</strong> The text that will be displayed on the button (e.g., <code>KINOBAZA</code>).</p>
        <p><strong>2. Search URL:</strong> The link that opens after searching on the site. <br>
        <span>How to get it:</span> Go to the site, enter any word in search, copy the link and remove that word from it.<br>
        <i>Google Example:</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. CSS Selector (⚡ Lightning):</strong> Element code for automatically navigating to the first result.<br>
<span>How to get it:</span> Insert <b>a[href*="/movie/"]</b>, where <b>/movie/</b> is the last section before the title in the address bar when you open a movie, series, or game page via search on the target website.
<div class="example-box">
<strong>Example</strong><br>
Movie page opened via search: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Required section: <b>/movie/</b><br>
Result looks like: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Example with two sections</strong><br>
If movies and series are placed in different sections on the site, add selectors separated by a comma.<br>
Example: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
This will be the first result that opens automatically, regardless of which section it belongs to.
</div>
<div class="example-box">
<strong>Popular selector examples:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — for Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — for Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — for Trakt</li>
</ul>
</div>
<p><i>Important: Make sure you take the section from the search results page.
For example: sometimes the address bar on the movie page shows /movie/, but in search results the link points to /title/.</i></p>
<p><i>Tip: If automatic navigation (⚡) does not work, try another selector or leave the field empty.</i></p>
    `,
    general_settings: "General Settings",
    show_ms_button: "Show MS Button",
    show_context_menu: "Context Menu",
    font_selection: "Font Selection",
    custom_font: "Custom Font",
    custom_font_placeholder: "Name from Google Fonts",
    button_font_size: "Button Font Size (px)",
    search_buttons: "Search Buttons",
    add_new_button: "+ ADD NEW BUTTON",
    save_settings: "SAVE SETTINGS",
    export_backup: "Export (Backup)",
    import_restore: "Import (Restore)",
    name_placeholder: "Button Name",
    url_placeholder: "Search URL",
    sel_placeholder: "CSS Selector",
    large: "Large",
    mini: "Mini",
    background: "Background",
    text: "Text",
    on: "On",
    delete: "Delete",
    confirm_delete: "Delete?",
    saved: "SAVED ✓",
    save_settings_js: "SAVE SETTINGS",
    file_error: "File format error.",
    interface_language: "Interface Language",
    show_gs_button: "Google Search",
    show_tr_button: "Translation Button",
    show_cp_button: "Copy Button",
    require_hold_all: "Show buttons on selection with held key on ALL sites",
    require_hold_list: "Show buttons on selection with held key ONLY on sites from the list",
    hold_key_label: "Modifier key",
    capture_key_btn: "Click to select key",
    hold_sites_label: "Sites list (one domain per line)",
  },
  fr: {
    page_title: "Paramètres Media Search",
    h1: "Media Search",
    reset_logo: "Réinitialiser par défaut",
    instructions_summary: "Instructions Complètes et Exemples",
    instructions_content: `
        <p><strong>1. Nom du Bouton :</strong> Le texte qui sera affiché sur le bouton (ex. : <code>KINOBAZA</code>).</p>
        <p><strong>2. URL de Recherche :</strong> Le lien qui s'ouvre après la recherche sur le site. <br>
        <span>Comment l'obtenir :</span> Allez sur le site, entrez n'importe quel mot dans la recherche, copiez le lien et supprimez ce mot.<br>
        <i>Exemple Google :</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. Sélecteur CSS (⚡ Éclair):</strong> Code d’élément pour accéder automatiquement au premier résultat.<br>
<span>Comment l’obtenir:</span> Insérez <b>a[href*="/movie/"]</b>, où <b>/movie/</b> est la dernière section avant le titre dans la barre d’adresse lorsque vous ouvrez une page de film, série ou jeu via la recherche sur le site cible.
<div class="example-box">
<strong>Exemple</strong><br>
Page du film ouverte via la recherche: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Section requise: <b>/movie/</b><br>
Résultat: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Exemple avec deux sections</strong><br>
Si les films et séries sont placés dans différentes sections, ajoutez les sélecteurs séparés par une virgule.<br>
Exemple: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
Ce sera le premier résultat ouvert automatiquement, quelle que soit sa section.
</div>
<div class="example-box">
<strong>Exemples populaires de sélecteurs:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — pour Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — pour Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — pour Trakt</li>
</ul>
</div>
<p><i>Important: Assurez-vous de prendre la section depuis la page des résultats de recherche.
Par exemple: parfois l’URL de la page du film contient /movie/, mais dans les résultats de recherche le lien mène à /title/.</i></p>
<p><i>Conseil: Si la navigation automatique (⚡) ne fonctionne pas, essayez un autre sélecteur ou laissez le champ vide.</i></p>
    `,
    general_settings: "Paramètres Généraux",
    show_ms_button: "Afficher le Bouton MS",
    show_context_menu: "Menu Contextuel",
    font_selection: "Sélection de Police",
    custom_font: "Police Personnalisée",
    custom_font_placeholder: "Nom de Google Fonts",
    button_font_size: "Taille de Police des Boutons (px)",
    search_buttons: "Boutons de Recherche",
    add_new_button: "+ AJOUTER UN NOUVEAU BOUTON",
    save_settings: "ENREGISTRER LES PARAMÈTRES",
    export_backup: "Exporter (Sauvegarde)",
    import_restore: "Importer (Restauration)",
    name_placeholder: "Nom du Bouton",
    url_placeholder: "URL de Recherche",
    sel_placeholder: "Sélecteur CSS",
    large: "Grand",
    mini: "Mini",
    background: "Fond",
    text: "Texte",
    on: "On",
    delete: "Supprimer",
    confirm_delete: "Supprimer ?",
    saved: "ENREGISTRÉ ✓",
    save_settings_js: "ENREGISTRER LES PARAMÈTRES",
    file_error: "Erreur de format de fichier.",
    interface_language: "Langue de l'Interface",
    show_gs_button: "Recherche Google",
    show_tr_button: "Bouton de traduction",
    show_cp_button: "Bouton Copier",
    require_hold_all: "Afficher les boutons lors de la sélection avec une touche maintenue sur TOUS les sites",
    require_hold_list: "Afficher les boutons lors de la sélection avec une touche maintenue UNIQUEMENT sur les sites de la liste",
    hold_key_label: "Touche modificateur",
    capture_key_btn: "Cliquez pour choisir la touche",
    hold_sites_label: "Liste des sites (un domaine par ligne)",
  },
  de: {
    page_title: "Media Search Einstellungen",
    h1: "Media Search",
    reset_logo: "Auf Standard zurücksetzen",
    instructions_summary: "Vollständige Anweisungen und Beispiele",
    instructions_content: `
        <p><strong>1. Button-Name:</strong> Der Text, der auf dem Button angezeigt wird (z.B. <code>KINOBAZA</code>).</p>
        <p><strong>2. Such-URL:</strong> Der Link, der nach der Suche auf der Site geöffnet wird. <br>
        <span>Wie man es bekommt:</span> Gehen Sie zur Site, geben Sie ein beliebiges Wort in die Suche ein, kopieren Sie den Link und entfernen Sie das Wort.<br>
        <i>Google-Beispiel:</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. CSS-Selektor (⚡ Blitz):</strong> Elementcode für den automatischen Wechsel zum ersten Ergebnis.<br>
<span>So erhalten Sie ihn:</span> Fügen Sie <b>a[href*="/movie/"]</b> ein, wobei <b>/movie/</b> der letzte Abschnitt vor dem Titel in der Adressleiste ist, wenn Sie eine Film-, Serien- oder Spielseite über die Suche auf der Zielwebsite öffnen.
<div class="example-box">
<strong>Beispiel</strong><br>
Filmseite, geöffnet über die Suche: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Benötigter Abschnitt: <b>/movie/</b><br>
Ergebnis: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Beispiel mit zwei Abschnitten</strong><br>
Wenn Filme und Serien auf der Website in verschiedenen Abschnitten sind, fügen Sie Selektoren mit Komma getrennt hinzu.<br>
Beispiel: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
Dies ist das erste Ergebnis, das automatisch geöffnet wird, unabhängig vom Abschnitt.
</div>
<div class="example-box">
<strong>Beliebte Selektor-Beispiele:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — für Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — für Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — für Trakt</li>
</ul>
</div>
<p><i>Wichtig: Stellen Sie sicher, dass Sie den Abschnitt von der Suchergebnisseite nehmen.
Zum Beispiel: manchmal zeigt die Adressleiste auf der Filmseite /movie/, aber in den Suchergebnissen führt der Link zu /title/.</i></p>
<p><i>Tipp: Wenn der automatische Wechsel (⚡) nicht funktioniert, versuchen Sie einen anderen Selektor oder lassen Sie das Feld leer.</i></p>
    `,
    general_settings: "Allgemeine Einstellungen",
    show_ms_button: "MS-Button anzeigen",
    show_context_menu: "Kontextmenü",
    font_selection: "Schriftartauswahl",
    custom_font: "Benutzerdefinierte Schriftart",
    custom_font_placeholder: "Name aus Google Fonts",
    button_font_size: "Schriftgröße der Buttons (px)",
    search_buttons: "Such-Buttons",
    add_new_button: "+ NEUEN BUTTON HINZUFÜGEN",
    save_settings: "EINSTELLUNGEN SPEICHERN",
    export_backup: "Export (Backup)",
    import_restore: "Import (Restore)",
    name_placeholder: "Button-Name",
    url_placeholder: "Such-URL",
    sel_placeholder: "CSS-Selektor",
    large: "Groß",
    mini: "Mini",
    background: "Hintergrund",
    text: "Text",
    on: "On",
    delete: "Löschen",
    confirm_delete: "Löschen?",
    saved: "GESPEICHERT ✓",
    save_settings_js: "EINSTELLUNGEN SPEICHERN",
    file_error: "Dateiformatfehler.",
    interface_language: "Sprache der Oberfläche",
    show_gs_button: "Google-Suche",
    show_tr_button: "Übersetzen-Button",
    show_cp_button: "Kopieren-Button",
    require_hold_all: "Buttons beim Markieren nur mit gedrückter Taste anzeigen – auf ALLEN Seiten",
    require_hold_list: "Buttons beim Markieren nur mit gedrückter Taste anzeigen – NUR auf Seiten aus der Liste",
    hold_key_label: "Modifizierertaste",
    capture_key_btn: "Klicken zum Auswählen der Taste",
    hold_sites_label: "Liste der Websites (eine Domain pro Zeile)",
  },
  es: {
    page_title: "Configuraciones de Media Search",
    h1: "Media Search",
    reset_logo: "Restablecer a predeterminado",
    instructions_summary: "Instrucciones Completas y Ejemplos",
    instructions_content: `
        <p><strong>1. Nombre del Botón:</strong> El texto que se mostrará en el botón (ej. <code>KINOBAZA</code>).</p>
        <p><strong>2. URL de Búsqueda:</strong> El enlace que se abre después de buscar en el sitio. <br>
        <span>Cómo obtenerlo:</span> Ve al sitio, ingresa cualquier palabra en la búsqueda, copia el enlace y elimina esa palabra.<br>
        <i>Ejemplo de Google:</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. Selector CSS (⚡ Rayo):</strong> Código del elemento para ir automáticamente al primer resultado.<br>
<span>Cómo obtenerlo:</span> Inserta <b>a[href*="/movie/"]</b>, donde <b>/movie/</b> es la última sección antes del título en la barra de direcciones cuando abres una página de película, serie o juego desde la búsqueda en el sitio.
<div class="example-box">
<strong>Ejemplo</strong><br>
Página de película abierta desde la búsqueda: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Sección necesaria: <b>/movie/</b><br>
Resultado: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Ejemplo con dos secciones</strong><br>
Si películas y series están en diferentes secciones, añade selectores separados por coma.<br>
Ejemplo: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
Este será el primer resultado que se abrirá automáticamente, sin importar la sección.
</div>
<div class="example-box">
<strong>Ejemplos populares de selectores:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — para Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — para Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — para Trakt</li>
</ul>
</div>
<p><i>Importante: Asegúrate de tomar la sección desde la página de resultados de búsqueda.
Por ejemplo: a veces la barra de direcciones muestra /movie/, pero en los resultados el enlace lleva a /title/.</i></p>
<p><i>Consejo: Si la navegación automática (⚡) no funciona, prueba otro selector o deja el campo vacío.</i></p>
    `,
    general_settings: "Configuraciones Generales",
    show_ms_button: "Mostrar Botón MS",
    show_context_menu: "Menú Contextual",
    font_selection: "Selección de Fuente",
    custom_font: "Fuente Personalizada",
    custom_font_placeholder: "Nombre de Google Fonts",
    button_font_size: "Tamaño de Fuente de Botones (px)",
    search_buttons: "Botones de Búsqueda",
    add_new_button: "+ AÑADIR NUEVO BOTÓN",
    save_settings: "GUARDAR CONFIGURACIONES",
    export_backup: "Exportar (Backup)",
    import_restore: "Importar (Restore)",
    name_placeholder: "Nombre del Botón",
    url_placeholder: "URL de Búsqueda",
    sel_placeholder: "Selector CSS",
    large: "Grande",
    mini: "Mini",
    background: "Fondo",
    text: "Texto",
    on: "On",
    delete: "Eliminar",
    confirm_delete: "Eliminar?",
    saved: "GUARDADO ✓",
    save_settings_js: "GUARDAR CONFIGURACIONES",
    file_error: "Error de formato de archivo.",
    interface_language: "Idioma de la Interfaz",
    show_gs_button: "Buscar en Google",
    show_tr_button: "Botón de traducción",
    show_cp_button: "Botón de copiar",
    require_hold_all: "Mostrar botones al seleccionar con tecla mantenida en TODOS los sitios",
    require_hold_list: "Mostrar botones al seleccionar con tecla mantenida SOLO en sitios de la lista",
    hold_key_label: "Tecla modificadora",
    capture_key_btn: "Haz clic para seleccionar la tecla",
    hold_sites_label: "Lista de sitios (un dominio por línea)",
  },
  it: {
    page_title: "Impostazioni Media Search",
    h1: "Media Search",
    reset_logo: "Ripristina predefinito",
    instructions_summary: "Istruzioni Complete ed Esempi",
    instructions_content: `
        <p><strong>1. Nome Pulsante:</strong> Il testo che verrà visualizzato sul pulsante (es. <code>KINOBAZA</code>).</p>
        <p><strong>2. URL di Ricerca:</strong> Il link che si apre dopo la ricerca sul sito. <br>
        <span>Come ottenerlo:</span> Vai sul sito, inserisci qualsiasi parola nella ricerca, copia il link e rimuovi quella parola.<br>
        <i>Esempio Google:</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. Selettore CSS (⚡ Fulmine):</strong> Codice dell’elemento per passare automaticamente al primo risultato.<br>
<span>Come ottenerlo:</span> Inserisci <b>a[href*="/movie/"]</b>, dove <b>/movie/</b> è l’ultima sezione prima del titolo nella barra degli indirizzi quando apri una pagina di film, serie o gioco tramite ricerca sul sito.
<div class="example-box">
<strong>Esempio</strong><br>
Pagina del film aperta tramite ricerca: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Sezione richiesta: <b>/movie/</b><br>
Risultato: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Esempio con due sezioni</strong><br>
Se film e serie sono in sezioni diverse, aggiungi i selettori separati da una virgola.<br>
Esempio: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
Questo sarà il primo risultato aperto automaticamente, indipendentemente dalla sezione.
</div>
<div class="example-box">
<strong>Esempi popolari di selettori:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — per Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — per Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — per Trakt</li>
</ul>
</div>
<p><i>Importante: Assicurati di prendere la sezione dalla pagina dei risultati di ricerca.
Ad esempio: a volte nella barra degli indirizzi c’è /movie/, ma nei risultati il link porta a /title/.</i></p>
<p><i>Consiglio: Se la navigazione automatica (⚡) non funziona, prova un altro selettore o lascia il campo vuoto.</i></p>
    `,
    general_settings: "Impostazioni Generali",
    show_ms_button: "Mostra Pulsante MS",
    show_context_menu: "Menu Contestuale",
    font_selection: "Selezione Font",
    custom_font: "Font Personalizzato",
    custom_font_placeholder: "Nome da Google Fonts",
    button_font_size: "Dimensione Font Pulsanti (px)",
    search_buttons: "Pulsanti di Ricerca",
    add_new_button: "+ AGGIUNGI NUOVO PULSANTE",
    save_settings: "SALVA IMPOSTAZIONI",
    export_backup: "Esporta (Backup)",
    import_restore: "Importa (Restore)",
    name_placeholder: "Nome Pulsante",
    url_placeholder: "URL di Ricerca",
    sel_placeholder: "Selettore CSS",
    large: "Grande",
    mini: "Mini",
    background: "Sfondo",
    text: "Testo",
    on: "On",
    delete: "Elimina",
    confirm_delete: "Elimina?",
    saved: "SALVATO ✓",
    save_settings_js: "SALVA IMPOSTAZIONI",
    file_error: "Errore formato file.",
    interface_language: "Lingua dell'Interfaccia",
    show_gs_button: "Cerca su Google",
    show_tr_button: "Pulsante di traduzione",
    show_cp_button: "Pulsante Copia",
    require_hold_all: "Mostra pulsanti durante la selezione con tasto premuto su TUTTI i siti",
    require_hold_list: "Mostra pulsanti durante la selezione con tasto premuto SOLO sui siti della lista",
    hold_key_label: "Tasto modificatore",
    capture_key_btn: "Clicca per selezionare il tasto",
    hold_sites_label: "Elenco dei siti (un dominio per riga)",
  },
  pl: {
    page_title: "Ustawienia Media Search",
    h1: "Media Search",
    reset_logo: "Resetuj do domyślnego",
    instructions_summary: "Pełne Instrukcje i Przykłady",
    instructions_content: `
        <p><strong>1. Nazwa Przycisku:</strong> Tekst, który będzie wyświetlany na przycisku (np. <code>KINOBAZA</code>).</p>
        <p><strong>2. URL Wyszukiwania:</strong> Link, który otwiera się po wyszukiwaniu na stronie. <br>
        <span>Jak uzyskać:</span> Wejdź na stronę, wpisz dowolne słowo w wyszukiwanie, skopiuj link i usuń to słowo.<br>
        <i>Przykład Google:</i> <code>https://www.google.com/search?q=</code></p>
        <p><strong>3. Selektor CSS (⚡ Błyskawica):</strong> Kod elementu do automatycznego przejścia do pierwszego wyniku.<br>
<span>Jak go uzyskać:</span> Wstaw <b>a[href*="/movie/"]</b>, gdzie <b>/movie/</b> to ostatnia sekcja przed nazwą w pasku adresu, gdy otwierasz stronę filmu, serialu lub gry z wyszukiwania na stronie.
<div class="example-box">
<strong>Przykład</strong><br>
Strona filmu otwarta z wyszukiwania: <b>https://www.metacritic.com/movie/interstellar/</b><br>
Wymagana sekcja: <b>/movie/</b><br>
Wynik: <b>a[href*="/movie/"]</b>
</div>
<div class="example-box">
<strong>Przykład z dwoma sekcjami</strong><br>
Jeśli filmy i seriale są w różnych sekcjach, dodaj selektory oddzielone przecinkiem.<br>
Przykład: <b>a[href*="/movie/"], a[href*="/show/"]</b><br>
To będzie pierwszy wynik otwierany automatycznie, niezależnie od sekcji.
</div>
<div class="example-box">
<strong>Popularne przykłady selektorów:</strong>
<ul>
<li><code>a[href*="/show/"]</code> — dla Serializd / SeriesGraph</li>
<li><code>a[href*="/film/"]</code> — dla Letterboxd</li>
<li><code>a[href*="/movies/"], a[href*="/shows/"]</code> — dla Trakt</li>
</ul>
</div>
<p><i>Ważne: Upewnij się, że bierzesz sekcję ze strony wyników wyszukiwania.
Na przykład: czasami w pasku adresu jest /movie/, ale w wynikach link prowadzi do /title/.</i></p>
<p><i>Wskazówka: Jeśli automatyczne przejście (⚡) nie działa, spróbuj innego selektora lub zostaw pole puste.</i></p>
    `,
    general_settings: "Ustawienia Ogólne",
    show_ms_button: "Pokaż Przycisk MS",
    show_context_menu: "Menu Kontekstowe",
    font_selection: "Wybór Czcionki",
    custom_font: "Czcionka Niestandardowa",
    custom_font_placeholder: "Nazwa z Google Fonts",
    button_font_size: "Rozmiar Czcionki Przycisków (px)",
    search_buttons: "Przyciski Wyszukiwania",
    add_new_button: "+ DODAJ NOWY PRZYCISK",
    save_settings: "ZAPISZ USTAWIENIA",
    export_backup: "Eksport (Backup)",
    import_restore: "Import (Restore)",
    name_placeholder: "Nazwa Przycisku",
    url_placeholder: "URL Wyszukiwania",
    sel_placeholder: "Selektor CSS",
    large: "Duży",
    mini: "Mini",
    background: "Tło",
    text: "Tekst",
    on: "On",
    delete: "Usuń",
    confirm_delete: "Usunąć?",
    saved: "ZAPISANO ✓",
    save_settings_js: "ZAPISZ USTAWIENIA",
    file_error: "Błąd formatu pliku.",
    interface_language: "Język Interfejsu",
    show_gs_button: "Szukaj w Google",
    show_tr_button: "Przycisk tłumaczenia",
    show_cp_button: "Przycisk Kopiuj",
    require_hold_all: "Pokazuj przyciski przy zaznaczaniu z wciśniętym klawiszem na WSZYSTKICH stronach",
    require_hold_list: "Pokazuj przyciski przy zaznaczaniu z wciśniętym klawiszem TYLKO na stronach z listy",
    hold_key_label: "Klawisz modyfikator",
    capture_key_btn: "Kliknij, aby wybrać klawisz",
    hold_sites_label: "Lista stron (jedna domena w linii)",
  }
};

let currentLang = 'en';

const logoInput = document.getElementById('logo-input');
const displayLogo = document.getElementById('display-logo');
const resetLogoBtn = document.getElementById('reset-logo');

document.getElementById('logo-trigger').onclick = () => logoInput.click();
logoInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  imageFileToLogo(file, (dataUrl) => { customLogo = dataUrl; displayLogo.src = customLogo; scheduleSave(); });
};
resetLogoBtn.onclick = () => { customLogo = ""; displayLogo.src = "icon.png"; scheduleSave(); };

function escapeHtml(text) {
  if (text === undefined || text === null) return "";
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function clampScale(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(100, Math.max(60, Math.round(n / 5) * 5)) : 75;
}

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
}

// Texts that used to be hard-coded in Ukrainian
const extraI18n = {
  not_set:     { uk: 'Не встановлено', ru: 'Не задано', en: 'Not set', fr: 'Non défini', de: 'Nicht festgelegt', es: 'No establecida', it: 'Non impostato', pl: 'Nie ustawiono' },
  capture_press: { uk: 'Натисніть клавішу на клавіатурі...', ru: 'Нажмите клавишу на клавиатуре...', en: 'Press a key on the keyboard...', fr: 'Appuyez sur une touche...', de: 'Drücken Sie eine Taste...', es: 'Pulse una tecla...', it: 'Premi un tasto...', pl: 'Naciśnij klawisz...' },
  capture_btn: { uk: 'Натисніть для вибору клавіші', ru: 'Нажмите для выбора клавиши', en: 'Click to choose a key', fr: 'Cliquez pour choisir une touche', de: 'Klicken, um eine Taste zu wählen', es: 'Haga clic para elegir una tecla', it: 'Clicca per scegliere un tasto', pl: 'Kliknij, aby wybrać klawisz' },
  inline_buttons: {
    uk: 'Кнопки пошуку біля ⚡ на сторінці (замість вікна розширення)',
    ru: 'Кнопки поиска рядом с ⚡ на странице (вместо окна расширения)',
    en: 'Search buttons next to ⚡ on the page (instead of the extension popup)',
    fr: 'Boutons de recherche à côté de ⚡ sur la page (au lieu de la fenêtre de l’extension)',
    de: 'Suchbuttons neben ⚡ auf der Seite (statt des Erweiterungsfensters)',
    es: 'Botones de búsqueda junto a ⚡ en la página (en lugar de la ventana de la extensión)',
    it: 'Pulsanti di ricerca accanto a ⚡ sulla pagina (invece della finestra dell’estensione)',
    pl: 'Przyciski wyszukiwania obok ⚡ na stronie (zamiast okna rozszerzenia)'
  },
  show_in_panel: { uk: 'Показувати в панелі', ru: 'Показывать в панели', en: 'Show in panel', fr: 'Afficher dans le panneau', de: 'Im Panel anzeigen', es: 'Mostrar en el panel', it: 'Mostra nel pannello', pl: 'Pokaż w panelu' },
  show_in_context: { uk: 'У контекстному меню', ru: 'В контекстном меню', en: 'In context menu', fr: 'Dans le menu contextuel', de: 'Im Kontextmenü', es: 'En el menú contextual', it: 'Nel menu contestuale', pl: 'W menu kontekstowym' },
  hidden_badge: { uk: 'Приховано', ru: 'Скрыта', en: 'Hidden', fr: 'Masqué', de: 'Ausgeblendet', es: 'Oculto', it: 'Nascosto', pl: 'Ukryty' },
  inline_scale: { uk: 'Розмір меню біля ⚡ (%)', ru: 'Размер меню у ⚡ (%)', en: 'Size of the ⚡ menu (%)', fr: 'Taille du menu ⚡ (%)', de: 'Größe des ⚡-Menüs (%)', es: 'Tamaño del menú ⚡ (%)', it: 'Dimensione del menu ⚡ (%)', pl: 'Rozmiar menu ⚡ (%)' },
  favicons: { uk: 'Значки сайтів на кнопках', ru: 'Значки сайтов на кнопках', en: 'Site icons on buttons', fr: 'Icônes des sites sur les boutons', de: 'Website-Symbole auf Buttons', es: 'Iconos de sitios en los botones', it: 'Icone dei siti sui pulsanti', pl: 'Ikony stron na przyciskach' },
  history: { uk: 'Історія запитів у вікні розширення', ru: 'История запросов в окне расширения', en: 'Search history in the extension popup', fr: 'Historique des recherches dans la fenêtre', de: 'Suchverlauf im Erweiterungsfenster', es: 'Historial de búsquedas en la ventana', it: 'Cronologia ricerche nella finestra', pl: 'Historia wyszukiwań w oknie rozszerzenia' },
  clear_history: { uk: 'Очистити', ru: 'Очистить', en: 'Clear', fr: 'Effacer', de: 'Leeren', es: 'Borrar', it: 'Cancella', pl: 'Wyczyść' },
  history_cleared: { uk: 'Історію очищено ✓', ru: 'История очищена ✓', en: 'History cleared ✓', fr: 'Historique effacé ✓', de: 'Verlauf geleert ✓', es: 'Historial borrado ✓', it: 'Cronologia cancellata ✓', pl: 'Historia wyczyszczona ✓' },
  hotkey: { uk: 'Гаряча клавіша пошуку', ru: 'Горячая клавиша поиска', en: 'Search hotkey', fr: 'Raccourci de recherche', de: 'Such-Tastenkürzel', es: 'Atajo de búsqueda', it: 'Scorciatoia di ricerca', pl: 'Skrót wyszukiwania' },
  hotkey_change: { uk: 'Змінити', ru: 'Изменить', en: 'Change', fr: 'Modifier', de: 'Ändern', es: 'Cambiar', it: 'Cambia', pl: 'Zmień' },
  hotkey_none: { uk: 'Не задано', ru: 'Не задана', en: 'Not set', fr: 'Non défini', de: 'Nicht gesetzt', es: 'Sin asignar', it: 'Non impostata', pl: 'Nie ustawiono' },
  autosave_note: { uk: 'Зміни зберігаються автоматично', ru: 'Изменения сохраняются автоматически', en: 'Changes are saved automatically', fr: 'Les modifications sont enregistrées automatiquement', de: 'Änderungen werden automatisch gespeichert', es: 'Los cambios se guardan automáticamente', it: 'Le modifiche vengono salvate automaticamente', pl: 'Zmiany zapisują się automatycznie' },
  autosaved: { uk: 'Збережено ✓', ru: 'Сохранено ✓', en: 'Saved ✓', fr: 'Enregistré ✓', de: 'Gespeichert ✓', es: 'Guardado ✓', it: 'Salvato ✓', pl: 'Zapisano ✓' },
  group_appearance: { uk: 'Вигляд', ru: 'Внешний вид', en: 'Appearance', fr: 'Apparence', de: 'Darstellung', es: 'Apariencia', it: 'Aspetto', pl: 'Wygląd' },
  group_panel: { uk: 'Панель при виділенні тексту', ru: 'Панель при выделении текста', en: 'Panel on text selection', fr: 'Panneau à la sélection de texte', de: 'Panel beim Markieren von Text', es: 'Panel al seleccionar texto', it: 'Pannello alla selezione del testo', pl: 'Panel przy zaznaczaniu tekstu' },
  group_menu: { uk: 'Меню кнопок сайтів', ru: 'Меню кнопок сайтов', en: 'Site buttons menu', fr: 'Menu des boutons de sites', de: 'Menü der Seiten-Buttons', es: 'Menú de botones de sitios', it: 'Menu dei pulsanti dei siti', pl: 'Menu przycisków stron' },
  group_other: { uk: 'Вікно розширення та інше', ru: 'Окно расширения и другое', en: 'Popup and more', fr: 'Fenêtre de l’extension et plus', de: 'Erweiterungsfenster und mehr', es: 'Ventana de la extensión y más', it: 'Finestra dell’estensione e altro', pl: 'Okno rozszerzenia i inne' },
  panel_order: { uk: 'Кнопки панелі та їх порядок', ru: 'Кнопки панели и их порядок', en: 'Panel buttons and their order', fr: 'Boutons du panneau et leur ordre', de: 'Panel-Buttons und ihre Reihenfolge', es: 'Botones del panel y su orden', it: 'Pulsanti del pannello e il loro ordine', pl: 'Przyciski panelu i ich kolejność' },
  order_ms: { uk: 'Кнопки пошуку', ru: 'Кнопки поиска', en: 'Search buttons', fr: 'Boutons de recherche', de: 'Such-Buttons', es: 'Botones de búsqueda', it: 'Pulsanti di ricerca', pl: 'Przyciski wyszukiwania' },
  menu_width: { uk: 'Ширина меню (px)', ru: 'Ширина меню (px)', en: 'Menu width (px)', fr: 'Largeur du menu (px)', de: 'Menübreite (px)', es: 'Ancho del menú (px)', it: 'Larghezza del menu (px)', pl: 'Szerokość menu (px)' },
  show_go: { uk: 'Кнопки ⚡ праворуч (одразу перший результат)', ru: 'Кнопки ⚡ справа (сразу первый результат)', en: '⚡ buttons on the right (open the first result)', fr: 'Boutons ⚡ à droite (ouvrir le premier résultat)', de: '⚡-Buttons rechts (erstes Ergebnis öffnen)', es: 'Botones ⚡ a la derecha (abrir el primer resultado)', it: 'Pulsanti ⚡ a destra (apri il primo risultato)', pl: 'Przyciski ⚡ po prawej (otwórz pierwszy wynik)' },
  move_up: { uk: 'Вище', ru: 'Выше', en: 'Move up', fr: 'Monter', de: 'Nach oben', es: 'Subir', it: 'Sposta su', pl: 'W górę' },
  move_down: { uk: 'Нижче', ru: 'Ниже', en: 'Move down', fr: 'Descendre', de: 'Nach unten', es: 'Bajar', it: 'Sposta giù', pl: 'W dół' },
  translate_to: { uk: 'Мова перекладу', ru: 'Язык перевода', en: 'Translate to', fr: 'Traduire vers', de: 'Übersetzen in', es: 'Traducir a', it: 'Traduci in', pl: 'Tłumacz na' },
  translate_auto: { uk: 'Авто (мова інтерфейсу)', ru: 'Авто (язык интерфейса)', en: 'Auto (interface language)', fr: 'Auto (langue de l’interface)', de: 'Auto (Oberflächensprache)', es: 'Auto (idioma de la interfaz)', it: 'Auto (lingua dell’interfaccia)', pl: 'Auto (język interfejsu)' },
  theme: { uk: 'Тема', ru: 'Тема', en: 'Theme', fr: 'Thème', de: 'Design', es: 'Tema', it: 'Tema', pl: 'Motyw' },
  theme_dark: { uk: 'Темна', ru: 'Тёмная', en: 'Dark', fr: 'Sombre', de: 'Dunkel', es: 'Oscuro', it: 'Scuro', pl: 'Ciemny' },
  theme_light: { uk: 'Світла', ru: 'Светлая', en: 'Light', fr: 'Clair', de: 'Hell', es: 'Claro', it: 'Chiaro', pl: 'Jasny' },
  theme_auto: { uk: 'Авто (як у системі)', ru: 'Авто (как в системе)', en: 'Auto (system)', fr: 'Auto (système)', de: 'Auto (System)', es: 'Auto (sistema)', it: 'Auto (sistema)', pl: 'Auto (systemowy)' },
  drag_hint: { uk: 'Перетягніть, щоб змінити порядок', ru: 'Перетащите, чтобы изменить порядок', en: 'Drag to reorder', fr: 'Glissez pour réordonner', de: 'Zum Sortieren ziehen', es: 'Arrastra para reordenar', it: 'Trascina per riordinare', pl: 'Przeciągnij, aby zmienić kolejność' }
};
function t2(key) {
  return (extraI18n[key] && (extraI18n[key][currentLang] || extraI18n[key].en)) || '';
}

// Reads the cards from the page into userButtons, so typed-but-unsaved edits survive re-rendering
function readCards() {
  return Array.from(document.querySelectorAll('.card')).map(c => ({
    name: c.querySelector('.v-name').value.trim(),
    url: c.querySelector('.v-url').value.trim(),
    sel: c.querySelector('.v-sel').value.trim(),
    type: c.querySelector('.v-type').value,
    color: c.querySelector('.v-color').value,
    textColor: c.querySelector('.v-text-color').value,
    active: c.querySelector('.v-active').checked,
    ctx: c.querySelector('.v-ctx').checked
  }));
}
function syncFromDom() {
  if (document.querySelector('.card')) userButtons = readCards();
}

function normalizeButtons(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(b => b && typeof b === 'object').slice(0, 50).map(b => ({
    name: String(b.name || '').slice(0, 60),
    url: String(b.url || '').slice(0, 500),
    sel: String(b.sel || '').slice(0, 200),
    type: b.type === 'mini' ? 'mini' : 'large',
    color: safeColor(b.color, '#383838'),
    textColor: safeColor(b.textColor, '#ffffff'),
    active: b.active !== false,
    // older buttons had one switch for both places: keep their context menu as it was
    ctx: b.ctx === undefined ? b.active !== false : !!b.ctx
  }));
}

// Validates a backup file: only known keys, known types, sane sizes
function sanitizeImport(cfg) {
  if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return null;
  const out = {};
  if (Array.isArray(cfg.userButtons)) out.userButtons = normalizeButtons(cfg.userButtons);
  if (cfg.genSettings && typeof cfg.genSettings === 'object') {
    const g = MS.withDefaults(cfg.genSettings); // keys missing in old backups get today's defaults
    out.genSettings = {
      theme: g.theme,
      translateTo: MS.TRANSLATE_LANGS[g.translateTo] ? g.translateTo : 'auto',
      showMS: !!g.showMS,
      inlineButtons: !!g.inlineButtons,
      inlineScale: clampScale(g.inlineScale),
      menuWidth: MS.clampWidth(g.menuWidth),
      showGo: !!g.showGo,
      panelOrder: MS.normalizeOrder(g.panelOrder),
      showFavicons: !!g.showFavicons,
      keepHistory: !!g.keepHistory,
      showContext: !!g.showContext,
      showGS: !!g.showGS,
      showTR: !!g.showTR,
      showCP: !!g.showCP,
      font: String(g.font || "'Rubik', sans-serif").slice(0, 100),
      useCustomFont: !!g.useCustomFont,
      customFontName: String(g.customFontName || '').slice(0, 60),
      fontSize: Math.min(24, Math.max(8, Number(g.fontSize) || MS.DEFAULT_SETTINGS.fontSize)),
      customLogo: (typeof g.customLogo === 'string' && g.customLogo.startsWith('data:image/') && g.customLogo.length < 300000) ? g.customLogo : '',
      language: MS.SUPPORTED.includes(g.language) ? g.language : MS.defaultLang(),
      requireHoldKeyAll: !!g.requireHoldKeyAll,
      requireHoldKeyOnList: !!g.requireHoldKeyOnList,
      holdKey: String(g.holdKey || '').slice(0, 30),
      holdKeySites: Array.isArray(g.holdKeySites) ? g.holdKeySites.map(x => String(x).trim().slice(0, 100)).filter(Boolean).slice(0, 200) : []
    };
  }
  return (out.userButtons || out.genSettings) ? out : null;
}

// Scales a picked image down to 96x96 so the settings never grow too big
function imageFileToLogo(file, done) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 96, canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height);
      canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      done(canvas.toDataURL('image/png'));
    };
    img.onerror = () => alert(translations[currentLang].file_error || 'Error');
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function renderAll() {
  const listContainer = document.getElementById('buttons-list');
  listContainer.innerHTML = '';
  if (!Array.isArray(userButtons)) userButtons = [];

  userButtons.forEach((btn, index) => {
    const card = document.createElement('div');
    card.className = 'card' + (btn.active === false ? ' card-off' : '');

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title"><span class="drag-handle" title="${escapeHtml(t2('drag_hint'))}">⠿</span><strong class="card-name${btn.name ? '' : ' empty'}">${btn.name ? escapeHtml(btn.name) : translations[currentLang].name_placeholder}</strong><span class="hidden-badge">${escapeHtml(t2('hidden_badge'))}</span></div>
        <div class="sort-btns">
          <button class="btn-sort" data-idx="${index}" data-dir="up">▲</button>
          <button class="btn-sort" data-idx="${index}" data-dir="down">▼</button>
        </div>
      </div>
      <input type="text" placeholder="${translations[currentLang].name_placeholder}" class="v-name" value="${escapeHtml(btn.name)}">
      <input type="text" placeholder="${translations[currentLang].url_placeholder}" class="v-url" value="${escapeHtml(btn.url)}">
      <input type="text" placeholder="${translations[currentLang].sel_placeholder}" class="v-sel" value="${escapeHtml(btn.sel)}">
      <div class="row-flex">
        <select class="v-type" style="flex: 1;"><option value="large" ${btn.type==='large'?'selected':''}>${translations[currentLang].large}</option><option value="mini" ${btn.type==='mini'?'selected':''}>${translations[currentLang].mini}</option></select>
        
        <div class="color-block">
          <span class="color-label">${translations[currentLang].background}</span>
          <div class="color-picker-wrapper"><input type="color" class="v-color" value="${safeColor(btn.color, '#333333')}"></div>
        </div>
        
        <div class="color-block">
          <span class="color-label">${translations[currentLang].text}</span>
          <div class="color-picker-wrapper"><input type="color" class="v-text-color" value="${safeColor(btn.textColor, '#ffffff')}"></div>
        </div>

        <button class="btn del-btn" data-idx="${index}" style="margin-left:auto">${translations[currentLang].delete}</button>
      </div>
      <div class="toggle-row">
        <label class="toggle-item">
          <span class="switch"><input type="checkbox" class="v-active" ${btn.active!==false?'checked':''}><span class="slider"></span></span>
          <span>${escapeHtml(t2('show_in_panel'))}</span>
        </label>
        <label class="toggle-item">
          <span class="switch"><input type="checkbox" class="v-ctx" ${btn.ctx!==false?'checked':''}><span class="slider"></span></span>
          <span>${escapeHtml(t2('show_in_context'))}</span>
        </label>
      </div>`;
    listContainer.appendChild(card);
  });
}

function applyLanguage(lang) {
  currentLang = lang;
  const t = translations[lang] || translations['en'] || {};
  
  if (document.getElementById('h1')) document.title = t.page_title || "Settings";
  if (document.getElementById('h1')) document.getElementById('h1').textContent = t.h1;
  if (document.getElementById('reset-logo')) document.getElementById('reset-logo').textContent = t.reset_logo;
  if (document.getElementById('instructions-summary')) document.getElementById('instructions-summary').textContent = t.instructions_summary;
  if (document.getElementById('instructions-content')) document.getElementById('instructions-content').innerHTML = t.instructions_content;
  if (document.getElementById('general-settings')) document.getElementById('general-settings').textContent = t.general_settings;
  
  if (document.getElementById('show-ms-label')) document.getElementById('show-ms-label').textContent = t.show_ms_button;
  if (document.getElementById('inline-buttons-label')) document.getElementById('inline-buttons-label').textContent = t2('inline_buttons');
  [['inline-scale-label', 'inline_scale'], ['favicons-label', 'favicons'], ['history-label', 'history'],
   ['clear-history-btn', 'clear_history'], ['hotkey-label', 'hotkey'], ['hotkey-change', 'hotkey_change'],
   ['autosave-note', 'autosave_note'], ['theme-label', 'theme'], ['translate-to-label', 'translate_to'],
   ['group-appearance', 'group_appearance'], ['group-panel', 'group_panel'], ['group-menu', 'group_menu'],
   ['group-other', 'group_other'], ['panel-order-label', 'panel_order'], ['order-ms-label', 'order_ms'],
   ['menu-width-label', 'menu_width'], ['show-go-label', 'show_go']].forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t2(key);
  });
  document.querySelectorAll('.order-up').forEach((b) => { b.title = t2('move_up'); });
  document.querySelectorAll('.order-down').forEach((b) => { b.title = t2('move_down'); });
  document.querySelectorAll('#gen-theme option').forEach((o) => { o.textContent = t2('theme_' + o.value); });
  fillTranslateLangs();
  showHotkey();
  if (document.getElementById('show-gs-label')) document.getElementById('show-gs-label').textContent = t.show_gs_button;
  if (document.getElementById('show-tr-label')) document.getElementById('show-tr-label').textContent = t.show_tr_button;
  if (document.getElementById('show-cp-label')) document.getElementById('show-cp-label').textContent = t.show_cp_button;
  if (document.getElementById('show-context-label')) document.getElementById('show-context-label').textContent = t.show_context_menu;
  if (document.getElementById('font-selection-label')) document.getElementById('font-selection-label').textContent = t.font_selection;
  if (document.getElementById('custom-font-label')) document.getElementById('custom-font-label').textContent = t.custom_font;
  if (document.getElementById('gen-custom-font-name')) document.getElementById('gen-custom-font-name').placeholder = t.custom_font_placeholder;
  if (document.getElementById('button-font-size-label')) document.getElementById('button-font-size-label').textContent = t.button_font_size;
  if (document.getElementById('search-buttons')) document.getElementById('search-buttons').textContent = t.search_buttons;
  if (document.getElementById('add-btn')) document.getElementById('add-btn').textContent = t.add_new_button;
  if (document.getElementById('save-btn')) document.getElementById('save-btn').textContent = t.save_settings;
  if (document.getElementById('export-btn')) document.getElementById('export-btn').textContent = t.export_backup;
  if (document.getElementById('import-btn')) document.getElementById('import-btn').textContent = t.import_restore;
  if (document.getElementById('interface-language')) document.getElementById('interface-language').textContent = t.interface_language;

  // Нові налаштування зажатої клавіші
  if (document.getElementById('require-hold-all-label')) {
    document.getElementById('require-hold-all-label').textContent = 
      t.require_hold_all || "Показувати кнопки при виділенні з зажатою клавішою на ВСІХ сайтах";
  }

  if (document.getElementById('require-hold-list-label')) {
    document.getElementById('require-hold-list-label').textContent = 
      t.require_hold_list || "Показувати кнопки при виділенні з зажатою клавішою тільки на сайтах зі списку";
  }

  if (document.getElementById('hold-key-label')) {
    document.getElementById('hold-key-label').textContent = 
      t.hold_key_label || "Клавіша-модифікатор";
  }

  if (document.getElementById('capture-key-btn')) {
    document.getElementById('capture-key-btn').textContent = 
      t.capture_key_btn || "Натисніть для вибору клавіші";
  }

  if (document.getElementById('hold-sites-label')) {
    document.getElementById('hold-sites-label').textContent = 
      t.hold_sites_label || "Список сайтів (один домен на рядок)";
  }

  const holdEl = document.getElementById('current-hold-key');
  if (holdEl && !selectedHoldKey) holdEl.innerText = t2('not_set');

  renderAll();
}

chrome.storage.local.get(['userButtons', 'genSettings'], (res) => {
  userButtons = normalizeButtons(res.userButtons);

  // stored values over the defaults from shared.js (first run = pure defaults)
  const g = MS.withDefaults(res.genSettings);
  const lang = MS.SUPPORTED.includes(g.language) ? g.language : MS.defaultLang();

  document.getElementById('gen-theme').value = g.theme;
  pendingTranslateTo = MS.TRANSLATE_LANGS[g.translateTo] ? g.translateTo : 'auto';
  MS.applyTheme(g.theme);
  document.getElementById('gen-show-ms').checked = !!g.showMS;
  document.getElementById('gen-inline-buttons').checked = !!g.inlineButtons;
  currentScale = clampScale(g.inlineScale);
  currentWidth = MS.clampWidth(g.menuWidth);
  document.getElementById('gen-show-go').checked = !!g.showGo;
  applyPanelOrder(g.panelOrder);
  document.getElementById('gen-show-favicons').checked = !!g.showFavicons;
  document.getElementById('gen-keep-history').checked = !!g.keepHistory;
  document.getElementById('gen-show-gs').checked = !!g.showGS;
  document.getElementById('gen-show-tr').checked = !!g.showTR;
  document.getElementById('gen-show-cp').checked = !!g.showCP;
  document.getElementById('gen-show-context').checked = !!g.showContext;

  document.getElementById('gen-font').value = g.font;
  document.getElementById('gen-use-custom-font').checked = !!g.useCustomFont;
  document.getElementById('gen-custom-font-name').value = g.customFontName || "";

  currentFontSize = Math.min(24, Math.max(8, Number(g.fontSize) || MS.DEFAULT_SETTINGS.fontSize));
  customLogo = g.customLogo || "";
  if (customLogo) displayLogo.src = customLogo;
  document.getElementById('gen-font-size-val').innerText = currentFontSize;
  document.getElementById('gen-language').value = lang;

  document.getElementById('gen-require-hold-all').checked = !!g.requireHoldKeyAll;
  document.getElementById('gen-require-hold-list').checked = !!g.requireHoldKeyOnList;
  selectedHoldKey = g.holdKey || '';
  document.getElementById('current-hold-key').innerText = selectedHoldKey || t2('not_set');
  document.getElementById('hold-key-sites').value = (Array.isArray(g.holdKeySites) ? g.holdKeySites : []).join('\n');
  updateHoldKeyVisibility();

  applyLanguage(lang);
  updateScaleUi();
  updateWidthUi();
  updateTranslateRow();
  settingsLoaded = true; // autosave only reacts to the user's changes from now on
});

// ================= MENU SIZE, HOTKEY, HISTORY =================
function updateScaleUi() {
  document.getElementById('inline-scale-val').innerText = currentScale;
  document.getElementById('inline-scale-row').classList.toggle('disabled', !document.getElementById('gen-inline-buttons').checked);
}
document.getElementById('gen-inline-buttons').addEventListener('change', updateScaleUi);
document.getElementById('scale-inc').onclick = () => {
  if (currentScale < 100) { currentScale += 5; updateScaleUi(); scheduleSave(); }
};
document.getElementById('scale-dec').onclick = () => {
  if (currentScale > 60) { currentScale -= 5; updateScaleUi(); scheduleSave(); }
};

// Menu width: 200–400 px, step 10
function updateWidthUi() { document.getElementById('menu-width-val').innerText = currentWidth; }
document.getElementById('width-inc').onclick = () => {
  if (currentWidth < 400) { currentWidth += 10; updateWidthUi(); scheduleSave(); }
};
document.getElementById('width-dec').onclick = () => {
  if (currentWidth > 200) { currentWidth -= 10; updateWidthUi(); scheduleSave(); }
};

// ================= ORDER OF THE 4 PANEL BUTTONS =================
function readPanelOrder() {
  return Array.from(document.querySelectorAll('#panel-order .order-item')).map((el) => el.dataset.key);
}
function updateOrderArrows() {
  const items = document.querySelectorAll('#panel-order .order-item');
  items.forEach((el, i) => {
    el.querySelector('.order-up').disabled = i === 0;
    el.querySelector('.order-down').disabled = i === items.length - 1;
  });
}
function applyPanelOrder(order) {
  const list = document.getElementById('panel-order');
  MS.normalizeOrder(order).forEach((k) => {
    const el = list.querySelector(`.order-item[data-key="${k}"]`);
    if (el) list.appendChild(el);
  });
  updateOrderArrows();
}
document.getElementById('panel-order').addEventListener('click', (e) => {
  const btn = e.target.closest('.order-up, .order-down');
  if (!btn || btn.disabled) return;
  const item = btn.closest('.order-item');
  const list = item.parentElement;
  if (btn.classList.contains('order-up') && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
  if (btn.classList.contains('order-down') && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
  item.classList.remove('moved'); void item.offsetWidth; item.classList.add('moved'); // short highlight
  updateOrderArrows();
  scheduleSave();
});

function showHotkey() {
  const el = document.getElementById('hotkey-val');
  if (!el || !chrome.commands?.getAll) return;
  chrome.commands.getAll((cmds) => {
    const cmd = (cmds || []).find((c) => c.name === 'ms-search');
    el.textContent = (cmd && cmd.shortcut) || t2('hotkey_none');
  });
}
document.getElementById('hotkey-change').onclick = () => {
  // chrome:// pages cannot be linked, but an extension may open this one in a tab
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
};
// the shortcut may be changed in the other tab: refresh when the user comes back
window.addEventListener('focus', showHotkey);

document.getElementById('clear-history-btn').onclick = () => {
  chrome.storage.local.remove('searchHistory', () => showToast(t2('history_cleared')));
};

// ================= AUTOSAVE =================

function scheduleSave() {
  if (!settingsLoaded || saveBlocked) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveAll(false), 500);
}

let toastTimer = null;
function showToast(text) {
  const toast = document.getElementById('save-toast');
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1400);
}

// Any edit on the page (text, switches, selects, colors) is saved shortly after.
['input', 'change'].forEach((type) => document.addEventListener(type, (e) => {
  if (e.target.type === 'file') return; // logo / import have their own handlers
  scheduleSave();
}));

// Unsaved edit still waiting for its timer when the tab closes: save it right away.
window.addEventListener('beforeunload', () => {
  if (saveTimer) { clearTimeout(saveTimer); saveAll(false); }
});

// ================= TRANSLATION LANGUAGE =================
// The list is rebuilt on every language change (the "Auto" label is translated); the choice is kept.
function fillTranslateLangs() {
  const sel = document.getElementById('gen-translate-to');
  if (!sel) return;
  const current = sel.options.length ? sel.value : pendingTranslateTo;
  sel.textContent = '';
  sel.appendChild(new Option(t2('translate_auto'), 'auto'));
  Object.entries(MS.TRANSLATE_LANGS)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .forEach(([code, name]) => sel.appendChild(new Option(name, code)));
  sel.value = MS.TRANSLATE_LANGS[current] ? current : 'auto';
}
function updateTranslateRow() {
  document.getElementById('translate-to-row').classList.toggle('disabled', !document.getElementById('gen-show-tr').checked);
}
document.getElementById('gen-show-tr').addEventListener('change', updateTranslateRow);

// Theme switches immediately; autosave stores it
document.getElementById('gen-theme').addEventListener('change', (e) => MS.applyTheme(e.target.value));

// The card header shows the button's own name while it is typed
document.getElementById('buttons-list').addEventListener('input', (e) => {
  if (!e.target.classList.contains('v-name')) return;
  const title = e.target.closest('.card')?.querySelector('.card-name');
  if (!title) return;
  const name = e.target.value.trim();
  title.textContent = name || translations[currentLang].name_placeholder;
  title.classList.toggle('empty', !name);
});

document.getElementById('gen-language').addEventListener('change', (e) => {
  syncFromDom(); // re-rendering the cards must not lose typed text
  applyLanguage(e.target.value);
});

// ================= DRAG & DROP OF BUTTON CARDS =================
(function initDragAndDrop() {
  const list = document.getElementById('buttons-list');
  let dragCard = null;
  const cards = () => Array.from(list.querySelectorAll('.card'));
  const clearMarks = () => cards().forEach((c) => c.classList.remove('drop-before', 'drop-after'));

  // Cards are draggable only by the handle, so text in the inputs can still be selected.
  list.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('.drag-handle');
    if (handle) handle.closest('.card').draggable = true;
  });
  document.addEventListener('mouseup', () => {
    if (!dragCard) cards().forEach((c) => { c.draggable = false; });
  });

  list.addEventListener('dragstart', (e) => {
    dragCard = e.target.closest('.card');
    if (!dragCard) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    setTimeout(() => dragCard && dragCard.classList.add('dragging'), 0);
  });

  list.addEventListener('dragover', (e) => {
    if (!dragCard) return;
    e.preventDefault();
    const over = e.target.closest('.card');
    clearMarks();
    if (!over || over === dragCard) return;
    const r = over.getBoundingClientRect();
    over.classList.add(e.clientY < r.top + r.height / 2 ? 'drop-before' : 'drop-after');
  });

  list.addEventListener('drop', (e) => {
    if (!dragCard) return;
    e.preventDefault();
    const over = list.querySelector('.drop-before, .drop-after');
    if (over) {
      syncFromDom();
      const all = cards();
      const from = all.indexOf(dragCard);
      let to = all.indexOf(over) + (over.classList.contains('drop-after') ? 1 : 0);
      if (from < to) to--;
      const [moved] = userButtons.splice(from, 1);
      userButtons.splice(to, 0, moved);
      dragCard = null;
      renderAll();
      scheduleSave();
    }
  });

  list.addEventListener('dragend', () => {
    if (dragCard) { dragCard.classList.remove('dragging'); dragCard.draggable = false; }
    dragCard = null;
    clearMarks();
  });
})();

// ================= HELD KEY VISIBILITY & CAPTURE =================
function updateHoldKeyVisibility() {
  const allChecked = document.getElementById('gen-require-hold-all').checked;
  const listChecked = document.getElementById('gen-require-hold-list').checked;
  document.getElementById('hold-key-container').style.display = (allChecked || listChecked) ? 'block' : 'none';
}

document.getElementById('gen-require-hold-all').onchange = updateHoldKeyVisibility;
document.getElementById('gen-require-hold-list').onchange = updateHoldKeyVisibility;

// Захоплення клавіші
const captureBtn = document.getElementById('capture-key-btn');
captureBtn.addEventListener('click', () => {
  captureBtn.textContent = t2('capture_press');
  
  const keyHandler = (e) => {
    e.preventDefault();
    selectedHoldKey = e.key; 
    document.getElementById('current-hold-key').innerText = selectedHoldKey || t2('not_set');
    captureBtn.textContent = translations[currentLang].capture_key_btn || t2('capture_btn');
    document.removeEventListener('keydown', keyHandler);
    scheduleSave();
  };
  
  document.addEventListener('keydown', keyHandler);
});

document.getElementById('font-inc').onclick = () => { 
  if(currentFontSize < 24) { 
    currentFontSize++;
    document.getElementById('gen-font-size-val').innerText = currentFontSize;
    scheduleSave();
  }
};

document.getElementById('font-dec').onclick = () => { 
  if(currentFontSize > 8) { 
    currentFontSize--;
    document.getElementById('gen-font-size-val').innerText = currentFontSize;
    scheduleSave();
  }
};

document.getElementById('buttons-list').onclick = (e) => {
  syncFromDom();
  const idx = parseInt(e.target.getAttribute('data-idx'));
  if (e.target.classList.contains('del-btn')) {
    if(confirm(translations[currentLang].confirm_delete)) { 
      userButtons.splice(idx, 1);
      renderAll();
      scheduleSave();
    }
  }
  if (e.target.classList.contains('btn-sort')) {
    const dir = e.target.getAttribute('data-dir');
    if (dir === 'up' && idx > 0) [userButtons[idx], userButtons[idx-1]] = [userButtons[idx-1], userButtons[idx]];
    else if (dir === 'down' && idx < userButtons.length - 1) [userButtons[idx], userButtons[idx+1]] = [userButtons[idx+1], userButtons[idx]];
    renderAll();
    scheduleSave();
  }
};

document.getElementById('add-btn').onclick = () => {
  syncFromDom();
  userButtons.push({name:'', url:'', sel:'', type:'large', color:'#383838', textColor:'#ffffff', active:true, ctx:true});
  renderAll();
  scheduleSave();
  const cards = document.querySelectorAll('.card');
  const last = cards[cards.length - 1];
  if (last) { last.scrollIntoView({ behavior: 'smooth', block: 'center' }); last.querySelector('.v-name').focus({ preventScroll: true }); }
};

// Dim a card right away when its "show in panel" switch is turned off
document.getElementById('buttons-list').addEventListener('change', (e) => {
  if (!e.target.classList.contains('v-active')) return;
  e.target.closest('.card')?.classList.toggle('card-off', !e.target.checked);
});

document.getElementById('save-btn').onclick = () => saveAll(true);

function saveAll(manual) {
  clearTimeout(saveTimer);
  saveTimer = null;
  if (saveBlocked) return;
  const updated = readCards();
  userButtons = updated; // keep memory in sync with the page

  const gen = {
    theme: document.getElementById('gen-theme').value,
    translateTo: document.getElementById('gen-translate-to').value || 'auto',
    showMS: document.getElementById('gen-show-ms').checked,
    inlineButtons: document.getElementById('gen-inline-buttons').checked,
    inlineScale: currentScale,
    menuWidth: currentWidth,
    showGo: document.getElementById('gen-show-go').checked,
    panelOrder: readPanelOrder(),
    showFavicons: document.getElementById('gen-show-favicons').checked,
    keepHistory: document.getElementById('gen-keep-history').checked,
    showContext: document.getElementById('gen-show-context').checked,
    showGS: document.getElementById('gen-show-gs').checked,
    showTR: document.getElementById('gen-show-tr').checked,
    showCP: document.getElementById('gen-show-cp').checked,
    font: document.getElementById('gen-font').value,
    useCustomFont: document.getElementById('gen-use-custom-font').checked,
    customFontName: document.getElementById('gen-custom-font-name').value,
    fontSize: currentFontSize,
    customLogo: customLogo,
    language: document.getElementById('gen-language').value,

    // === НОВІ НАЛАШТУВАННЯ ЗАЖАТОЇ КЛАВІШІ ===
    requireHoldKeyAll: document.getElementById('gen-require-hold-all').checked,
    requireHoldKeyOnList: document.getElementById('gen-require-hold-list').checked,
    holdKey: selectedHoldKey,
    holdKeySites: document.getElementById('hold-key-sites').value
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  };

  // history switched off: forget what was stored
  if (!gen.keepHistory) chrome.storage.local.remove('searchHistory');

  // the background script rebuilds the context menu itself via storage.onChanged
  chrome.storage.local.set({ userButtons: updated, genSettings: gen }, () => {
    if (!manual) { showToast(t2('autosaved')); return; }
    const btn = document.getElementById('save-btn');
    btn.innerText = translations[currentLang].saved || "ЗБЕРЕЖЕНО ✓";
    btn.style.background = '#00ff88';
    setTimeout(() => {
      btn.innerText = translations[currentLang].save_settings_js || "ЗБЕРЕГТИ НАЛАШТУВАННЯ";
      btn.style.background = '';
    }, 2000);
  });
}

document.getElementById('export-btn').onclick = () => {
  chrome.storage.local.get(['userButtons', 'genSettings'], (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `media_searcher_backup.json`; 
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
};

document.getElementById('import-btn').onclick = () => document.getElementById('import-file').click();
document.getElementById('import-file').onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const config = sanitizeImport(JSON.parse(ev.target.result));
      if (!config) throw new Error('bad config');
      // a pending autosave must not overwrite the imported settings
      saveBlocked = true;
      clearTimeout(saveTimer);
      saveTimer = null;
      chrome.storage.local.set(config, () => location.reload());
    } catch (err) { 
      alert(translations[currentLang].file_error || "Помилка формату файлу."); 
    }
  };
  reader.readAsText(file);
};