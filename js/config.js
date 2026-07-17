/**
 * config.js
 * =========
 * Semua data & konfigurasi terpusat di satu file.
 * Ubah menu, nomor WA, style widget — cukup edit di sini.
 */

// ── SVG icon paths (reusable) ──────────────────────────────
var ICONS = {
  chat:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
    "</svg>",

  whatsapp:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.23 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/>' +
    "</svg>",

  phone:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>' +
    "</svg>",

  mail:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="5" width="18" height="14" rx="2"/>' +
    '<path d="m3 7 9 6 9-6"/>' +
    "</svg>",

  chevron:
    '<svg class="ccm-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="m9 18 6-6-6-6"/>' +
    "</svg>",
};

// ── Menu items ─────────────────────────────────────────────
// type: "chat" → buka Qiscus widget | "link" → href biasa
var MENU_ITEMS = [
  {
    type: "chat",
    icon: ICONS.chat,
    title: "Live chat",
    subtitle: "Ngobrol langsung dengan tim kami",
  },
  {
    type: "link",
    icon: ICONS.whatsapp,
    title: "WhatsApp",
    subtitle: "+62 882-1372-3906",
    href: "https://wa.me/6288213723906",
    external: true,
  },
  {
    type: "link",
    icon: ICONS.phone,
    title: "Telepon",
    subtitle: "+65 6631 8454 · biaya operator berlaku",
    href: "tel:+6566318454",
    external: false,
  },
  {
    type: "link",
    icon: ICONS.mail,
    title: "Kirim pesan",
    subtitle: "Isi formulir, kami balas via email",
    href: "https://www.qiscus.com/contact",
    external: true,
  },
];

// ── Qiscus widget configuration ───────────────────────────
var QISCUS_APP_ID = "bbhhf-cyj6oquncbzcexl";
var QISCUS_SCRIPT_URL = "https://omnichannel.qiscus.com/js/qismo-v5.js";

var PRODUCT_CARD = {
  width: 280,
  imageHeight: 190,
};

var WIDGET_DESKTOP_SIZES = [520, 580];

// ── Case resolution ──────────────────────────────────────────
// Halaman ini bisa dibuka dengan ?case=<id> (lihat js/cases.js untuk
// daftar case & kategorinya). Dipakai oleh dashboard.html supaya
// widget iframe menampilkan konfigurasi berbeda per kartu "case"
// yang diklik. Tanpa query param atau id tidak dikenal → fallback ke
// case "default" (widget stock, tanpa override).
var ACTIVE_CASE = resolveCase(getCaseIdFromLocation());

// ── Bypass-login toggle ──────────────────────────────────────
// true  = skip form login, langsung masuk ke chat (pakai DEFAULT_USER)
// false = tampilkan form login Qiscus dulu sebelum chat
// Nilai ditentukan oleh case aktif (lihat js/cases.js).
var ENABLE_LOGIN_BYPASS = !!ACTIVE_CASE.overrides.enableLoginBypass;

// ── Default user for bypass-login ──────────────────────────
// GANTI secara DINAMIS dari data user Anda di production.
var DEFAULT_USER = {
  unique_id: "fikri@qiscus.com",
  display_name: "Fikri (Qiscus)",
  extra_fields: JSON.stringify([{ key: "company", value: "Qiscus" }]),
};

// ── Qiscus channel & extra fields ──────────────────────────
var QISCUS_OPTIONS = {
  channel_id: 134701,
  mobileBreakPoint: 400,
  widgetDesktopSizes: WIDGET_DESKTOP_SIZES,
  baseUrl: "https://omnichannel.qiscus.com",
  qismoIframeUrl: "https://omnichannel.qiscus.com",
  // Matikan auto-popup bawaan Qiscus (muncul sendiri 3 detik setelah
  // load). Teaser (dengan tombol "Ask for Questions" yang benar-benar
  // membuka form login) tetap ada, tapi kita yang kontrol kapan
  // muncul: hanya saat user klik "Live chat" di panel custom
  // (lihat QiscusLoader.openChat di js/app.js).
  welcomeMessageStatus: false,
  extra_fields: [
    {
      name: "company",
      placeholder: "Type your company name",
      visible: true,
    },
  ],
};


