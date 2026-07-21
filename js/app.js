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
    // "idle" | "loading" | "ready" | "failed" — status load SDK Qiscus,
    // dipakai supaya tombol chat/toggle tidak diam saja saat SDK gagal.
    sdkState: "idle",
    lastAppId: "",
    lastChannelId: "",
  };

  var SDK_LOAD_TIMEOUT_MS = 10000;
  // Setelah new Qismo() sukses tanpa exception, tunggu widget Qiscus
  // benar-benar menyuntikkan UI-nya (.qcw-trigger-btn / qcw-welcome-iframe)
  // sebelum menganggap sdkState "ready" — App ID/Channel ID salah tidak
  // melempar exception, backend cuma menolak secara async (404), jadi UI
  // Qiscus tidak pernah muncul.
  var READY_CHECK_TIMEOUT_MS = 8000;
  var QISCUS_READY_SELECTOR = ".qcw-trigger-btn, #qcw-welcome-iframe";

  /**
   * Ganti teks sementara pada elemen (mis. tombol) lalu kembalikan ke
   * teks semula setelah durasi tertentu — dipakai untuk feedback ringan
   * saat SDK masih loading/gagal, supaya tombol tidak terlihat mati.
   */
  function flashText(el, text, duration) {
    if (!el) return;
    var original = el.getAttribute("data-ccm-original-text");
    if (original === null) {
      original = el.textContent;
      el.setAttribute("data-ccm-original-text", original);
    }
    el.textContent = text;
    clearTimeout(el._ccmFlashTimeout);
    el._ccmFlashTimeout = setTimeout(function () {
      el.textContent = el.getAttribute("data-ccm-original-text");
    }, duration || 1800);
  }

  /**
   * Sama seperti flashText tapi untuk atribut (title/aria-label), dipakai
   * untuk tombol yang cuma berisi ikon (mis. #ccm-toggle).
   */
  function flashAttr(el, attr, text, duration) {
    if (!el) return;
    var key = "data-ccm-original-" + attr;
    var original = el.getAttribute(key);
    if (original === null) {
      original = el.getAttribute(attr) || "";
      el.setAttribute(key, original);
    }
    el.setAttribute(attr, text);
    clearTimeout(el._ccmFlashAttrTimeout);
    el._ccmFlashAttrTimeout = setTimeout(function () {
      el.setAttribute(attr, el.getAttribute(key));
    }, duration || 1800);
  }

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
        var clicked = QiscusLoader.clickTrigger();
        if (!clicked) {
          if (state.sdkState === "failed") {
            QiscusLoader.retry();
          }
          flashAttr(dom.toggle, "aria-label", "Menghubungkan...", 1800);
        }
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
  // App ID & Channel ID Qiscus tidak di-hardcode di config.js — diminta
  // dari user yang memakai widget ini lewat popup saat pertama kali
  // dibuka, lalu disimpan di localStorage supaya kunjungan berikutnya
  // langsung load.
  var AppIdGate = {
    APP_ID_KEY: "ccm-qiscus-app-id",
    CHANNEL_ID_KEY: "ccm-qiscus-channel-id",

    get: function () {
      return {
        appId: localStorage.getItem(AppIdGate.APP_ID_KEY) || "",
        channelId: localStorage.getItem(AppIdGate.CHANNEL_ID_KEY) || "",
      };
    },

    save: function (appId, channelId) {
      localStorage.setItem(AppIdGate.APP_ID_KEY, appId);
      localStorage.setItem(AppIdGate.CHANNEL_ID_KEY, channelId);
    },

    clear: function () {
      localStorage.removeItem(AppIdGate.APP_ID_KEY);
      localStorage.removeItem(AppIdGate.CHANNEL_ID_KEY);
    },

    prompt: function (onReady) {
      var overlay = document.getElementById("ccm-appid-modal");
      var form = document.getElementById("ccm-appid-form");
      var appIdInput = document.getElementById("ccm-appid-input");
      var channelIdInput = document.getElementById("ccm-channelid-input");
      var existing = AppIdGate.get();

      overlay.classList.add("open");
      appIdInput.value = existing.appId;
      channelIdInput.value = existing.channelId;

      var submitBtn = form.querySelector('[type="submit"]');

      form.addEventListener("submit", function handler(e) {
        e.preventDefault();
        var appId = appIdInput.value.trim();
        var channelId = channelIdInput.value.trim();
        if (!appId || !channelId) return;

        AppIdGate.save(appId, channelId);
        form.removeEventListener("submit", handler);

        if (submitBtn) {
          submitBtn.disabled = true;
          flashText(submitBtn, "Menghubungkan...", SDK_LOAD_TIMEOUT_MS + 2000);
        }

        onReady(appId, channelId, function (success) {
          if (submitBtn) submitBtn.disabled = false;
          overlay.classList.remove("open");
          // Kegagalan ditangani oleh ErrorScreen (dipicu dari loadScript),
          // modal tetap ditutup supaya tidak ada dua sumber pesan error.
        });
      });

      setTimeout(function () {
        appIdInput.focus();
      }, 50);
    },
  };

  // ── ErrorScreen ──────────────────────────────────────────
  // Halaman gagal-muat, tampil kalau SDK Qiscus gagal di-load atau
  // gagal di-init (mis. App ID salah, koneksi bermasalah).
  var ErrorScreen = {
    MESSAGES: {
      timeout:
        "Widget membutuhkan waktu terlalu lama untuk dimuat. Cek koneksi internet Anda dan coba lagi.",
      "script-error":
        "Gagal memuat widget chat. Cek koneksi internet Anda dan coba lagi.",
      "sdk-missing":
        "Widget chat gagal disiapkan dengan benar. Silakan muat ulang halaman.",
      "init-error":
        "Widget chat gagal diinisialisasi. Periksa kembali App ID & Channel ID Anda.",
      "backend-error":
        "Widget tidak merespons — App ID atau Channel ID kemungkinan salah atau tidak ditemukan di akun Qiscus Anda. Periksa kembali lalu coba lagi.",
    },

    show: function (reason) {
      var el = document.getElementById("ccm-load-error");
      var textEl = el.querySelector("p");
      if (textEl) {
        textEl.textContent =
          (reason && ErrorScreen.MESSAGES[reason]) ||
          ErrorScreen.MESSAGES["script-error"];
      }
      el.classList.add("open");
    },

    hide: function () {
      document.getElementById("ccm-load-error").classList.remove("open");
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
     * Klik trigger button bawaan Qiscus. Return true kalau tombolnya
     * ditemukan & berhasil diklik, false kalau tidak (supaya pemanggil
     * bisa kasih feedback, bukan diam saja).
     */
    clickTrigger: function () {
      var btn = document.querySelector(".qcw-trigger-btn");
      if (btn) {
        btn.click();
        return true;
      }
      return false;
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
      if (state.sdkState === "failed") {
        var chatTitle = document.querySelector("#ccm-chat .ccm-title");
        flashText(chatTitle, "Gagal memuat, coba lagi...", 2000);
        QiscusLoader.retry();
        return;
      }
      if (state.sdkState === "loading") {
        flashText(document.querySelector("#ccm-chat .ccm-title"), "Memuat...", 2000);
        return;
      }

      state.hasActivatedChat = true;
      PanelController.close();
      document.body.classList.add("ccm-chat-active");
    },

    /**
     * Load Qiscus SDK script dan inisialisasi widget dengan App ID +
     * Channel ID yang diberikan (dari AppIdGate — localStorage atau popup).
     * onResult(success) opsional, dipanggil sekali saat proses selesai
     * (sukses, gagal, atau timeout).
     */
    loadScript: function (appId, channelId, onResult) {
      state.sdkState = "loading";
      state.lastAppId = appId;
      state.lastChannelId = channelId;

      var options = Object.assign({}, QISCUS_OPTIONS, {
        channel_id: channelId,
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

      var settled = false;
      var readyObserver = null;
      var readyTimeoutId = null;

      function settle(success, reason) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        clearTimeout(readyTimeoutId);
        if (readyObserver) {
          readyObserver.disconnect();
          readyObserver = null;
        }
        if (success) {
          state.sdkState = "ready";
        } else {
          state.sdkState = "failed";
          ErrorScreen.show(reason);
        }
        if (onResult) onResult(success);
      }

      /**
       * new Qismo() sukses secara sinkron tidak berarti widget benar-benar
       * jalan — App ID/Channel ID yang ditolak backend (404) tidak pernah
       * melempar exception di sini. Tunggu bukti nyata: elemen UI Qiscus
       * (trigger button / teaser iframe) muncul di DOM.
       */
      function watchForReady() {
        if (document.querySelector(QISCUS_READY_SELECTOR)) {
          settle(true);
          return;
        }

        if (window.MutationObserver) {
          readyObserver = new MutationObserver(function () {
            if (document.querySelector(QISCUS_READY_SELECTOR)) {
              settle(true);
            }
          });
          readyObserver.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }

        readyTimeoutId = setTimeout(function () {
          settle(false, "backend-error");
        }, READY_CHECK_TIMEOUT_MS);
      }

      var timeoutId = setTimeout(function () {
        settle(false, "timeout");
      }, SDK_LOAD_TIMEOUT_MS);

      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = QISCUS_SCRIPT_URL;
      script.async = true;
      script.onerror = function () {
        settle(false, "script-error");
      };
      script.onload = script.onreadystatechange = function () {
        if (settled) return;
        if (typeof window.Qismo !== "function") {
          settle(false, "sdk-missing");
          return;
        }
        try {
          new Qismo(appId, params);
          QiscusLoader.attachCustomCSS();
          watchForReady();
        } catch (err) {
          settle(false, "init-error");
        }
      };

      var firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    },

    /**
     * Coba muat ulang SDK setelah kegagalan sebelumnya, pakai App ID /
     * Channel ID terakhir yang diketahui. Dijaga supaya tidak dobel
     * retry selagi masih loading.
     */
    retry: function () {
      if (state.sdkState === "loading") return;
      if (!state.lastAppId || !state.lastChannelId) return;
      ErrorScreen.hide();
      QiscusLoader.loadScript(state.lastAppId, state.lastChannelId);
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

    // Setup Qiscus, lalu load — App ID & Channel ID diambil dari
    // localStorage kalau sudah pernah diisi, atau diminta dulu lewat popup.
    QiscusLoader.setBypassLogin();
    QiscusLoader.observeNewIframes();

    var existing = AppIdGate.get();
    if (existing.appId && existing.channelId) {
      QiscusLoader.loadScript(existing.appId, existing.channelId);
    } else {
      AppIdGate.prompt(function (appId, channelId, onResult) {
        QiscusLoader.loadScript(appId, channelId, onResult);
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
