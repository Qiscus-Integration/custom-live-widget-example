/**
 * cases.js
 * ========
 * Registry data untuk dashboard showcase kustomisasi widget.
 * Single source of truth: dipakai dashboard.js (render kartu/kategori)
 * dan config.js (resolve config aktual widget berdasarkan ?case=).
 * Harus di-load PALING AWAL, sebelum config.js.
 */

var CASE_CATEGORIES = [
  { id: "header-branding", label: "Header & Branding" },
  { id: "login-behavior", label: "Login Form Behavior" },
  { id: "chat-room-style", label: "Chat Room Styling" },
];

var CASES = [
  {
    id: "default",
    categoryId: "header-branding",
    label: "Default",
    tagline: "Widget apa adanya, tanpa kustomisasi",
    description: [
      "Widget Qiscus Omnichannel standar, tanpa override tampilan",
      "Form login pre-chat ditampilkan apa adanya (tidak di-bypass)",
      "Warna & layout header mengikuti default platform",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
    },
  },
  {
    id: "q1-title-button-color",
    categoryId: "header-branding",
    label: "Q1 · Warna Judul & Tombol Terpisah",
    tagline: "Judul #000000, tombol Start Chat #0043CE — tidak lagi satu warna",
    description: [
      "Default platform: warna teks judul header ikut warna tombol utama (satu setting warna di dashboard Qiscus)",
      "Dengan custom CSS, keduanya bisa diatur independen: judul memakai #000000, tombol memakai #0043CE",
      "Custom CSS dikirim ke iframe form login Qiscus via opsi widgetCustomCSS / postMessage — tanpa menyentuh internal widget",
    ],
    overrides: {
      loginHeader: {
        titleColor: "#000000",
        buttonColor: "#0043CE",
        allowLongTitle: false,
        bannerImageUrl: "",
        bannerAspectRatio: "2.5 / 1",
      },
      enableLoginBypass: false,
    },
    snippets: [
      {
        title: "Custom CSS — warna judul & tombol terpisah",
        code:
          "/* Judul header form login → hitam */\n" +
          ".qismo-login-form__header,\n" +
          ".qismo-login-form__header h3 {\n" +
          "  color: #000000 !important;\n" +
          "}\n\n" +
          "/* Tombol Start Chat → biru brand */\n" +
          ".qcw-cs-submit-form.qismo-login-btn {\n" +
          "  background-color: #0043CE !important;\n" +
          "}",
      },
      {
        title: "Cara mengirim custom CSS ke widget",
        code:
          "new Qismo(\"YOUR_APP_ID\", {\n" +
          "  options: {\n" +
          "    channel_id: YOUR_CHANNEL_ID,\n" +
          "    widgetCustomCSS: customCss, // string CSS di atas\n" +
          "  },\n" +
          "});\n\n" +
          "// Form login dirender di iframe terpisah — kirim CSS-nya juga ke sana:\n" +
          "var iframe = document.getElementById(\"qcw-login-form-iframe\");\n" +
          "iframe.contentWindow.postMessage(\n" +
          "  { event_name: \"custom-css\", css: customCss },\n" +
          "  \"*\"\n" +
          ");",
      },
    ],
  },
  {
    id: "q2-long-title",
    categoryId: "header-branding",
    label: "Q2 · Judul Header 35 Karakter",
    tagline: "Judul lebih panjang dari batas default 20 karakter, wrap rapi",
    description: [
      "Default platform: judul header form login dibatasi ±20 karakter (input di dashboard Qiscus)",
      "Custom CSS mengganti teks judul dengan versi panjang (demo ini 35 karakter) tanpa tergantung batas input dashboard",
      "Judul panjang tetap wrap rapi ke baris berikutnya, tidak terpotong/overflow",
    ],
    overrides: {
      loginHeader: {
        titleColor: "",
        buttonColor: "",
        allowLongTitle: true,
        titleOverrideText: "Chat dengan POEMS Support Sekarang!",
        bannerImageUrl: "",
        bannerAspectRatio: "2.5 / 1",
      },
      enableLoginBypass: false,
    },
    snippets: [
      {
        title: "Custom CSS — ganti judul dengan teks 35 karakter",
        code:
          "/* Sembunyikan teks judul bawaan (maks 20 char dari dashboard) */\n" +
          ".qismo-login-form__header h3 {\n" +
          "  font-size: 0 !important;\n" +
          "  line-height: 0 !important;\n" +
          "}\n\n" +
          "/* Render judul pengganti — bebas hingga 35 karakter */\n" +
          ".qismo-login-form__header h3::after {\n" +
          "  content: \"Chat dengan POEMS Support Sekarang!\";\n" +
          "  display: block;\n" +
          "  font-size: 22px;\n" +
          "  line-height: 1.35;\n" +
          "  font-weight: 700;\n" +
          "}",
      },
      {
        title: "Custom CSS — judul panjang wrap rapi",
        code:
          ".qismo-login-form__header,\n" +
          ".qismo-login-form__header h3 {\n" +
          "  white-space: normal !important;\n" +
          "  overflow-wrap: break-word !important;\n" +
          "  word-break: break-word !important;\n" +
          "}",
      },
    ],
  },
  {
    id: "q3-banner-header",
    categoryId: "header-branding",
    label: "Q3 · Banner Gambar di Header",
    tagline: "Gambar full-width menggantikan teks sapaan di layar login",
    description: [
      "Default platform: area konten header form login hanya mendukung teks",
      "Dengan custom CSS, teks sapaan bisa diganti banner gambar full-width",
      "Rekomendasi aset: rasio ~2.5:1, dimensi 1000×400 px (2× retina untuk lebar form ±424 px), format PNG/JPG/WebP, ukuran ≤ 200 KB",
    ],
    overrides: {
      loginHeader: {
        titleColor: "",
        buttonColor: "",
        allowLongTitle: false,
        bannerImageUrl: "https://picsum.photos/seed/poems-banner/1000/400",
        bannerAspectRatio: "2.5 / 1",
      },
      enableLoginBypass: false,
    },
    snippets: [
      {
        title: "Custom CSS — banner gambar menggantikan teks header",
        code:
          "/* Sembunyikan teks sapaan & logo default */\n" +
          ".qismo-login-form__header { display: none !important; }\n" +
          ".qcw-login-avatar img { display: none !important; }\n\n" +
          "/* Render banner full-width di area logo */\n" +
          ".qcw-login-avatar {\n" +
          "  width: 100% !important;\n" +
          "  height: auto !important;\n" +
          "  margin: 0 !important;\n" +
          "  display: block !important;\n" +
          "}\n" +
          ".qcw-login-avatar::after {\n" +
          "  content: \"\";\n" +
          "  display: block;\n" +
          "  width: 100%;\n" +
          "  aspect-ratio: 2.5 / 1;\n" +
          "  background-image: url('https://cdn.example.com/banner.webp');\n" +
          "  background-size: cover !important;\n" +
          "  background-position: center !important;\n" +
          "  border-radius: 12px !important;\n" +
          "}",
      },
      {
        title: "Rekomendasi aset banner",
        code:
          "Rasio     : 2.5 : 1 (mengikuti lebar area header form login)\n" +
          "Dimensi   : 1000 × 400 px (2× retina, form login ±424 px)\n" +
          "Format    : WebP (disarankan), PNG, atau JPG\n" +
          "Ukuran    : ≤ 200 KB agar load tetap cepat\n" +
          "Hosting   : URL publik HTTPS (CDN milik client)",
      },
    ],
  },
];

// ── Helper: resolve case dari id, fallback ke "default" ──────
function resolveCase(caseId) {
  var found = null;
  for (var i = 0; i < CASES.length; i++) {
    if (CASES[i].id === caseId) {
      found = CASES[i];
      break;
    }
  }
  if (!found) {
    if (caseId) {
      console.warn('[cases] unknown case id "' + caseId + '", falling back to default');
    }
    for (var j = 0; j < CASES.length; j++) {
      if (CASES[j].id === "default") {
        found = CASES[j];
        break;
      }
    }
  }
  return found;
}

// ── Helper: baca ?case= dari query string ────────────────────
function getCaseIdFromLocation(loc) {
  var search = (loc || window.location).search || "";
  var match = search.match(/[?&]case=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