// ── Login screen (pre-chat form) customization ─────────────
// Kustomisasi header form login (warna judul/tombol terpisah, wrap
// teks judul lebih panjang, mode banner gambar) — ditentukan oleh
// case aktif (lihat js/cases.js, kategori "Header & Branding").
// Kalau case tidak override loginHeader (mis. case "default"),
// fallback ke nilai kosong supaya WIDGET_CUSTOM_CSS di bawah tidak
// menghasilkan rule apapun untuk header form login → tampilan stock.
var LOGIN_HEADER = ACTIVE_CASE.overrides.loginHeader || {
  titleColor: "",
  buttonColor: "",
  allowLongTitle: false,
  titleOverrideText: "",
  bannerImageUrl: "",
  bannerAspectRatio: "2.5 / 1",
};

// ── Custom CSS for Qiscus iframe ───────────────────────────
// Tiap fitur kustomisasi login form berdiri sendiri (Q1 warna,
// Q2 judul panjang, Q3 banner) — case bisa mengaktifkan salah satu
// tanpa menyeret yang lain.
var WIDGET_CUSTOM_CSS =
  ".qcw-header { background: #111827 !important; color: #fff !important; }" +
  (LOGIN_HEADER.titleColor
    ? /* Q1a — warna teks judul form login, terpisah dari tombol */
      " .qismo-login-form__header," +
      " .qismo-login-form__header h3" +
      " { color: " + LOGIN_HEADER.titleColor + " !important; }"
    : "") +
  (LOGIN_HEADER.buttonColor
    ? /* Q1b — warna tombol Start Chat, terpisah dari judul */
      " .qcw-cs-submit-form.qismo-login-btn" +
      " { background-color: " + LOGIN_HEADER.buttonColor + " !important; }"
    : "") +
  (LOGIN_HEADER.titleColor || LOGIN_HEADER.allowLongTitle
    ? /* Q2a — judul tetap rapi walau lebih panjang dari default 20 char */
      " .qismo-login-form__header," +
      " .qismo-login-form__header h3" +
      " { white-space: normal !important; overflow-wrap: break-word !important; word-break: break-word !important; }"
    : "") +
  (LOGIN_HEADER.titleOverrideText
    ? /* Q2b — ganti teks judul via CSS. Teks judul asli di-set dari
         dashboard Qiscus (dibatasi ±20 char) dan remote config-nya
         menimpa opsi lokal formGreet/formSecondGreet (diverifikasi
         dari source qismo-v5.js: e.variables di-apply SETELAH merge
         options), jadi satu-satunya jalur yang pasti menang adalah
         custom CSS: nolkan font judul asli, render pengganti via
         ::after content. */
      " .qismo-login-form__header h3" +
      " { font-size: 0 !important; line-height: 0 !important; }" +
      " .qismo-login-form__header h3::after" +
      " { content: \"" + LOGIN_HEADER.titleOverrideText + "\";" +
      "   display: block; font-size: 22px; line-height: 1.35;" +
      "   font-weight: 700; }"
    : "") +
  (LOGIN_HEADER.bannerImageUrl
    ? /* Mode banner: sembunyikan teks judul & logo default, tampilkan gambar */
      " .qismo-login-form__header { display: none !important; }" +
      " .qcw-login-avatar { width: 100% !important; height: auto !important;" +
      "   margin: 0 !important; display: block !important; }" +
      " .qcw-login-avatar img { display: none !important; }" +
      " .qcw-login-avatar::after { content: \"\"; display: block; width: 100%;" +
      "   aspect-ratio: " + LOGIN_HEADER.bannerAspectRatio + ";" +
      "   background-image: url('" + LOGIN_HEADER.bannerImageUrl + "');" +
      "   background-size: cover !important; background-position: center !important;" +
      "   border-radius: 12px !important; }"
    : "") +
  /* Background wrapper — putih */
  " .qcw-chat," +
  " .qcw-body," +
  " .qcw-content," +
  " .qcw-room-content," +
  " .qcw-room-container," +
  " .qcw-message-left," +
  " .qcw-message-container," +
  " .qcw-message-content," +
  " .qcw-comment," +
  " .qcw-comment-container," +
  " .qcw-comment__container," +
  " .qcw-comment-item," +
  " .comment__container," +
  " .comment-container," +
  " .comment__item," +
  " .comment__content," +
  " .comment__bubble," +
  " .comment__carousel," +
  " .comment__carousel-container," +
  " .comment__carousel--container," +
  " .qcw-bubble," +
  " .qismo-message-wrapper," +
  " .carousel," +
  " .carousel-wrapper," +
  " .carousel-container," +
  " .carousel-slider," +
  " .slick-list," +
  " .slick-track," +
  ' div[class*="message-left"],' +
  ' div[class*="comment-container"],' +
  ' div[class*="comment__container"],' +
  ' div[class*="comment__item"],' +
  ' div[class*="carousel-container"],' +
  ' div[class*="carousel__container"]' +
  " { background-color: #ffffff !important; background: #ffffff !important; }" +
  /* Hapus border/shadow wrapper abu-abu */
  " .qcw-message-left," +
  " .qcw-message-container," +
  " .qcw-message-content," +
  " .qcw-comment," +
  " .qcw-comment-container," +
  " .qcw-comment__container," +
  " .comment__container," +
  " .comment-container," +
  " .comment__item," +
  " .comment__content," +
  " .comment__carousel," +
  " .comment__carousel-container," +
  " .comment__carousel--container," +
  " .carousel-container" +
  " { border: none !important; box-shadow: none !important; }" +
  /* Kartu produk — putih */
  " .comment__card," +
  " .comment__card--wrapper," +
  " .comment__card--container," +
  " .comment__card--body," +
  ' div[class*="comment__card"]' +
  " { background-color: #ffffff !important; background: #ffffff !important; padding-bottom: 10px !important; }" +
  " .comment__card--container" +
  " { box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important; border: 1px solid #eef0f3 !important; }" +
  /* Ukuran card produk */
  " .comment__carousel .slick-slide," +
  " .comment__card," +
  " .comment__card--wrapper," +
  " .comment__card--container," +
  ' div[class*="comment__card--wrapper"],' +
  ' div[class*="comment__card--container"]' +
  " { width: " + PRODUCT_CARD.width + "px !important;" +
  "   min-width: " + PRODUCT_CARD.width + "px !important;" +
  "   max-width: " + PRODUCT_CARD.width + "px !important; }" +
  /* Card image */
  " .comment__card--image," +
  " .comment__card--img," +
  " .comment__card-image," +
  ' div[class*="comment__card"] img' +
  " { width: 100% !important;" +
  "   height: " + PRODUCT_CARD.imageHeight + "px !important;" +
  "   max-height: " + PRODUCT_CARD.imageHeight + "px !important;" +
  "   object-fit: contain !important; }" +
  /* Card title & description */
  " .comment__card--title," +
  " .comment__card-title," +
  ' div[class*="comment__card"][class*="title"]' +
  " { font-size: 14px !important; line-height: 1.4 !important; }" +
  " .comment__card--description," +
  " .comment__card-description," +
  ' div[class*="comment__card"][class*="description"]' +
  " { font-size: 13px !important; line-height: 1.55 !important; }" +
  /* Panah carousel */
  " .comment__carousel .slick-arrow," +
  " .carousel-container .slick-arrow," +
  " .slick-prev," +
  " .slick-next," +
  ' button[class*="slick-prev"],' +
  ' button[class*="slick-next"],' +
  ' button[class*="carousel"][class*="prev"],' +
  ' button[class*="carousel"][class*="next"]' +
  " { width: 44px !important; height: 44px !important;" +
  "   min-width: 44px !important; min-height: 44px !important;" +
  "   border-radius: 50% !important;" +
  "   background: #ffffff !important;" +
  "   box-shadow: 0 8px 24px rgba(17,24,39,0.16) !important;" +
  "   display: flex !important; align-items: center !important; justify-content: center !important;" +
  "   top: calc(" + PRODUCT_CARD.imageHeight + "px / 2) !important;" +
  "   transform: translateY(-50%) !important; z-index: 5 !important; }" +
  /* Arrow positions */
  " .comment__carousel .slick-prev," +
  " .carousel-container .slick-prev," +
  ' button[class*="slick-prev"],' +
  ' button[class*="carousel"][class*="prev"]' +
  " { left: 8px !important; }" +
  " .comment__carousel .slick-next," +
  " .carousel-container .slick-next," +
  ' button[class*="slick-next"],' +
  ' button[class*="carousel"][class*="next"]' +
  " { right: 8px !important; }" +
  /* Arrow icons */
  " .comment__carousel .slick-arrow:before," +
  " .carousel-container .slick-arrow:before," +
  " .slick-prev:before," +
  " .slick-next:before" +
  " { color: #111827 !important; font-size: 24px !important; line-height: 1 !important; opacity: 1 !important; }" +
  /* Mobile arrow size */
  " @media (max-width: 399px) {" +
  "   .comment__carousel .slick-arrow," +
  "   .carousel-container .slick-arrow," +
  "   .slick-prev," +
  "   .slick-next" +
  "   { width: 38px !important; height: 38px !important;" +
  "     min-width: 38px !important; min-height: 38px !important; }" +
  " }";
