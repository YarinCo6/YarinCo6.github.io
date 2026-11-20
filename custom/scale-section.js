/*
 * "Smarter Retail at Scale" section — chosen redesign: "Live Assist".
 * A sticky tablet plays an AI-assisted sale as the visitor scrolls; the Key Benefits
 * light up step by step. Long copy lives behind "Learn more" dropdowns.
 * Local prototype layered on top of the compiled Lovable build: it hides the original
 * section on the home page and renders this one in its place.
 * When the Lovable source is available, port this into a React component (see CHANGES.md).
 * (The other 9 explored variants are in git history: commit 27270ea.)
 */
(function () {
  "use strict";

  // ---------- content (taken from the original section) ----------
  const C = {
    title: "Smarter Retail at Scale",
    subT: "A top-tier sales team as your standard",
    sub: "Experience increased sales with a top-tier sales team as your standard. Data-driven decisions, delivered every time.",
    empowerT: "Empower in store sales team",
    empower: "Rapidly elevate every sales team member to top-tier performance. AI assistants deliver intelligent product recommendations, deep insights, upsell and cross-sell opportunities, real-time product information, comparisons, pricing, availability, and beyond.",
    platformT: "AI-powered platform for retail chains",
    platform: "An AI-powered platform for retail chains, delivering digital agents that enhance sales, boost conversion rates, and elevate the customer experience across every touchpoint, online & offline.",
  };
  const B = [
    { t: "Increase Sales", i: "up" },
    { t: "Improved conversion across channels", i: "funnel" },
    { t: "Enhance customer experience", i: "smile" },
    { t: "Reduce returns", i: "undo" },
    { t: "Unified standard top tier experts", i: "award" },
    { t: "Generate data rich offline and online", i: "db" },
  ];
  const ICONS = {
    up: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    funnel: '<path d="M3 4h18l-7 8.5V18l-4 2v-7.5z"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
  };
  const icon = (k) =>
    `<svg class="ag-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));

  const accItem = (t, body) =>
    `<div class="ag-acc-item"><button class="ag-acc-btn" type="button" aria-expanded="false"><span>${t}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="ag-acc-panel"><div><p>${body}</p></div></div></div>`;

  const html = () => `<section class="ag-sec ag-v1">
    <div class="ag-track"><div class="ag-sticky"><div class="ag-wrap ag-v1-grid">
      <div class="ag-v1-left">
        <span class="ag-eyebrow">Agile platform</span>
        <h2 class="ag-h2">Smarter Retail at <span class="ag-g">Scale</span></h2>
        <p class="ag-kicker">Scroll to watch an associate close a sale with Agile.</p>
        <ul class="ag-v1-list">${B.map((b) => `<li>${icon(b.i)}<span>${b.t}</span></li>`).join("")}</ul>
      </div>
      <div class="ag-v1-device"><div class="ag-v1-screen">
        <div class="ag-v1-top"><span class="ag-live"></span><b>Agile Assist</b><em>Store #12 · Electronics</em></div>
        <div class="ag-v1-chat"><div class="ag-v1-feed">
          <div class="ag-msg me" data-s="0">Customer needs a laptop for video editing, budget around $1,500.</div>
          <div class="ag-msg ai" data-s="1"><div class="ag-prod"><i></i><div><b>Creator Pro 15</b><small>Best match · 32GB RAM · RTX graphics</small></div><strong>$1,449</strong></div></div>
          <div class="ag-msg ai" data-s="2">Compared 3 models: renders 22% faster than the next option. Plain-language summary ready to share.</div>
          <div class="ag-msg ai" data-s="3">Skip the Slim 14 for this customer: high return rate for heavy editing.</div>
          <div class="ag-msg ai" data-s="4"><b>Upsell:</b> 1TB SSD + 3-year care plan <span class="ag-pill">+$189</span></div>
          <div class="ag-msg ai" data-s="5">In stock: 4 units · Aisle 7. Or ship to home tomorrow.</div>
          <div class="ag-msg ok" data-s="6">✓ Sale closed · Basket $1,638 · Insights synced</div>
          <div class="ag-typing"><i></i><i></i><i></i></div>
        </div></div>
      </div></div>
    </div></div></div>
    <div class="ag-details"><div class="ag-wrap"><div class="ag-rv">
      <div class="ag-details-h">Learn more</div>
      <div class="ag-acc">${accItem(C.subT, C.sub)}${accItem(C.empowerT, C.empower)}${accItem(C.platformT, C.platform)}</div>
    </div></div></div>
  </section>`;

  // ---------- no orphan words: glue the last two words of each text block ----------
  // (CSS text-wrap: pretty/balance does the same in browsers that support it; this covers the rest.)
  const GLUE = ".ag-h2, .ag-kicker, .ag-v1-list span, .ag-msg, .ag-prod small, .ag-acc-btn > span, .ag-acc-panel p";
  function noOrphans(root) {
    root.querySelectorAll(GLUE).forEach((el) => {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (w.nextNode()) nodes.push(w.currentNode);
      let seenWord = false; // a word already exists after the current position
      for (let i = nodes.length - 1; i >= 0; i--) {
        const t = nodes[i].nodeValue;
        const search = seenWord ? t : t.replace(/\s+$/, "");
        const k = search.lastIndexOf(" ");
        if (k >= 0 && (k > 0 || i > 0)) { nodes[i].nodeValue = t.slice(0, k) + " " + t.slice(k + 1); break; }
        if (search.trim()) seenWord = true;
      }
    });
  }

  // ---------- mount ----------
  let host = null, sec = null, io = null, step = -1, els = null;

  function mount() {
    host.innerHTML = html();
    noOrphans(host);
    els = {
      track: host.querySelector(".ag-track"),
      msgs: [...host.querySelectorAll(".ag-msg")],
      lis: [...host.querySelectorAll(".ag-v1-list li")],
      feed: host.querySelector(".ag-v1-feed"),
      chat: host.querySelector(".ag-v1-chat"),
      typing: host.querySelector(".ag-typing"),
    };
    step = -1;
    if (io) io.disconnect();
    io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("ag-in"); io.unobserve(e.target); } }), { threshold: 0.15 });
    host.querySelectorAll(".ag-rv").forEach((el) => io.observe(el));
    tick();
  }

  function tick() {
    if (!els || !els.track.isConnected) return;
    const r = els.track.getBoundingClientRect(), span = r.height - innerHeight;
    const p = span > 0 ? clamp(-r.top / span) : 1;
    const s = Math.min(6, Math.floor(seg(p, 0.03, 0.92) * 7));
    if (s === step) return;
    step = s;
    els.msgs.forEach((m) => m.classList.toggle("on", +m.dataset.s <= s));
    els.lis.forEach((li, i) => li.classList.toggle("on", i < s));
    els.typing.classList.toggle("on", s < 6);
    const over = els.feed.offsetHeight - (els.chat.clientHeight - 32);
    els.feed.style.transform = `translateY(${-Math.max(0, over)}px)`;
  }
  // rAF for smoothness, with a timer fallback for throttled/background tabs
  let raf = 0;
  const run = () => { if (raf) { raf = 0; tick(); } };
  const req = () => { if (!raf) { raf = requestAnimationFrame(run); setTimeout(run, 60); } };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", () => { step = -1; req(); });

  function onHostClick(e) {
    const a = e.target.closest(".ag-acc-btn");
    if (!a) return;
    const open = a.parentElement.classList.toggle("open");
    a.setAttribute("aria-expanded", open);
  }

  const findSec = () => {
    const h = [...document.querySelectorAll("main section h2")].find((e) => e.textContent.trim() === C.title);
    return h ? h.closest("section") : null;
  };

  function ensure() {
    const onHome = location.pathname === "/" || location.pathname === "/index.html";
    if (!onHome) { if (host) { host.remove(); host = null; sec = null; els = null; } return; }
    const s = findSec();
    if (!s) return;
    if (s !== sec || !host || !host.isConnected) {
      if (host) host.remove();
      sec = s;
      sec.style.display = "none";
      host = document.createElement("div");
      host.id = "ag-scale";
      host.addEventListener("click", onHostClick);
      sec.after(host);
      mount();
    }
  }

  let pend = false;
  new MutationObserver(() => { if (!pend) { pend = true; setTimeout(() => { pend = false; ensure(); }, 30); } }).observe(document.documentElement, { childList: true, subtree: true });
  ensure();

  // Clear the stored switcher choice from the prototype phase.
  try { localStorage.removeItem("ag-scale-variant"); } catch (e) {}
})();
