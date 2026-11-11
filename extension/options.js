let userButtons = [];
let currentFontSize = 11;
let customLogo = "";
let selectedHoldKey = '';

const translations = {
  uk: {
    page_title: "Media Search Settings",
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
Ce sera le premier résultat ouvert automatiquement, независимо de la section.
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
    interface_language: "Schnittstellensprache",
    show_gs_button: "Google-Suche",
    show_tr_button: "Übersetzungsschaltfläche",
    show_cp_button: "Kopier-Schaltfläche",
    require_hold_all: "Buttons bei Texteingabe mit gehaltener Taste auf ALLEN Seiten anzeigen",
    require_hold_list: "Buttons bei Texteingabe mit gehaltener Taste NUR auf Seiten aus der Liste anzeigen",
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
Questo sarà il primo risultato aperto automaticamente, независимо dalla sezione.
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
<p><i>Wskazówka: Jeśli automatyczne przejście (⚡) nie działa, spróbuj innego selektora lub остав pole puste.</i></p>
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
  imageFileToLogo(file, (dataUrl) => { customLogo = dataUrl; displayLogo.src = customLogo; });
};
resetLogoBtn.onclick = () => { customLogo = ""; displayLogo.src = "icon.png"; };

function escapeHtml(text) {
  if (text === undefined || text === null) return "";
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function safeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
}

// Texts that used to be hard-coded in Ukrainian
const extraI18n = {
  not_set:     { uk: 'Не встановлено', ru: 'Не задано', en: 'Not set', fr: 'Non défini', de: 'Nicht festgelegt', es: 'No establecida', it: 'Non impostato', pl: 'Nie ustawiono' },
  capture_press: { uk: 'Натисніть клавішу на клавіатурі...', ru: 'Нажмите клавишу на клавиатуре...', en: 'Press a key on the keyboard...', fr: 'Appuyez sur une touche...', de: 'Drücken Sie eine Taste...', es: 'Pulse una tecla...', it: 'Premi un tasto...', pl: 'Naciśnij klawisz...' },
  capture_btn: { uk: 'Натисніть для вибору клавіші', ru: 'Нажмите для выбора клавиши', en: 'Click to choose a key', fr: 'Cliquez pour choisir une touche', de: 'Klicken, um eine Taste zu wählen', es: 'Haga clic para elegir una tecla', it: 'Clicca per scegliere un tasto', pl: 'Kliknij, aby wybrać klawisz' }
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
    active: c.querySelector('.v-active').checked
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
    active: b.active !== false
  }));
}

