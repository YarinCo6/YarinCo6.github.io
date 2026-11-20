/*
 * /solutions — redesigned page: "one agent, from the shop floor to the sofa".
 *   Hero      the three solution photos as a constellation joined by a route line,
 *             an agent dot travelling it, mouse depth + scroll drift.
 *   01 Sales Team      pinned; scroll flips Associate mode <-> Customer mode on a product card.
 *   02 In Store Kiosk  pinned; annotations land on the kiosk photo step by step
 *                      (search, match, compare, floor route to the TV wall, upsell, pay...).
 *   03 Online          pinned; a 24-hour cycle: clock, night->day->night, customer moments
 *                      popping out of the laptop's chat widget.
 *   Finale    the three photos fan around the live demo video.
 * Lists and long copy live in dropdowns (site rule); site font only; no orphan words.
 * Layered on the compiled build: hides the original sections and renders this in place.
 * Section ids sales-team / in-store-kiosk / online are kept for the navbar's Solutions menu.
 */
(function () {
  "use strict";
  const IMG = {
    team: "/assets/solutions-sales-team-cJu94gXH.jpg",
    kiosk: "/assets/solutions-kiosk-Cryjb-v-.png",
    online: "/assets/solutions-online-Yafv3-kP.avif",
  };
  const VIDEO = "/videos/salesteam-demo.mp4";
  const T = {
    sub: "AI agents drive conversion across every retail touchpoint",
    teamIntro: "Turn every associate into a top-tier sales expert with AI expert conversation agent in dual-mode ready:",
    assoc: ["Associates get real-time product data", "Special offers", "Competitors' pricing", "Full catalog availability", "Upsell & cross sell opportunities"],
    cust: ["Easy to understand product specs", "Ratings", "Measurements", "Energy ratings", "Product comparisons", "Pricing", "Availability", "Delivery options", "Map product location in store"],
    kioskLede: "In store kiosk AI agents",
    kiosk: ["Remote management in store offers", "AI expert conversation agent understands the customer needs with instant product match", "Easy to understand product information, ratings, product comparison, price, special offers, availability", "Map product location in store", "Personalized upsell and cross sell opportunities", "Fast checkout & pay", "Minimize returns rate"],
    onlineLede: "AI Agent on retailer's site and app 24/7",
    online: ["Maximize customers retention in your site/app", "Product information, ratings, price, products comparison, special offers, measurements, availability and delivery options", "Upsell and cross sell opportunities", "Fast checkout & pay", "Minimize returns rate"],
  };
  // Product card faces (demo data shown on the Sales Team card)
  const ASSOC_ROWS = [["Real-time product data", "Updated 2 min ago"], ["Special offer", "−10% this week"], ["Competitors' pricing", "Lowest of 4 stores"], ["Catalog availability", "12 in store · 40 in DC"], ["Upsell", "Soundbar +$249"]];
  const CUST_ROWS = [["Specs, simply", "65\" · 4K · 120Hz"], ["Rating", "★ 4.7 · 2,140 reviews"], ["Energy rating", "A"], ["Measurements", "145 × 83 × 3 cm"], ["Find it", "Aisle 7 · Bay C"]];
  // Kiosk steps, one per capability. Boxes are % of the photo (x, y, w, h).
  const KS = [
    { t: "Remote management of in-store offers", badge: [62, 18, "Offers updated remotely"] },
    { t: "Understands the need, instant product match", rings: [[33.5, 28.4, 14.6, 3.6], [33.8, 35, 31.8, 16.4]] },
    { t: "Clear info, ratings, comparison and price", rings: [[33.8, 35, 9.4, 16.4]] },
    { t: "Maps the product's location in store", route: true, rings: [[0.6, 7.4, 18.6, 30.6]] },
    { t: "Personalized upsell and cross-sell", rings: [[35.6, 53.3, 32, 15.2]] },
    { t: "Fast checkout & pay", badge: [66, 70, "Paid · 0:42"] },
    { t: "Minimizes returns rate", badge: [14, 80, "Right product, first time"] },
  ];
  // Online: moments across a day (hour, text)
  const OM = [
    [2.2, "Measurements and delivery options, answered"],
    [7.8, "Ratings and a side-by-side comparison sent"],
    [12.5, "Special offer applied at checkout"],
    [16.9, "Upsell accepted: wall mount added"],
    [20.6, "Fast checkout & pay, done in the chat"],
    [23.4, "Returning customer picked up where they left off"],
  ];

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const lerp = (a, b, t) => a + (b - a) * t;
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;

  const list = (items) => `<ul class="sp-list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  const acc = (title, body) => `<div class="sp-acc"><button type="button" class="sp-acc-btn" aria-expanded="false"><span>${esc(title)}</span><i aria-hidden="true"></i></button><div class="sp-acc-panel" hidden><div class="sp-acc-body">${body}</div></div></div>`;
  const rows = (r) => r.map(([k, v]) => `<div class="sp-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("");
  const hh = (h) => { const m = Math.floor((h % 24) * 60); return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };

  const html = () => `
<div class="sp">
  <section class="sp-hero">
    <div class="sp-wrap sp-hero-in">
      <div class="sp-hero-copy">
        <span class="sp-kick">Sales floor · Kiosk · Online</span>
        <h1 class="sp-h1">Our <span>Solutions</span></h1>
        <p class="sp-sub">${T.sub}</p>
        <div class="sp-hero-index">
          <a href="#sales-team" data-jump="sales-team"><b>01</b>Sales Team</a>
          <a href="#in-store-kiosk" data-jump="in-store-kiosk"><b>02</b>In Store Kiosk</a>
          <a href="#online" data-jump="online"><b>03</b>Online</a>
        </div>
      </div>
      <div class="sp-const">
        <svg class="sp-const-svg" aria-hidden="true"><path class="sp-route-line"/><path class="sp-route-glow"/><circle class="sp-agent" r="5"/></svg>
        <a class="sp-star s1" href="#sales-team" data-jump="sales-team" data-depth="0.55"><img src="${IMG.team}" alt="Sales Team AI Assistant"><span><b>01</b>Sales Team</span></a>
        <a class="sp-star s2" href="#in-store-kiosk" data-jump="in-store-kiosk" data-depth="1"><img src="${IMG.kiosk}" alt="Kiosk AI Agent"><span><b>02</b>In Store Kiosk</span></a>
        <a class="sp-star s3" href="#online" data-jump="online" data-depth="0.3"><img src="${IMG.online}" alt="Online AI Agent"><span><b>03</b>Online</span></a>
        <i class="sp-dot d1"></i><i class="sp-dot d2"></i><i class="sp-dot d3"></i>
      </div>
    </div>
  </section>

  <nav class="sp-rail" aria-label="Solutions">
    <a href="#sales-team" data-jump="sales-team"><i></i><span>Sales Team</span></a>
    <a href="#in-store-kiosk" data-jump="in-store-kiosk"><i></i><span>In Store Kiosk</span></a>
    <a href="#online" data-jump="online"><i></i><span>Online</span></a>
    <b class="sp-rail-fill"></b>
  </nav>

  <section id="sales-team" class="sp-ch sp-team">
    <div class="sp-track"><div class="sp-sticky"><div class="sp-wrap sp-team-grid">
      <div class="sp-copy">
        <div class="sp-num">01</div>
        <h2 class="sp-h2">Sales Team</h2>
        <p class="sp-lede">One AI expert conversation agent, dual-mode ready.</p>
        <div class="sp-switch" role="tablist" aria-label="Mode">
          <button type="button" role="tab" data-m="0" aria-selected="true">Associate mode</button>
          <button type="button" role="tab" data-m="1" aria-selected="false">Customer mode</button>
          <i></i>
        </div>
        <p class="sp-modecap"><span class="m0">What your associate sees</span><span class="m1">What your customer sees</span></p>
        <button type="button" class="sp-demo" data-demo><i></i>View Demo</button>
      </div>
      <div class="sp-team-stage">
        <div class="sp-photo sq"><img src="${IMG.team}" alt="Sales Team AI Assistant"></div>
        <div class="sp-card">
          <div class="sp-card-head"><i></i><div><b>65" OLED TV</b><small class="m0">Associate view</small><small class="m1">Customer view</small></div><span class="sp-card-price">$1,449</span></div>
          <div class="sp-faces">
            <div class="sp-face a">${rows(ASSOC_ROWS)}</div>
            <div class="sp-face c">${rows(CUST_ROWS)}</div>
            <span class="sp-wipe"></span>
          </div>
        </div>
      </div>
    </div></div></div>
    <div class="sp-wrap sp-more">
      ${acc("About Sales Team", `<p>${esc(T.teamIntro)}</p>`)}
      ${acc(`Associate mode · ${T.assoc.length} features`, list(T.assoc))}
      ${acc(`Customer mode · ${T.cust.length} features`, list(T.cust))}
    </div>
  </section>

  <section id="in-store-kiosk" class="sp-ch sp-kiosk">
    <div class="sp-track"><div class="sp-sticky"><div class="sp-wrap sp-kiosk-grid">
      <div class="sp-copy">
        <div class="sp-num">02</div>
        <h2 class="sp-h2">In Store AI Kiosk</h2>
        <p class="sp-lede">${T.kioskLede}</p>
        <div class="sp-step">
          <div class="sp-step-n"><b>01</b> / ${String(KS.length).padStart(2, "0")}</div>
          <div class="sp-step-t">${esc(KS[0].t)}</div>
          <div class="sp-ticks">${KS.map(() => "<i></i>").join("")}</div>
        </div>
      </div>
      <div class="sp-kiosk-stage">
        <div class="sp-photo r32">
          <img src="${IMG.kiosk}" alt="Kiosk AI Agent">
          <svg class="sp-shade" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="spSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0.5"/></filter>
              <mask id="spMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="#fff"/>
                <g filter="url(#spSoft)"><rect class="sp-hole" rx="0.9" ry="1.3" fill="#000"/><rect class="sp-hole" rx="0.9" ry="1.3" fill="#000"/></g>
              </mask>
            </defs>
            <rect width="100" height="100" fill="rgba(6,8,12,.62)" mask="url(#spMask)"/>
          </svg>
          ${KS.map((s, i) => (s.rings || []).map((b) => `<span class="sp-ring" data-k="${i}" style="left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%"></span>`).join("")).join("")}
          ${KS.map((s, i) => s.badge ? `<span class="sp-badge" data-k="${i}" style="left:${s.badge[0]}%;top:${s.badge[1]}%">${esc(s.badge[2])}</span>` : "").join("")}
          <svg class="sp-floor" viewBox="0 0 1536 1024" preserveAspectRatio="none" aria-hidden="true">
            <path class="sp-floor-path" pathLength="1" d="M720 1015 C 600 930, 380 900, 320 780 S 240 560, 236 470"/>
            <g class="sp-pin"><circle cx="236" cy="462" r="13"/><circle cx="236" cy="462" r="30" class="h"/></g>
          </svg>
          <span class="sp-badge sp-pin-tag" data-k="3" style="left:20.6%;top:19%">Aisle 4 · 75" TVs</span>
        </div>
      </div>
    </div></div></div>
    <div class="sp-wrap sp-more">${acc(`All kiosk capabilities · ${T.kiosk.length}`, list(T.kiosk))}</div>
  </section>

  <section id="online" class="sp-ch sp-online">
    <div class="sp-track"><div class="sp-sticky"><div class="sp-sky"></div><div class="sp-wrap sp-online-grid">
      <div class="sp-copy">
        <div class="sp-num">03</div>
        <h2 class="sp-h2">Online</h2>
        <p class="sp-lede">${esc(T.onlineLede)}</p>
        <div class="sp-clock"><b>00:00</b><span>always on</span></div>
      </div>
      <div class="sp-online-stage">
        <svg class="sp-dial" viewBox="-300 -300 600 600" aria-hidden="true">
          <circle r="270" class="ring"/>
          ${Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2 - Math.PI / 2, r1 = i % 6 ? 262 : 252; return `<line x1="${(Math.cos(a) * r1).toFixed(1)}" y1="${(Math.sin(a) * r1).toFixed(1)}" x2="${(Math.cos(a) * 278).toFixed(1)}" y2="${(Math.sin(a) * 278).toFixed(1)}" class="${i % 6 ? "t" : "t big"}"/>`; }).join("")}
          <circle r="270" class="arc" pathLength="1"/>
          <circle r="9" class="sun"/>
        </svg>
        <div class="sp-photo r32"><img src="${IMG.online}" alt="Online AI Agent">
          ${OM.map(([h, t]) => `<div class="sp-bubble"><small>${hh(h)}</small>${esc(t)}</div>`).join("")}
        </div>
      </div>
    </div></div></div>
    <div class="sp-wrap sp-more">${acc(`All online capabilities · ${T.online.length}`, list(T.online))}</div>
  </section>

  <section class="sp-finale">
    <div class="sp-wrap">
      <h2 class="sp-h2 sp-fin-h">See it in action</h2>
      <div class="sp-fan">
        <img class="f1" src="${IMG.team}" alt="">
        <img class="f2" src="${IMG.kiosk}" alt="">
        <img class="f3" src="${IMG.online}" alt="">
        <button type="button" class="sp-screen" data-demo aria-label="Play the demo with sound">
          <video src="${VIDEO}" muted loop playsinline preload="metadata"></video>
          <span class="sp-play"><i></i></span>
        </button>
      </div>
    </div>
  </section>
</div>`;

  // ---------- no orphan words ----------
  function noOrphans(root) {
    root.querySelectorAll(".sp-h1, .sp-h2, .sp-sub, .sp-lede, .sp-step-t, .sp-bubble, .sp-acc-btn > span, .sp-acc-body p, .sp-list li, .sp-modecap span").forEach((el) => {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
      while (w.nextNode()) nodes.push(w.currentNode);
      let seen = false;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const t = nodes[i].nodeValue, s = seen ? t : t.replace(/\s+$/, ""), k = s.lastIndexOf(" ");
        if (k >= 0 && (k > 0 || i > 0)) { nodes[i].nodeValue = t.slice(0, k) + " " + t.slice(k + 1); break; }
        if (s.trim()) seen = true;
      }
    });
  }

  // ---------- dropdowns (smooth both ways) ----------
  function toggleAcc(btn) {
    const panel = btn.nextElementSibling, open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    if (panel._a) { panel._a.onfinish = null; panel._a.cancel(); }
    if (open) panel.hidden = false;
    if (reduced || !panel.animate) { panel.hidden = !open; return; }
    const h = panel.scrollHeight;
    panel.style.overflow = "hidden";
    const kf = [{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }];
    panel._a = panel.animate(open ? kf : kf.reverse(), { duration: 360, easing: "cubic-bezier(.2,.7,.2,1)" });
    panel._a.onfinish = () => { panel._a = null; panel.style.overflow = ""; if (!open) panel.hidden = true; };
  }

  // ---------- demo lightbox ----------
  function openDemo() {
    const lb = document.createElement("div");
    lb.className = "sp-lb";
    lb.innerHTML = `<div class="sp-lb-in"><button type="button" class="sp-lb-x" aria-label="Close">✕</button><video src="${VIDEO}" controls autoplay playsinline></video></div>`;
    document.body.appendChild(lb);
    const close = () => { lb.classList.remove("on"); removeEventListener("keydown", onKey); setTimeout(() => lb.remove(), 300); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".sp-lb-x")) close(); });
    addEventListener("keydown", onKey);
    requestAnimationFrame(() => lb.classList.add("on"));
    lb.querySelector(".sp-lb-x").focus();
  }

  // ---------- mount ----------
  let host = null, hidden = [], R = null, raf = 0;
  const q = (s) => host.querySelector(s), qa = (s) => [...host.querySelectorAll(s)];

  function mount(main) {
    hidden = [...main.children].filter((c) => c.tagName === "SECTION");
    hidden.forEach((s) => { s.style.display = "none"; });
    // hand the navbar's anchor ids over to the new sections
    ["sales-team", "in-store-kiosk", "online"].forEach((id) => { const o = document.getElementById(id); if (o) { o.dataset.origId = id; o.removeAttribute("id"); } });
    host = document.createElement("div");
    host.id = "ag-sol";
    host.innerHTML = html();
    (hidden[hidden.length - 1] || main.lastElementChild).after(host);
    noOrphans(host);
    R = {
      hero: q(".sp-hero"), heroCopy: q(".sp-hero-copy"), cst: q(".sp-const"), stars: qa(".sp-star"), dots: qa(".sp-dot"),
      line: q(".sp-route-line"), glow: q(".sp-route-glow"), agent: q(".sp-agent"), svg: q(".sp-const-svg"),
      rail: q(".sp-rail"), railLinks: qa(".sp-rail a"), railFill: q(".sp-rail-fill"),
      team: { sec: q(".sp-team"), track: q(".sp-team .sp-track"), sw: q(".sp-switch"), card: q(".sp-card"), a: qa(".sp-face.a .sp-row"), c: qa(".sp-face.c .sp-row"), faceC: q(".sp-face.c"), wipe: q(".sp-wipe") },
      kiosk: { sec: q(".sp-kiosk"), track: q(".sp-kiosk .sp-track"), n: q(".sp-step-n b"), t: q(".sp-step-t"), ticks: qa(".sp-ticks i"), rings: qa(".sp-ring"), badges: qa(".sp-badge"), path: q(".sp-floor-path"), pin: q(".sp-pin"), shade: q(".sp-shade"), holes: qa(".sp-hole"), last: -1 },
      online: { sec: q(".sp-online"), track: q(".sp-online .sp-track"), sky: q(".sp-sky"), clock: q(".sp-clock b"), sun: q(".sp-dial .sun"), arc: q(".sp-dial .arc"), dial: q(".sp-dial"), bubbles: qa(".sp-bubble") },
      fin: { sec: q(".sp-finale"), imgs: qa(".sp-fan img"), screen: q(".sp-screen"), video: q(".sp-screen video") },
      mx: 0, my: 0, tx: 0, ty: 0, t0: performance.now(), mode: -1,
    };
    host.addEventListener("click", onClick);
    if (fine) R.hero.addEventListener("pointermove", (e) => { R.tx = (e.clientX / innerWidth) * 2 - 1; R.ty = (e.clientY / innerHeight) * 2 - 1; });
    new IntersectionObserver((es) => es.forEach((e) => { const v = R && R.fin.video; if (!v) return; if (e.isIntersecting && !reduced) v.play().catch(() => {}); else v.pause(); }), { threshold: 0.35 }).observe(R.fin.screen);
    render();
    loop();
    if (["#sales-team", "#in-store-kiosk", "#online"].includes(location.hash)) setTimeout(() => jump(location.hash.slice(1)), 120);
  }
  function unmount() {
    if (host) host.remove();
    host = null; R = null;
    hidden.forEach((s) => { s.style.display = ""; });
    document.querySelectorAll("[data-orig-id]").forEach((o) => { o.id = o.dataset.origId; delete o.dataset.origId; });
    hidden = [];
  }

  function jump(id, frac) {
    const el = document.getElementById(id);
    if (!el) return;
    const tr = el.querySelector(".sp-track");
    let y = el.getBoundingClientRect().top + scrollY - (frac == null ? 0 : 0);
    if (tr && frac != null) y = tr.getBoundingClientRect().top + scrollY + (tr.offsetHeight - innerHeight) * frac;
    scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  }

  function onClick(e) {
    const a = e.target.closest(".sp-acc-btn");
    if (a) { toggleAcc(a); return; }
    if (e.target.closest("[data-demo]")) { e.preventDefault(); openDemo(); return; }
    const j = e.target.closest("[data-jump]");
    if (j) { e.preventDefault(); jump(j.dataset.jump); return; }
    const m = e.target.closest(".sp-switch button");
    if (m) jump("sales-team", m.dataset.m === "1" ? 0.78 : 0.2);
  }

  // progress through a pinned track: 0 when it pins, 1 when it unpins
  const trackP = (tr) => { const r = tr.getBoundingClientRect(), span = r.height - innerHeight; return span > 0 ? clamp(-r.top / span) : 0; };

  function renderHero() {
    const h = R.hero.getBoundingClientRect(), hp = clamp(-h.top / h.height);
    if (h.bottom < 0) return;
    R.mx = lerp(R.mx, R.tx, 0.08); R.my = lerp(R.my, R.ty, 0.08);
    R.heroCopy.style.transform = `translateY(${(-hp * 80).toFixed(1)}px)`;
    R.heroCopy.style.opacity = (1 - seg(hp, 0.25, 0.8)).toFixed(3);
    const box = R.cst.getBoundingClientRect(), pts = [];
    R.stars.forEach((s, i) => {
      const d = +s.dataset.depth, spread = [-1, 1, -0.4][i];
      const x = R.mx * 26 * d + spread * hp * 140, y = R.my * 18 * d - hp * 260 * d;
      s.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      const r = s.querySelector("img").getBoundingClientRect();
      pts.push([r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]);
    });
    R.dots.forEach((d, i) => { d.style.transform = `translate3d(${(R.mx * 40 * (i + 1) * 0.4).toFixed(1)}px, ${(R.my * 30 - hp * 120 * (i + 1) * 0.5).toFixed(1)}px, 0)`; });
    // route s1 -> s2 -> s3 -> s1 with soft curves
    const [a, b, c] = pts;
    const cv = (p1, p2, k) => { const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, dx = p2[0] - p1[0], dy = p2[1] - p1[1]; return `Q ${(mx - dy * k).toFixed(1)} ${(my + dx * k).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`; };
    const d = `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} ${cv(a, b, 0.18)} ${cv(b, c, 0.18)} ${cv(c, a, 0.18)}`;
    R.line.setAttribute("d", d);
    R.glow.setAttribute("d", d);
    R.svg.setAttribute("viewBox", `0 0 ${box.width.toFixed(0)} ${box.height.toFixed(0)}`);
    const len = R.glow.getTotalLength();
    if (len) {
      const t = (((performance.now() - R.t0) / 9000) % 1), pt = R.glow.getPointAtLength(t * len);
      R.agent.setAttribute("cx", pt.x.toFixed(1)); R.agent.setAttribute("cy", pt.y.toFixed(1));
      R.glow.style.strokeDasharray = `${(len * 0.12).toFixed(1)} ${len.toFixed(1)}`;
      R.glow.style.strokeDashoffset = (-(t * len) + len * 0.12).toFixed(1);
    }
  }

  function renderTeam() {
    const S = R.team, p = reduced ? 0 : trackP(S.track), m = p >= 0.5 ? 1 : 0;
    if (m !== R.mode) {
      R.mode = m;
      S.sec.dataset.mode = m;
      S.sw.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.m === m)));
    }
    const w = ease(seg(p, 0.44, 0.56));
    S.faceC.style.clipPath = `inset(0 ${((1 - w) * 100).toFixed(2)}% 0 0)`;
    S.wipe.style.left = (w * 100).toFixed(2) + "%";
    S.wipe.style.opacity = w > 0.01 && w < 0.99 ? 1 : 0;
    S.a.forEach((r, i) => r.classList.toggle("on", p >= 0.04 + i * 0.07 || reduced));
    S.c.forEach((r, i) => r.classList.toggle("on", p >= 0.58 + i * 0.07 || reduced));
  }

  function renderKiosk() {
    const S = R.kiosk, p = reduced ? 1 : trackP(S.track);
    const k = Math.min(KS.length - 1, Math.floor(seg(p, 0.02, 0.96) * KS.length));
    if (k !== S.last) {
      S.last = k;
      S.n.textContent = String(k + 1).padStart(2, "0");
      S.t.textContent = KS[k].t;
      noOrphans(S.t.parentElement);
      S.t.classList.remove("swap"); void S.t.offsetWidth; S.t.classList.add("swap");
      S.ticks.forEach((t, i) => t.classList.toggle("on", i <= k));
      S.rings.forEach((r) => r.classList.toggle("on", +r.dataset.k === k));
      S.badges.forEach((b) => b.classList.toggle("on", +b.dataset.k === k || (+b.dataset.k < k && b.dataset.k !== "3" && KS[+b.dataset.k].badge && k === KS.length - 1)));
      // spotlight: the marked area stays bright, only the rest of the photo darkens
      const rs = KS[k].rings || [];
      S.shade.classList.toggle("on", rs.length > 0);
      S.holes.forEach((h, i) => {
        const b = rs[i] || rs[0];
        if (!b) return;
        const pad = 0.8;
        h.style.x = (b[0] - pad) + "px"; h.style.y = (b[1] - pad * 1.5) + "px";
        h.style.width = (rs[i] ? b[2] + pad * 2 : 0) + "px"; h.style.height = (rs[i] ? b[3] + pad * 3 : 0) + "px";
      });
    }
    const local = seg(p, 0.02 + (3 / KS.length) * 0.94, 0.02 + (4 / KS.length) * 0.94);
    S.path.style.strokeDashoffset = (1 - (k > 3 ? 1 : k === 3 ? ease(clamp(local * 1.25)) : 0)).toFixed(4);
    S.pin.classList.toggle("on", k >= 3 && (k > 3 || local > 0.75));
  }

  const SKY = [[0, [12, 18, 32]], [5, [22, 33, 56]], [8, [37, 79, 92]], [12, [44, 104, 92]], [17, [52, 70, 72]], [20, [36, 32, 44]], [24, [12, 18, 32]]];
  function skyAt(h) {
    for (let i = 0; i < SKY.length - 1; i++) {
      const [h1, c1] = SKY[i], [h2, c2] = SKY[i + 1];
      if (h >= h1 && h <= h2) { const t = (h - h1) / (h2 - h1); return c1.map((v, j) => Math.round(lerp(v, c2[j], t))); }
    }
    return SKY[0][1];
  }
  function renderOnline() {
    const S = R.online, p = reduced ? 0.5 : trackP(S.track), h = p * 23.99;
    S.clock.textContent = hh(h);
    const c = skyAt(h), c2 = skyAt((h + 3) % 24);
    S.sky.style.background = `radial-gradient(120% 90% at 70% ${(80 - Math.sin((h / 24) * Math.PI) * 50).toFixed(1)}%, rgb(${c2.join(",")}) 0%, rgb(${c.join(",")}) 60%)`;
    const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
    S.sun.setAttribute("cx", (Math.cos(a) * 270).toFixed(1));
    S.sun.setAttribute("cy", (Math.sin(a) * 270).toFixed(1));
    S.sun.classList.toggle("day", h > 6 && h < 19);
    S.arc.style.strokeDashoffset = (1 - h / 24).toFixed(4);
    let cur = -1;
    OM.forEach(([t], i) => { if (h >= t) cur = i; });
    S.bubbles.forEach((b, i) => { b.classList.toggle("on", i === cur); b.classList.toggle("past", i < cur); });
  }

  function renderFinale() {
    const S = R.fin, r = S.sec.getBoundingClientRect();
    const p = reduced ? 1 : clamp((innerHeight - r.top) / (innerHeight * 0.9));
    const e = ease(p), narrow = innerWidth < 760;
    // offsets are in % of each photo's own size: they peek out left, above and right of the video
    const from = [[-280, 40, -24], [0, 140, 0], [280, 40, 24]], to = narrow ? [[-78, 14, -9], [0, -58, 0], [78, 14, 9]] : [[-112, 8, -8], [0, -62, 0], [112, 8, 8]];
    S.imgs.forEach((im, i) => {
      const x = lerp(from[i][0], to[i][0], e), y = lerp(from[i][1], to[i][1], e), rot = lerp(from[i][2], to[i][2], e);
      im.style.transform = `translate(-50%, -50%) translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) rotate(${rot.toFixed(2)}deg)`;
      im.style.opacity = (0.2 + 0.8 * e).toFixed(3);
    });
    S.screen.style.transform = `translate(-50%, -50%) scale(${(0.86 + 0.14 * e).toFixed(3)})`;
  }

  function renderRail() {
    const secs = [R.team.sec, R.kiosk.sec, R.online.sec], mid = innerHeight * 0.5;
    const first = secs[0].getBoundingClientRect(), last = secs[2].getBoundingClientRect();
    const show = first.top < mid && last.bottom > mid;
    R.rail.classList.toggle("on", show);
    let active = 0;
    secs.forEach((s, i) => { if (s.getBoundingClientRect().top < mid) active = i; });
    R.railLinks.forEach((l, i) => l.classList.toggle("on", i === active));
    const total = last.bottom - first.top;
    R.railFill.style.transform = `scaleY(${clamp((mid - first.top) / total).toFixed(4)})`;
  }

  function render() {
    if (!R || !host.isConnected) return;
    renderHero(); renderTeam(); renderKiosk(); renderOnline(); renderFinale(); renderRail();
  }
  // continuous loop only while the hero is on screen (parallax + agent dot); otherwise scroll-driven
  function loop() {
    if (!R) return;
    const heroOn = R.hero.getBoundingClientRect().bottom > 0;
    if (heroOn && !reduced) renderHero();
    raf = requestAnimationFrame(loop);
  }
  let pend = 0;
  const req = () => { if (!pend) { pend = requestAnimationFrame(() => { pend = 0; render(); }); setTimeout(() => { if (pend) { cancelAnimationFrame(pend); pend = 0; render(); } }, 60); } };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);

  function ensure() {
    const on = location.pathname === "/solutions";
    if (!on) { if (host) unmount(); return; }
    const main = document.querySelector("main");
    if (!main) return;
    const orig = [...main.children].find((c) => c.tagName === "SECTION" && /Our Solutions/.test(c.textContent));
    if (host && host.isConnected) return;
    if (!orig) return;
    mount(main);
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(ensure, 40); }).observe(document.documentElement, { childList: true, subtree: true });
  ensure();
})();
