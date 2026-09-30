/* Ghost Translator site — automatic language (pt / en) based on the visitor's browser.
   Falls back to English. Visitors can switch manually; the choice is remembered. */
(function () {
  var saved = null;
  try { saved = localStorage.getItem("gt_lang"); } catch (e) {}
  var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  var lang = (saved === "pt" || saved === "en")
    ? saved
    : (String(nav).toLowerCase().indexOf("pt") === 0 ? "pt" : "en");

  // Hide the blocks that are not in the active language
  var css = document.createElement("style");
  css.textContent =
    'html[lang^="pt"] [data-lang="en"], html:not([lang^="pt"]) [data-lang="pt"] { display: none !important; }' +
    '#gtLangSwitch { position: fixed; top: 12px; right: 12px; z-index: 1000; display: flex; gap: 4px; background: #17171f; border: 1px solid #27272a; border-radius: 8px; padding: 3px; }' +
    '#gtLangSwitch button { font: inherit; font-size: 12px; background: transparent; color: #a1a1aa; border: 0; border-radius: 6px; padding: 4px 9px; cursor: pointer; }' +
    '#gtLangSwitch button.on { background: #a855f7; color: #0f0f14; font-weight: 600; }';
  document.head.appendChild(css);

  function apply(l) {
    lang = l;
    document.documentElement.lang = (l === "pt") ? "pt-BR" : "en";
    var t = document.querySelector("title");
    if (t) {
      var v = t.getAttribute("data-" + l);
      if (v) document.title = v;
    }
    var btns = document.querySelectorAll("#gtLangSwitch button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].className = (btns[i].getAttribute("data-set") === l) ? "on" : "";
    }
  }

  // Helper used by page scripts: gtTr("texto pt", "english text")
  window.gtTr = function (pt, en) { return lang === "pt" ? pt : en; };

  apply(lang);

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.createElement("div");
    box.id = "gtLangSwitch";
    box.innerHTML = '<button type="button" data-set="pt">PT</button><button type="button" data-set="en">EN</button>';
    document.body.appendChild(box);
    box.addEventListener("click", function (ev) {
      var l = ev.target && ev.target.getAttribute && ev.target.getAttribute("data-set");
      if (!l) return;
      try { localStorage.setItem("gt_lang", l); } catch (e) {}
      apply(l);
    });
    apply(lang);
  });
})();
