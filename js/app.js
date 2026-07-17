/**
 * app.js
 * ======
 * Logika aplikasi: render menu, kontrol panel, dan load Qiscus widget.
 * Bergantung pada config.js (harus di-load duluan).
 */

(function () {
  "use strict";

  // ── State ────────────────────────────────────────────────
  var state = {
    isChatOpen: false,
    hasActivatedChat: false,
  };

  // ── DOM references (diisi saat init) ─────────────────────
  var dom = {
    toggle: null,
    panel: null,
    closeBtn: null,
  };

  // ── MenuRenderer ─────────────────────────────────────────
  // Render menu items dari MENU_ITEMS config ke dalam panel.
  var MenuRenderer = {
    render: function (container) {
      MENU_ITEMS.forEach(function (item) {
        var el;

        if (item.type === "chat") {
          el = document.createElement("button");
          el.id = "ccm-chat";
          el.addEventListener("click", function () {
            QiscusLoader.openChat();
          });
        } else {
          el = document.createElement("a");
          el.href = item.href;
          if (item.external) {
            el.target = "_blank";
            el.rel = "noopener";
          }
        }

        el.className = "ccm-item";
        el.innerHTML =
          '<span class="ccm-badge">' +
          item.icon +
          "</span>" +
          '<span class="ccm-text">' +
          '<span class="ccm-title">' +
          item.title +
          "</span>" +
          '<span class="ccm-sub">' +
          item.subtitle +
          "</span>" +
          "</span>" +
          ICONS.chevron;

        container.appendChild(el);
      });
    },
  };

  // ── PanelController ──────────────────────────────────────
  // Toggle & close panel menu, click-outside handling.
  var PanelController = {
    open: function () {
      dom.panel.classList.add("open");
    },

    close: function () {
      dom.panel.classList.remove("open");
    },

    toggle: function () {
      if (state.isChatOpen || state.hasActivatedChat) {
        QiscusLoader.clickTrigger();
      } else {
        dom.panel.classList.toggle("open");
      }
    },

    bindEvents: function () {
      dom.toggle.addEventListener("click", PanelController.toggle);
      dom.closeBtn.addEventListener("click", PanelController.close);

      // Tutup panel saat klik di luar
      document.addEventListener("click", function (e) {
        if (
          !dom.panel.contains(e.target) &&
          !dom.toggle.contains(e.target)
        ) {
          PanelController.close();
        }
      });
    },
  };

  // ── AppIdGate ────────────────────────────────────────────
  // App ID Qiscus tidak di-hardcode di config.js — diminta dari user
  // yang memakai widget ini lewat popup saat pertama kali dibuka, lalu
  // disimpan di localStorage supaya kunjungan berikutnya langsung load.
  var AppIdGate = {
    STORAGE_KEY: "ccm-qiscus-app-id",

    get: function () {
      return localStorage.getItem(AppIdGate.STORAGE_KEY) || "";
    },

    save: function (appId) {
      localStorage.setItem(AppIdGate.STORAGE_KEY, appId);
    },

    clear: function () {
      localStorage.removeItem(AppIdGate.STORAGE_KEY);
    },

    prompt: function (onReady) {
      var overlay = document.getElementById("ccm-appid-modal");
      var form = document.getElementById("ccm-appid-form");
      var input = document.getElementById("ccm-appid-input");

      overlay.classList.add("open");
      input.value = AppIdGate.get();

      form.addEventListener("submit", function handler(e) {
        e.preventDefault();
        var value = input.value.trim();
        if (!value) return;

        AppIdGate.save(value);
        overlay.classList.remove("open");
        form.removeEventListener("submit", handler);
        onReady(value);
      });

      setTimeout(function () {
        input.focus();
      }, 50);
    },
  };

  // ── ErrorScreen ──────────────────────────────────────────
  // Halaman gagal-muat, tampil kalau SDK Qiscus gagal di-load atau
  // gagal di-init (mis. App ID salah, koneksi bermasalah).
  var ErrorScreen = {
    show: function () {
      document.getElementById("ccm-load-error").classList.add("open");
    },

    bindEvents: function () {
      document
        .getElementById("ccm-error-reload")
        .addEventListener("click", function () {
          window.location.reload();
        });

      document
        .getElementById("ccm-error-change-appid")
        .addEventListener("click", function () {
          AppIdGate.clear();
          window.location.reload();
        });
    },
  };

  // ── QiscusLoader ─────────────────────────────────────────
  // Bypass login, load script, dan kelola custom CSS.
  var QiscusLoader = {
    /**
     * Set localStorage untuk bypass login form.
     */
    setBypassLogin: function () {
      if (!ENABLE_LOGIN_BYPASS) {
        // Bersihkan sesi bypass lama (mis. dari case lain di dashboard
        // showcase) supaya case dengan bypass off selalu mulai bersih.
        localStorage.removeItem("qismo-widget");
        return;
      }

      var existing = localStorage.getItem("qismo-widget");
      if (!existing) {
        localStorage.setItem("qismo-widget", JSON.stringify(DEFAULT_USER));
      }
    },

    // Qiscus merender beberapa iframe terpisah tergantung tahap alur
    // chat: bubble teaser (qcw-welcome-iframe), form login pre-chat
    // (qcw-login-form-iframe), dan room chat setelah login (qcw-iframe).
    // Custom CSS dikirim ke qcw-iframe & qcw-login-form-iframe supaya
    // kustomisasi header form login (warna judul/tombol, banner) benar-
    // benar ke-apply. qcw-welcome-iframe SENGAJA tidak disertakan: ia
    // punya header default sendiri yang sudah kontras (putih/navy) dan
    // custom CSS header chat-room kita (gelap) malah bikin teksnya
    // ketimpa jadi gelap-di-atas-gelap kalau ikut dikirim ke situ.
    CUSTOM_CSS_TARGET_IFRAME_IDS: ["qcw-iframe", "qcw-login-form-iframe"],

    postCustomCSSTo: function (iframe) {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { event_name: "custom-css", css: WIDGET_CUSTOM_CSS },
          "*"
        );
      }
    },

    /**
     * Kirim custom CSS ke semua iframe Qiscus yang sudah ada saat ini.
     * Terus di-retry beberapa kali karena iframe-iframe ini muncul
     * bertahap (bubble teaser dulu, baru form login setelah diklik).
     */
    attachCustomCSS: function (attempt) {
      attempt = attempt || 0;

      QiscusLoader.CUSTOM_CSS_TARGET_IFRAME_IDS.forEach(function (id) {
        QiscusLoader.postCustomCSSTo(document.getElementById(id));
      });

      if (attempt < 8) {
        setTimeout(function () {
          QiscusLoader.attachCustomCSS(attempt + 1);
        }, 500);
      }
    },

    /**
     * Pantau iframe Qiscus yang baru ditambahkan ke DOM (mis. form
     * login yang baru muncul setelah user klik bubble teaser) dan
     * langsung kirim custom CSS begitu muncul — tidak bergantung pada
     * timing retry attachCustomCSS() semata.
     */
    observeNewIframes: function () {
      if (!window.MutationObserver) return;

      var targetIds = QiscusLoader.CUSTOM_CSS_TARGET_IFRAME_IDS;
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return;
            if (node.tagName === "IFRAME" && targetIds.indexOf(node.id) !== -1) {
              QiscusLoader.postCustomCSSTo(node);
            }
            if (node.querySelectorAll) {
              targetIds.forEach(function (id) {
                var nested = node.querySelector ? node.querySelector("iframe#" + id) : null;
                if (nested) QiscusLoader.postCustomCSSTo(nested);
              });
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    },

    /**
     * Klik trigger button bawaan Qiscus.
     */
    clickTrigger: function () {
      var btn = document.querySelector(".qcw-trigger-btn");
      if (btn) btn.click();
    },

    /**
     * Buka live chat: close menu, lalu tampilkan teaser Qiscus
     * (qcw-welcome-iframe) supaya user bisa klik tombol asli "Ask for
     * Questions" di dalamnya — itu satu-satunya yang benar-benar
     * membuka form login (mengklik .qcw-trigger-btn TIDAK membuka
     * apa-apa, sudah diverifikasi; trigger button itu cuma berguna
     * untuk minimize/maximize chat room yang SUDAH terbuka, lihat
     * PanelController.toggle di atas).
     */
    openChat: function () {
      state.hasActivatedChat = true;
      PanelController.close();
      document.body.classList.add("ccm-chat-active");
    },

    /**
     * Load Qiscus SDK script dan inisialisasi widget dengan App ID
     * yang diberikan (dari AppIdGate — localStorage atau popup).
     */
    loadScript: function (appId) {
      var options = Object.assign({}, QISCUS_OPTIONS, {
        widgetCustomCSS: WIDGET_CUSTOM_CSS,
      });

      var params = {
        options: options,
        onMaximize: function () {
          state.isChatOpen = true;
          QiscusLoader.attachCustomCSS();
        },
        onMinimize: function () {
          state.isChatOpen = false;
        },
      };

      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = QISCUS_SCRIPT_URL;
      script.async = true;
      script.onerror = function () {
        ErrorScreen.show();
      };
      script.onload = script.onreadystatechange = function () {
        try {
          new Qismo(appId, params);
          QiscusLoader.attachCustomCSS();
        } catch (err) {
          ErrorScreen.show();
        }
      };

      var firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    },
  };

  // ── Expose for backward compatibility ────────────────────
  // (kalau ada code lain yang mengakses window globals)
  window.isChatOpen = state.isChatOpen;
  window.hasActivatedChat = state.hasActivatedChat;
  window.attachQismoWidgetCustomCSS = QiscusLoader.attachCustomCSS;

  // ── Init ─────────────────────────────────────────────────
  function init() {
    dom.toggle = document.getElementById("ccm-toggle");
    dom.panel = document.getElementById("ccm-panel");
    dom.closeBtn = document.getElementById("ccm-close");

    // Render menu items
    var menuContainer = document.getElementById("ccm-list");
    MenuRenderer.render(menuContainer);

    // Bind panel events
    PanelController.bindEvents();
    ErrorScreen.bindEvents();

    // Setup Qiscus, lalu load — App ID diambil dari localStorage kalau
    // sudah pernah diisi, atau diminta dulu lewat popup.
    QiscusLoader.setBypassLogin();
    QiscusLoader.observeNewIframes();

    var existingAppId = AppIdGate.get();
    if (existingAppId) {
      QiscusLoader.loadScript(existingAppId);
    } else {
      AppIdGate.prompt(function (appId) {
        QiscusLoader.loadScript(appId);
      });
    }
  }

  // Jalankan saat DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
