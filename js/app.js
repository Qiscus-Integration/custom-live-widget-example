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

    /**
     * Kirim custom CSS ke iframe Qiscus via postMessage.
     */
    attachCustomCSS: function (attempt) {
      attempt = attempt || 0;
      var iframe = document.getElementById("qcw-iframe");

      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { event_name: "custom-css", css: WIDGET_CUSTOM_CSS },
          "*"
        );
        return;
      }

      if (attempt < 8) {
        setTimeout(function () {
          QiscusLoader.attachCustomCSS(attempt + 1);
        }, 500);
      }
    },

    /**
     * Klik trigger button bawaan Qiscus.
     */
    clickTrigger: function () {
      var btn = document.querySelector(".qcw-trigger-btn");
      if (btn) btn.click();
    },

    /**
     * Buka live chat: close menu → klik trigger Qiscus.
     */
    openChat: function () {
      state.hasActivatedChat = true;
      PanelController.close();

      var btn = document.querySelector(".qcw-trigger-btn");
      if (btn) {
        btn.click();
      } else {
        console.warn("[Qiscus] trigger button belum siap, retry...");
        setTimeout(function () {
          var b = document.querySelector(".qcw-trigger-btn");
          if (b) b.click();
        }, 800);
      }
    },

    /**
     * Load Qiscus SDK script dan inisialisasi widget.
     */
    loadScript: function () {
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
      script.onload = script.onreadystatechange = function () {
        new Qismo(QISCUS_APP_ID, params);
        QiscusLoader.attachCustomCSS();
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

    // Setup & load Qiscus
    QiscusLoader.setBypassLogin();
    QiscusLoader.loadScript();
  }

  // Jalankan saat DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
