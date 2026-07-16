/**
 * dashboard.js
 * ============
 * Logika halaman showcase: render kartu case per kategori (dari
 * js/cases.js), handle klik → update panel deskripsi + reload
 * iframe preview (index.html?case=<id>) supaya widget Qiscus asli
 * benar-benar reinit dengan config case yang dipilih.
 * Bergantung pada js/cases.js (harus di-load duluan).
 */

(function () {
  "use strict";

  var dom = {
    picker: null,
    description: null,
    iframe: null,
    overlay: null,
  };

  var activeCaseId = "default";

  // ── Render ───────────────────────────────────────────────
  function renderPicker() {
    dom.picker.innerHTML = "";

    CASE_CATEGORIES.forEach(function (category) {
      var casesInCategory = CASES.filter(function (c) {
        return c.categoryId === category.id;
      });

      var section = document.createElement("div");
      section.className = "dash-category";

      var label = document.createElement("div");
      label.className = "dash-category-label";
      label.textContent = category.label;
      section.appendChild(label);

      if (casesInCategory.length === 0) {
        var empty = document.createElement("div");
        empty.className = "dash-card is-empty";
        empty.innerHTML =
          '<div class="dash-card-title">Segera hadir</div>' +
          '<div class="dash-card-tagline">Belum ada contoh case untuk kategori ini</div>';
        section.appendChild(empty);
      } else {
        casesInCategory.forEach(function (c) {
          var card = document.createElement("button");
          card.type = "button";
          card.className = "dash-card";
          card.dataset.caseId = c.id;
          card.innerHTML =
            '<div class="dash-card-title">' + c.label + "</div>" +
            '<div class="dash-card-tagline">' + c.tagline + "</div>";
          card.addEventListener("click", function () {
            selectCase(c.id, true);
          });
          section.appendChild(card);
        });
      }

      dom.picker.appendChild(section);
    });
  }

  function renderDescription(caseObj) {
    var bullets = caseObj.description
      .map(function (line) {
        return "<li>" + line + "</li>";
      })
      .join("");

    dom.description.innerHTML =
      "<h2>" + caseObj.label + "</h2><ul>" + bullets + "</ul>";
  }

  function updateActiveCard() {
    var cards = dom.picker.querySelectorAll(".dash-card[data-case-id]");
    cards.forEach(function (card) {
      card.classList.toggle("is-active", card.dataset.caseId === activeCaseId);
    });
  }

  // ── Iframe preview ───────────────────────────────────────
  function loadPreview(caseId) {
    dom.overlay.classList.add("is-visible");
    dom.iframe.src = "index.html?case=" + encodeURIComponent(caseId);
  }

  // ── Selection + URL sync ─────────────────────────────────
  function selectCase(caseId, updateUrl) {
    var caseObj = resolveCase(caseId);
    activeCaseId = caseObj.id;

    renderDescription(caseObj);
    updateActiveCard();
    loadPreview(caseObj.id);

    if (updateUrl && history.replaceState) {
      var url = window.location.pathname + "?case=" + encodeURIComponent(caseObj.id);
      history.replaceState(null, "", url);
    }
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    dom.picker = document.getElementById("dash-picker");
    dom.description = document.getElementById("dash-description");
    dom.iframe = document.getElementById("dash-preview-iframe");
    dom.overlay = document.getElementById("dash-preview-overlay");

    dom.iframe.addEventListener("load", function () {
      dom.overlay.classList.remove("is-visible");
    });

    renderPicker();

    var initialCaseId = getCaseIdFromLocation();
    selectCase(initialCaseId, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
