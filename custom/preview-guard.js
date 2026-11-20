/*
 * Preview build only (not part of the real site): the contact form must not reach the
 * live system from a shared preview link. Blocks the form submit and any request to the
 * contact table / email function, and tells the visitor.
 */
(function () {
  "use strict";
  var BLOCK = /supabase\.co\/(rest\/v1\/contact_submissions|functions\/v1\/send-contact-email)/;
  var origFetch = window.fetch;
  window.fetch = function (input) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    if (BLOCK.test(url)) return Promise.reject(new Error("Preview only: contact form is disabled"));
    return origFetch.apply(this, arguments);
  };
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, url) {
    if (BLOCK.test(String(url))) throw new Error("Preview only: contact form is disabled");
    return origOpen.apply(this, arguments);
  };
  function toast() {
    var t = document.getElementById("preview-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "preview-toast";
      t.setAttribute("role", "status");
      t.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:10001;background:#1f232b;color:#fff;padding:14px 20px;border-radius:12px;font:600 15px Inter,sans-serif;box-shadow:0 20px 40px -12px rgba(0,0,0,.5);max-width:calc(100vw - 32px);text-align:center";
      document.body.appendChild(t);
    }
    t.textContent = "Preview only: this message was not sent.";
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.style.opacity = "0"; }, 3500);
  }
  window.addEventListener("submit", function (e) {
    var f = e.target;
    if (f && f.querySelector && f.querySelector("#message")) {
      e.preventDefault();
      e.stopPropagation();
      toast();
    }
  }, true);
})();
