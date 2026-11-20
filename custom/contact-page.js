/*
 * /contact — redesigned page: "the conversation starts here".
 * The original React form stays exactly where it is (so submitting still works);
 * this layer restyles the page and adds, in the left column:
 *   - a hero: "Contact" / "Let's talk." / "Tell us about your retail AI needs"
 *   - a live chat preview: the visitor's message bubble updates as they type (name,
 *     company, message); after a successful send (the form clears itself) an Agile
 *     reply bubble confirms it was received.
 * Inputs are only read, never written. Site font only; no orphan words.
 */
(function () {
  "use strict";
  let sec = null, host = null, chat = null, form = null, timer = 0;

  const html = () => `
    <div class="agct-hero">
      <span class="agct-kick">Contact</span>
      <h1 class="agct-h1">Let's <span>talk.</span></h1>
      <p class="agct-sub">Tell us about your retail AI needs</p>
    </div>
    <div class="agct-chat" aria-hidden="true">
      <div class="agct-chat-top"><i></i><b>Agile</b><em>online</em></div>
      <div class="agct-msg ai">Hi! Tell us about your retail AI needs.</div>
      <div class="agct-msg me empty"><span class="t">Your message will appear here as you type.</span><small class="who"></small></div>
      <div class="agct-typing"><i></i><i></i><i></i></div>
      <div class="agct-msg ai done"></div>
    </div>`;

  function glue(el) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    let seen = false;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const t = nodes[i].nodeValue, s = seen ? t : t.replace(/\s+$/, ""), k = s.lastIndexOf(" ");
      if (k >= 0 && (k > 0 || i > 0)) { nodes[i].nodeValue = t.slice(0, k) + " " + t.slice(k + 1); break; }
      if (s.trim()) seen = true;
    }
  }

  const val = (id) => { const el = form && form.querySelector("#" + id); return el ? el.value.trim() : ""; };

  function update(typing) {
    if (!chat) return;
    const name = val("name"), company = val("company"), msg = val("message");
    const me = chat.querySelector(".agct-msg.me"), t = me.querySelector(".t"), who = me.querySelector(".who");
    const has = !!(msg || name || company);
    me.classList.toggle("empty", !has);
    t.textContent = msg || (has ? "…" : "Your message will appear here as you type.");
    who.textContent = name ? `— ${name}${company ? ", " + company : ""}` : company ? `— ${company}` : "";
    chat.classList.toggle("typing", !!typing && has);
    if (typing) chat.classList.remove("sent");
  }

  function onSubmit() {
    const name = val("name");
    // The form clears itself only after a successful send; check shortly after submitting.
    let tries = 0;
    const check = () => {
      tries++;
      const cleared = !val("name") && !val("email") && !val("message");
      if (cleared) {
        const done = chat.querySelector(".agct-msg.done");
        done.textContent = `Thanks${name ? ", " + name : ""}. Your message was received.`;
        chat.classList.remove("typing");
        chat.classList.add("sent");
      } else if (tries < 20) setTimeout(check, 400);
    };
    setTimeout(check, 600);
  }

  function mount(s) {
    sec = s;
    sec.setAttribute("data-agct", "");
    const grid = sec.querySelector(".grid");
    const left = grid && grid.children[0];
    form = sec.querySelector("form");
    if (!left || !form) return;
    host = document.createElement("div");
    host.id = "ag-contact";
    host.innerHTML = html();
    left.insertBefore(host, left.firstChild);
    chat = host.querySelector(".agct-chat");
    host.querySelectorAll(".agct-h1, .agct-sub").forEach(glue);
    form.addEventListener("input", () => { update(true); clearTimeout(timer); timer = setTimeout(() => chat && chat.classList.remove("typing"), 1200); });
    form.addEventListener("submit", onSubmit);
    update(false);
    // start the entrance (rAF for smoothness; timer so content can never stay hidden)
    const go = () => sec && sec.classList.add("agct-in");
    requestAnimationFrame(go);
    setTimeout(go, 80);
  }

  function ensure() {
    if (location.pathname !== "/contact") { sec = host = chat = form = null; return; }
    if (host && host.isConnected) return;
    const s = [...document.querySelectorAll("main section")].find((x) => x.querySelector("form #message"));
    if (s) mount(s);
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(ensure, 40); }).observe(document.documentElement, { childList: true, subtree: true });
  ensure();
})();
