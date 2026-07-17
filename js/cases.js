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

  // ══ Login Form Behavior ══════════════════════════════════════
  {
    id: "q4-bypass-login",
    categoryId: "login-behavior",
    label: "Q4 · Bypass Form Login",
    tagline: "User yang sudah login di website langsung masuk chat, tanpa isi form",
    description: [
      "Default platform: setiap user harus mengisi form login pre-chat (nama, email) sebelum bisa chat",
      "Kalau user sudah login di website client, datanya bisa dipakai langsung — form login di-skip total",
      "Caranya: set localStorage key \"qismo-widget\" berisi data user SEBELUM Qismo di-init",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: true,
    },
    snippets: [
      {
        title: "Bypass login — isi localStorage sebelum init Qismo",
        code:
          "// Ambil data user dari sesi login website Anda (dinamis!)\n" +
          "var loggedInUser = {\n" +
          "  unique_id: \"budi@perusahaan.com\",   // wajib unik per user\n" +
          "  display_name: \"Budi Santoso\",\n" +
          "  extra_fields: JSON.stringify([\n" +
          "    { key: \"company\", value: \"PT Maju Jaya\" },\n" +
          "  ]),\n" +
          "};\n\n" +
          "// HARUS dipanggil SEBELUM new Qismo(...)\n" +
          "if (!localStorage.getItem(\"qismo-widget\")) {\n" +
          "  localStorage.setItem(\"qismo-widget\", JSON.stringify(loggedInUser));\n" +
          "}\n\n" +
          "new Qismo(\"YOUR_APP_ID\", { options: { channel_id: YOUR_CHANNEL_ID } });",
      },
      {
        title: "Bersihkan sesi saat user logout dari website",
        code:
          "// Panggil di handler logout website Anda, supaya user berikutnya\n" +
          "// tidak mewarisi sesi chat user sebelumnya.\n" +
          "localStorage.removeItem(\"qismo-widget\");",
      },
    ],
  },
  {
    id: "q5-extra-fields",
    categoryId: "login-behavior",
    label: "Q5 · Field Tambahan di Form Login",
    tagline: "Tambah field custom (mis. Nomor Order) di form pre-chat",
    description: [
      "Default platform: form login hanya berisi nama & email",
      "Lewat opsi extra_fields, form bisa ditambah field custom — mis. nama perusahaan dan nomor order",
      "Isian field ini ikut terkirim sebagai info customer, terlihat agent di dashboard Omnichannel",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      qiscusOptions: {
        extra_fields: [
          {
            name: "company",
            placeholder: "Nama perusahaan Anda",
            visible: true,
          },
          {
            name: "order_number",
            placeholder: "Nomor order (jika ada)",
            visible: true,
          },
        ],
      },
    },
    snippets: [
      {
        title: "Konfigurasi extra_fields di options Qismo",
        code:
          "new Qismo(\"YOUR_APP_ID\", {\n" +
          "  options: {\n" +
          "    channel_id: YOUR_CHANNEL_ID,\n" +
          "    extra_fields: [\n" +
          "      {\n" +
          "        name: \"company\",\n" +
          "        placeholder: \"Nama perusahaan Anda\",\n" +
          "        visible: true,\n" +
          "      },\n" +
          "      {\n" +
          "        name: \"order_number\",\n" +
          "        placeholder: \"Nomor order (jika ada)\",\n" +
          "        visible: true,\n" +
          "      },\n" +
          "    ],\n" +
          "  },\n" +
          "});",
      },
    ],
  },
  {
    id: "q6-button-text",
    categoryId: "login-behavior",
    label: "Q6 · Ganti Teks Tombol Start Chat",
    tagline: "Label tombol jadi CTA brand sendiri, mis. \"Mulai Konsultasi\"",
    description: [
      "Default platform: teks tombol submit form login adalah \"Start Chat\" dan tidak ada setting untuk mengubahnya",
      "Dengan custom CSS, teks aslinya di-nolkan lalu diganti via ::after content — pola yang sama dengan override judul (Q2)",
      "Cocok untuk lokalisasi bahasa atau CTA yang lebih sesuai funnel client",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      extraCss:
        ".qcw-cs-submit-form.qismo-login-btn" +
        " { font-size: 0 !important; line-height: 0 !important; }" +
        " .qcw-cs-submit-form.qismo-login-btn::after" +
        " { content: \"Mulai Konsultasi\"; display: block;" +
        "   font-size: 15px; line-height: 1.4; font-weight: 600; }",
    },
    snippets: [
      {
        title: "Custom CSS — ganti label tombol Start Chat",
        code:
          "/* Nolkan teks asli \"Start Chat\" */\n" +
          ".qcw-cs-submit-form.qismo-login-btn {\n" +
          "  font-size: 0 !important;\n" +
          "  line-height: 0 !important;\n" +
          "}\n\n" +
          "/* Render label pengganti */\n" +
          ".qcw-cs-submit-form.qismo-login-btn::after {\n" +
          "  content: \"Mulai Konsultasi\";\n" +
          "  display: block;\n" +
          "  font-size: 15px;\n" +
          "  line-height: 1.4;\n" +
          "  font-weight: 600;\n" +
          "}",
      },
    ],
  },
  {
    id: "q7-input-styling",
    categoryId: "login-behavior",
    label: "Q7 · Styling Input Form Login",
    tagline: "Input rounded + border warna brand saat focus",
    description: [
      "Default platform: tampilan input form login mengikuti style bawaan, tidak bisa diubah dari dashboard",
      "Dengan custom CSS, border-radius, warna border saat focus, dan warna placeholder bisa disesuaikan brand",
      "Custom CSS dikirim ke iframe form login (qcw-login-form-iframe) via postMessage, sama seperti case lain",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      extraCss:
        ".qismo-login-form input[type=\"text\"]," +
        " .qismo-login-form input[type=\"email\"]," +
        " .qismo-login-form input" +
        " { border-radius: 10px !important; border: 1.5px solid #d6dbe4 !important;" +
        "   padding: 10px 14px !important; transition: border-color .15s ease; }" +
        " .qismo-login-form input:focus" +
        " { border-color: #0043CE !important; outline: none !important;" +
        "   box-shadow: 0 0 0 3px rgba(0,67,206,0.12) !important; }" +
        " .qismo-login-form input::placeholder" +
        " { color: #9aa3b2 !important; }",
    },
    snippets: [
      {
        title: "Custom CSS — input rounded + focus warna brand",
        code:
          ".qismo-login-form input {\n" +
          "  border-radius: 10px !important;\n" +
          "  border: 1.5px solid #d6dbe4 !important;\n" +
          "  padding: 10px 14px !important;\n" +
          "  transition: border-color .15s ease;\n" +
          "}\n\n" +
          ".qismo-login-form input:focus {\n" +
          "  border-color: #0043CE !important;\n" +
          "  outline: none !important;\n" +
          "  box-shadow: 0 0 0 3px rgba(0, 67, 206, 0.12) !important;\n" +
          "}\n\n" +
          ".qismo-login-form input::placeholder {\n" +
          "  color: #9aa3b2 !important;\n" +
          "}",
      },
    ],
  },

  // ══ Chat Room Styling ════════════════════════════════════════
  {
    id: "q8-header-color",
    categoryId: "chat-room-style",
    label: "Q8 · Warna Header Chat Room",
    tagline: "Header room memakai warna brand #0043CE, bukan default",
    description: [
      "Default platform: warna header chat room mengikuti satu setting warna global di dashboard Qiscus",
      "Dengan custom CSS, header room bisa dipaksa memakai warna brand yang presisi (demo ini #0043CE, teks putih)",
      "Berlaku juga untuk nama channel & subteks di dalam header",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      extraCss:
        ".qcw-header" +
        " { background: #0043CE !important; color: #ffffff !important; }" +
        " .qcw-header *" +
        " { color: #ffffff !important; }",
    },
    snippets: [
      {
        title: "Custom CSS — header chat room warna brand",
        code:
          ".qcw-header {\n" +
          "  background: #0043CE !important;\n" +
          "  color: #ffffff !important;\n" +
          "}\n\n" +
          "/* Nama channel & subteks di header ikut putih */\n" +
          ".qcw-header * {\n" +
          "  color: #ffffff !important;\n" +
          "}",
      },
    ],
  },
  {
    id: "q9-bubble-colors",
    categoryId: "chat-room-style",
    label: "Q9 · Warna Bubble Chat",
    tagline: "Bubble customer biru brand, bubble agent abu muda",
    description: [
      "Default platform: warna bubble chat mengikuti tema bawaan, tidak ada setting terpisah customer vs agent",
      "Dengan custom CSS, bubble pesan customer (kanan) dan agent (kiri) bisa diberi warna berbeda",
      "Demo ini: customer #0043CE teks putih, agent #f1f3f7 teks gelap",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      extraCss:
        ".qcw-comment--me .qcw-comment__message," +
        " .comment--me .comment__bubble," +
        " div[class*=\"comment--me\"] div[class*=\"bubble\"]" +
        " { background: #0043CE !important; color: #ffffff !important; }" +
        " .qcw-comment--other .qcw-comment__message," +
        " .comment--other .comment__bubble," +
        " div[class*=\"comment--other\"] div[class*=\"bubble\"]" +
        " { background: #f1f3f7 !important; color: #1f2733 !important; }",
    },
    snippets: [
      {
        title: "Custom CSS — bubble customer vs agent beda warna",
        code:
          "/* Bubble pesan customer (sisi kanan) */\n" +
          ".qcw-comment--me .qcw-comment__message {\n" +
          "  background: #0043CE !important;\n" +
          "  color: #ffffff !important;\n" +
          "}\n\n" +
          "/* Bubble pesan agent (sisi kiri) */\n" +
          ".qcw-comment--other .qcw-comment__message {\n" +
          "  background: #f1f3f7 !important;\n" +
          "  color: #1f2733 !important;\n" +
          "}",
      },
    ],
  },
  {
    id: "q10-custom-font",
    categoryId: "chat-room-style",
    label: "Q10 · Custom Font Chat Room",
    tagline: "Seluruh chat room memakai font brand, bukan font default",
    description: [
      "Default platform: font widget mengikuti bawaan, tidak ada setting font di dashboard",
      "Dengan custom CSS, font-family seluruh chat room bisa diganti mengikuti font brand client",
      "Untuk webfont (mis. Google Fonts), @import harus diletakkan di BARIS PERTAMA string CSS — kalau tidak, browser mengabaikannya",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      extraCss:
        ".qcw-container, .qcw-container *," +
        " .qismo-login-form, .qismo-login-form *, body" +
        " { font-family: Georgia, \"Times New Roman\", serif !important; }",
    },
    snippets: [
      {
        title: "Custom CSS — ganti font seluruh widget (Google Fonts)",
        code:
          "/* @import WAJIB di baris paling atas string CSS */\n" +
          "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');\n\n" +
          "body,\n" +
          ".qcw-container,\n" +
          ".qcw-container *,\n" +
          ".qismo-login-form,\n" +
          ".qismo-login-form * {\n" +
          "  font-family: 'Plus Jakarta Sans', sans-serif !important;\n" +
          "}",
      },
      {
        title: "Catatan penggunaan",
        code:
          "• @import harus jadi rule PERTAMA di string widgetCustomCSS,\n" +
          "  sebelum rule CSS lain — kalau tidak, font tidak akan ter-load.\n" +
          "• Demo di preview ini memakai font sistem (Georgia) supaya\n" +
          "  perubahan langsung terlihat tanpa request eksternal.\n" +
          "• Alternatif tanpa @import: @font-face dengan file WOFF2 di CDN\n" +
          "  milik client (boleh diletakkan di posisi mana pun).",
      },
    ],
  },
  {
    id: "q11-hide-powered-by",
    categoryId: "chat-room-style",
    label: "Q11 · Sembunyikan \"Powered by Qiscus\"",
    tagline: "Footer branding disembunyikan agar widget tampil full white-label",
    description: [
      "Default platform: chat room menampilkan footer \"Powered by Qiscus\" di bagian bawah",
      "Dengan custom CSS satu rule display:none, footer branding disembunyikan untuk tampilan white-label",
      "Catatan: pastikan white-label sesuai ketentuan paket/lisensi Qiscus yang dipakai client",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      extraCss:
        ".qcw-powered-by," +
        " .qismo-powered-by," +
        " div[class*=\"powered\"]," +
        " a[href*=\"qiscus.com\"][class*=\"powered\"]" +
        " { display: none !important; }",
    },
    snippets: [
      {
        title: "Custom CSS — sembunyikan footer Powered by Qiscus",
        code:
          ".qcw-powered-by,\n" +
          ".qismo-powered-by,\n" +
          "div[class*=\"powered\"] {\n" +
          "  display: none !important;\n" +
          "}",
      },
    ],
  },
  {
    id: "q12-widget-size",
    categoryId: "chat-room-style",
    label: "Q12 · Ukuran & Breakpoint Widget",
    tagline: "Widget desktop lebih tinggi (640/700px), mode mobile mulai 480px",
    description: [
      "Default platform: tinggi widget desktop dan breakpoint mobile memakai nilai bawaan SDK",
      "Lewat opsi widgetDesktopSizes, tinggi chat room desktop bisa diatur (demo ini 640px, membesar ke 700px saat viewport tinggi)",
      "Opsi mobileBreakPoint menentukan lebar layar maksimum saat widget beralih ke tampilan fullscreen mobile (demo ini 480px)",
    ],
    overrides: {
      loginHeader: null,
      enableLoginBypass: false,
      qiscusOptions: {
        widgetDesktopSizes: [640, 700],
        mobileBreakPoint: 480,
      },
    },
    snippets: [
      {
        title: "Konfigurasi ukuran & breakpoint di options Qismo",
        code:
          "new Qismo(\"YOUR_APP_ID\", {\n" +
          "  options: {\n" +
          "    channel_id: YOUR_CHANNEL_ID,\n\n" +
          "    // Tinggi widget di desktop: [normal, saat viewport tinggi]\n" +
          "    widgetDesktopSizes: [640, 700],\n\n" +
          "    // Layar ≤ 480px → widget tampil fullscreen ala mobile\n" +
          "    mobileBreakPoint: 480,\n" +
          "  },\n" +
          "});",
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