// Validates a backup file: only known keys, known types, sane sizes
function sanitizeImport(cfg) {
  if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return null;
  const out = {};
  if (Array.isArray(cfg.userButtons)) out.userButtons = normalizeButtons(cfg.userButtons);
  if (cfg.genSettings && typeof cfg.genSettings === 'object') {
    const g = cfg.genSettings;
    out.genSettings = {
      showMS: g.showMS !== false,
      showContext: g.showContext !== false,
      showGS: g.showGS !== false,
      showTR: g.showTR !== false,
      showCP: g.showCP !== false,
      font: String(g.font || "'Rubik', sans-serif").slice(0, 100),
      useCustomFont: !!g.useCustomFont,
      customFontName: String(g.customFontName || '').slice(0, 60),
      fontSize: Math.min(24, Math.max(8, Number(g.fontSize) || 11)),
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
    card.className = 'card';
    
    card.innerHTML = `
      <div class="card-header">
        <strong>${translations[currentLang].name_placeholder}</strong>
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

        <div style="display:flex; align-items:center; gap:8px;">
           <label class="switch"><input type="checkbox" class="v-active" ${btn.active!==false?'checked':''}> <span class="slider"></span></label>
           <span style="font-size:13px; color:#888">${translations[currentLang].on}</span>
        </div>
        <button class="btn del-btn" data-idx="${index}" style="margin-left:auto">${translations[currentLang].delete}</button>
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

  if (res.genSettings) {
    document.getElementById('gen-show-ms').checked = res.genSettings?.showMS ?? true;
    document.getElementById('gen-show-gs').checked = res.genSettings?.showGS ?? true;
    document.getElementById('gen-show-tr').checked = res.genSettings?.showTR ?? true;
    document.getElementById('gen-show-cp').checked = res.genSettings.showCP ?? true;
    document.getElementById('gen-show-context').checked = res.genSettings.showContext !== false;

    document.getElementById('gen-font').value = res.genSettings.font || "'Rubik', sans-serif";
    document.getElementById('gen-use-custom-font').checked = !!res.genSettings.useCustomFont;
    document.getElementById('gen-custom-font-name').value = res.genSettings.customFontName || "";

    currentFontSize = res.genSettings.fontSize || 11;
    customLogo = res.genSettings.customLogo || "";
    if (customLogo) displayLogo.src = customLogo;
    document.getElementById('gen-font-size-val').innerText = currentFontSize;
    document.getElementById('gen-language').value = MS.SUPPORTED.includes(res.genSettings.language) ? res.genSettings.language : MS.defaultLang();

    // === НОВІ НАЛАШТУВАННЯ ЗАЖАТОЇ КЛАВІШІ ===
    document.getElementById('gen-require-hold-all').checked = res.genSettings?.requireHoldKeyAll ?? false;
    document.getElementById('gen-require-hold-list').checked = res.genSettings?.requireHoldKeyOnList ?? false;

    selectedHoldKey = res.genSettings?.holdKey || '';
    document.getElementById('current-hold-key').innerText = selectedHoldKey || t2('not_set');

    const sitesText = (res.genSettings?.holdKeySites || []).join('\n');
    document.getElementById('hold-key-sites').value = sitesText;

    updateHoldKeyVisibility();

    applyLanguage(MS.SUPPORTED.includes(res.genSettings.language) ? res.genSettings.language : MS.defaultLang());
  } else {
    const dl = MS.defaultLang();
    document.getElementById('gen-language').value = dl;
    applyLanguage(dl);
  }
});

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
  };
  
  document.addEventListener('keydown', keyHandler);
});

document.getElementById('font-inc').onclick = () => { 
  if(currentFontSize < 24) { 
    currentFontSize++; 
    document.getElementById('gen-font-size-val').innerText = currentFontSize; 
  } 
};

document.getElementById('font-dec').onclick = () => { 
  if(currentFontSize > 8) { 
    currentFontSize--; 
    document.getElementById('gen-font-size-val').innerText = currentFontSize; 
  } 
};

document.getElementById('buttons-list').onclick = (e) => {
  syncFromDom();
  const idx = parseInt(e.target.getAttribute('data-idx'));
  if (e.target.classList.contains('del-btn')) {
    if(confirm(translations[currentLang].confirm_delete)) { 
      userButtons.splice(idx, 1); 
      renderAll(); 
    }
  }
  if (e.target.classList.contains('btn-sort')) {
    const dir = e.target.getAttribute('data-dir');
    if (dir === 'up' && idx > 0) [userButtons[idx], userButtons[idx-1]] = [userButtons[idx-1], userButtons[idx]];
    else if (dir === 'down' && idx < userButtons.length - 1) [userButtons[idx], userButtons[idx+1]] = [userButtons[idx+1], userButtons[idx]];
    renderAll();
  }
};

document.getElementById('add-btn').onclick = () => { 
  syncFromDom();
  userButtons.push({name:'', url:'', sel:'', type:'large', color:'#383838', textColor:'#ffffff', active:true}); 
  renderAll(); 
};

document.getElementById('save-btn').onclick = () => {
  const updated = readCards();
  userButtons = updated; // keep memory in sync, otherwise the re-render below shows stale data

  const gen = {
    showMS: document.getElementById('gen-show-ms').checked,
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

  chrome.storage.local.set({ userButtons: updated, genSettings: gen }, () => {
    const btn = document.getElementById('save-btn');
    btn.innerText = translations[currentLang].saved || "ЗБЕРЕЖЕНО ✓";
    btn.style.background = '#00ff88';
    setTimeout(() => { 
      btn.innerText = translations[currentLang].save_settings_js || "ЗБЕРЕГТИ НАЛАШТУВАННЯ"; 
      btn.style.background = ''; 
    }, 2000);
    
    // the background script rebuilds the context menu itself via storage.onChanged
    applyLanguage(gen.language);
  });
};

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
      chrome.storage.local.set(config, () => location.reload());
    } catch (err) { 
      alert(translations[currentLang].file_error || "Помилка формату файлу."); 
    }
  };
  reader.readAsText(file);
};