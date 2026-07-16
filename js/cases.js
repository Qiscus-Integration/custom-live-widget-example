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
    id: "login-header-branding-v1",
    categoryId: "header-branding",
    label: "Personalisasi Warna Header & Banner Login",
    tagline: "Warna judul & tombol independen, dukungan banner gambar",
    description: [
      "Warna teks judul header diatur terpisah dari warna tombol Start Chat (defaultnya keduanya ikut satu setting warna di dashboard)",
      "Judul header yang lebih panjang tetap wrap rapi, tidak terpotong/overflow",
      "Opsi banner gambar full-width menggantikan teks sapaan di layar login (rasio rekomendasi ~2.5:1)",
    ],
    overrides: {
      loginHeader: {
        titleColor: "#000000",
        buttonColor: "#0043CE",
        bannerImageUrl: "",
        bannerAspectRatio: "2.5 / 1",
      },
      enableLoginBypass: false,
    },
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
