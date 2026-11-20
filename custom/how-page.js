/*
 * /how-it-works — redesigned page: "one week, day by day".
 *   Hero      "How It Works?" + a collage of 7 vertical photo strips, one per day of the week;
 *             the 3 step photos are sliced across their days (1–2, 3–4, 5–7), with scroll depth.
 *   The week  pinned; a Day 1→7 counter drives the page: the photos re-deal like a deck,
 *             each phase animates on its photo (focus brackets + chips / a flow chart drawing
 *             Goals→Guardrails→Milestones / a rising KPI chart), and a 7-day ribbon with
 *             milestone flags fills along the bottom. Full step texts sit in dropdowns below.
 *   Close     "We're committed to sharing knowledge every step of the way." with a drawn
 *             infinity loop for ongoing support.
 * Site font only; no orphan words. Layered on the compiled build (hides the original sections).
 */
(function () {
  "use strict";
  const IMG = [
    { src: "/assets/implementation-discovery-B6jxrqhp.jpg", w: 1920, h: 1280, alt: "Discovery and needs assessment" },
    { src: "/assets/implementation-goals-DvkBRQBO.png", w: 1313, h: 875, alt: "Goals, milestones and execution plan" },
    { src: "/assets/implementation-deployment-DOPcpDiZ.png", w: 1313, h: 875, alt: "Deployment and support" },
  ];
  const STEPS = [
    { t: "Discovery and needs assessment", short: "In-depth consultations and assessments", days: [1, 2], label: "Discovery",
      body: "Every successful partnership starts with understanding your unique needs and challenges. We conduct in-depth consultations and assessments to gain insight into your business and goals." },
    { t: "Goals, milestones and execution plan", short: "Goals, safety guardrails and milestones", days: [3, 4], label: "Goals & plan",
      body: "Clear goals are essential for progress. We work with you to set goals, safety guardrails and define milestones that mark our journey towards success." },
    { t: "Deployment and support", short: "Quick impact on KPIs, sales and growth.", days: [5, 7], label: "Deployment & support",
      body: "Quick impact on KPIs, sales and growth. We're committed to sharing knowledge every step of the way." },
  ];
  const DAY_PHASE = [0, 0, 1, 1, 2, 2, 2];

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const acc = (title, body) => `<div class="hw-acc"><button type="button" class="hw-acc-btn" aria-expanded="false"><span>${esc(title)}</span><i aria-hidden="true"></i></button><div class="hw-acc-panel" hidden><div class="hw-acc-body"><p>${esc(body)}</p></div></div></div>`;

  const html = () => `
<div class="hw">
  <section class="hw-hero">
    <div class="hw-wrap hw-hero-in">
      <div class="hw-copy">
        <span class="hw-kick">Implementation</span>
        <h1 class="hw-h1">How It <span>Works?</span></h1>
        <p class="hw-sub">One week implementation</p>
        <div class="hw-mini">${STEPS.map((s, i) => `<a href="#the-week" data-phase="${i}"><b>0${i + 1}</b>${esc(s.label)}</a>`).join("")}</div>
      </div>
      <div class="hw-strips" aria-hidden="true">
        ${[1, 2, 3, 4, 5, 6, 7].map((d) => `<div class="hw-strip" data-day="${d}"><div class="hw-slice"></div><span>Day ${d}</span></div>`).join("")}
        ${STEPS.map((s, i) => `<em class="hw-group g${i}"><b>0${i + 1}</b>${esc(s.label)}</em>`).join("")}
      </div>
    </div>
  </section>

  <section class="hw-week" id="the-week">
    <div class="hw-track"><div class="hw-sticky">
      <div class="hw-wrap hw-week-grid">
        <div class="hw-left">
          <div class="hw-day"><small>Day</small><b>1</b><span>/ 7</span></div>
          <div class="hw-phases">
            ${STEPS.map((s, i) => `<div class="hw-phase${i === 0 ? " on" : ""}"><span class="hw-pn">0${i + 1}</span><h2 class="hw-h2">${esc(s.t)}</h2><p class="hw-short">${esc(s.short)}</p></div>`).join("")}
          </div>
        </div>
        <div class="hw-stage">
          <figure class="hw-photo" data-i="0"><img src="${IMG[0].src}" alt="${IMG[0].alt}">
            <span class="hw-focus" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span class="hw-chip c1">In-depth consultations</span><span class="hw-chip c2">Assessments</span><span class="hw-chip c3">Your business &amp; goals</span>
          </figure>
          <figure class="hw-photo" data-i="1"><img src="${IMG[1].src}" alt="${IMG[1].alt}">
            <div class="hw-panel hw-flow">
              <svg viewBox="0 0 320 70" aria-hidden="true"><path class="hw-draw" pathLength="1" d="M70 35 H125"/><path class="hw-draw" pathLength="1" d="M195 35 H250"/></svg>
              <span class="n n1">Goals</span><span class="n n2">Guardrails</span><span class="n n3">Milestones</span>
            </div>
          </figure>
          <figure class="hw-photo" data-i="2"><img src="${IMG[2].src}" alt="${IMG[2].alt}">
            <div class="hw-panel hw-kpi">
              <div class="hw-kpi-tags"><span>KPIs ↑</span><span>Sales ↑</span><span>Growth ↑</span></div>
              <svg viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
                <path class="hw-area" d="M0 82 L40 74 L80 76 L120 60 L160 52 L200 38 L240 30 L300 10 L300 90 L0 90 Z"/>
                <path class="hw-draw" pathLength="1" vector-effect="non-scaling-stroke" d="M0 82 L40 74 L80 76 L120 60 L160 52 L200 38 L240 30 L300 10"/>
              </svg>
            </div>
            <span class="hw-chip c4">Support, every step</span>
          </figure>
        </div>
      </div>
      <div class="hw-wrap hw-ribbon">
        <div class="hw-days">${[1, 2, 3, 4, 5, 6, 7].map((d) => `<div class="hw-cell"><span>Day ${d}</span>${[2, 4, 7].includes(d) ? `<i class="hw-flag" data-d="${d}"></i>` : ""}</div>`).join("")}<b class="hw-fill"></b></div>
        <div class="hw-labels"><span style="grid-column:1 / 3">Discovery</span><span style="grid-column:3 / 5">Goals &amp; plan</span><span style="grid-column:5 / 8">Deployment &amp; support</span></div>
      </div>
    </div></div>
    <div class="hw-wrap hw-more">
      <div class="hw-more-h">The details</div>
      ${STEPS.map((s, i) => acc(`0${i + 1} · ${s.t}`, s.body)).join("")}
    </div>
  </section>

  <section class="hw-close">
    <svg class="hw-loop" viewBox="0 0 400 160" aria-hidden="true">
      <path class="hw-loop-bg" d="M200 80 C 150 10, 40 10, 40 80 C 40 150, 150 150, 200 80 C 250 10, 360 10, 360 80 C 360 150, 250 150, 200 80 Z"/>
      <path class="hw-loop-line" pathLength="1" d="M200 80 C 150 10, 40 10, 40 80 C 40 150, 150 150, 200 80 C 250 10, 360 10, 360 80 C 360 150, 250 150, 200 80 Z"/>
      <circle class="hw-loop-dot" r="6"><animateMotion dur="5s" repeatCount="indefinite" path="M200 80 C 150 10, 40 10, 40 80 C 40 150, 150 150, 200 80 C 250 10, 360 10, 360 80 C 360 150, 250 150, 200 80 Z"/></circle>
    </svg>
    <p class="hw-close-t">We're committed to sharing knowledge every step of the way.</p>
    <span class="hw-close-k">After day 7 · ongoing support</span>
  </section>
</div>`;

  function noOrphans(root) {
    root.querySelectorAll(".hw-h1, .hw-h2, .hw-sub, .hw-short, .hw-close-t, .hw-acc-btn > span, .hw-acc-body p").forEach((el) => {
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

  let host = null, hidden = [], R = null;
  const q = (s) => host.querySelector(s), qa = (s) => [...host.querySelectorAll(s)];

  // Each phase's photo is sliced across its day strips as one continuous image.
  function layoutStrips() {
    const strips = R.strips;
    STEPS.forEach((s, i) => {
      const group = strips.slice(s.days[0] - 1, s.days[1]);
      const rects = group.map((g) => g.querySelector(".hw-slice").getBoundingClientRect());
      if (!rects.length || !rects[0].width) return;
      const left = rects[0].left, width = rects[rects.length - 1].right - left, height = Math.max(...rects.map((r) => r.height));
      const im = IMG[i], sc = Math.max(width / im.w, height / im.h), bw = im.w * sc, bh = im.h * sc;
      group.forEach((g, k) => {
        const sl = g.querySelector(".hw-slice");
        sl.style.backgroundImage = `url("${im.src}")`;
        sl.style.backgroundSize = `${bw.toFixed(0)}px ${bh.toFixed(0)}px`;
        sl.style.backgroundPosition = `${(-(rects[k].left - left) - (bw - width) / 2).toFixed(1)}px ${(-(bh - height) / 2).toFixed(1)}px`;
      });
      const label = R.groups[i], first = group[0].getBoundingClientRect(), box = R.stripBox.getBoundingClientRect();
      label.style.left = first.left - box.left + "px";
      label.style.width = width + "px";
    });
  }

  function mount(main) {
    hidden = [...main.children].filter((c) => c.tagName === "SECTION");
    hidden.forEach((s) => { s.style.display = "none"; });
    host = document.createElement("div");
    host.id = "ag-how";
    host.innerHTML = html();
    (hidden[hidden.length - 1] || main.lastElementChild).after(host);
    noOrphans(host);
    R = {
      strips: qa(".hw-strip"), stripBox: q(".hw-strips"), groups: qa(".hw-group"), copy: q(".hw-copy"),
      track: q(".hw-track"), day: q(".hw-day b"), phases: qa(".hw-phase"), photos: qa(".hw-photo"),
      fill: q(".hw-fill"), flags: qa(".hw-flag"), cells: qa(".hw-cell"),
      flowDraw: qa(".hw-flow .hw-draw"), kpiDraw: q(".hw-kpi .hw-draw"),
      close: q(".hw-close"), loop: q(".hw-loop-line"), lastDay: -1, lastPhase: -1,
    };
    host.addEventListener("click", (e) => {
      const a = e.target.closest(".hw-acc-btn");
      if (a) { toggleAcc(a); return; }
      const m = e.target.closest("[data-phase]");
      if (m) {
        e.preventDefault();
        const i = +m.dataset.phase, tr = R.track, span = tr.offsetHeight - innerHeight;
        const target = [0.08, 0.4, 0.75][i];
        scrollTo({ top: tr.getBoundingClientRect().top + scrollY + span * target, behavior: reduced ? "auto" : "smooth" });
      }
    });
    const imgs = IMG.map((im) => { const x = new Image(); x.src = im.src; return x; });
    Promise.all(imgs.map((x) => (x.decode ? x.decode().catch(() => {}) : null))).then(() => { if (R) layoutStrips(); });
    layoutStrips();
    render();
  }
  function unmount() {
    if (host) host.remove();
    host = null; R = null;
    hidden.forEach((s) => { s.style.display = ""; });
    hidden = [];
  }

  function render() {
    if (!R || !host.isConnected) return;
    // hero: strips drift at slightly different speeds; copy lifts away
    const hero = q(".hw-hero").getBoundingClientRect(), hp = clamp(-hero.top / hero.height);
    if (hero.bottom > 0) {
      const k = innerWidth < 760 ? 0.35 : 1;
      R.strips.forEach((s, i) => { s.style.transform = `translateY(${(((i % 2 ? 1 : -1) * 10 + [0, 22, -6, 16, -12, 6, 20][i]) * k * (1 - hp) - hp * (60 + i * 18)).toFixed(1)}px)`; });
      R.copy.style.transform = `translateY(${(-hp * 70).toFixed(1)}px)`;
      R.copy.style.opacity = (1 - seg(hp, 0.3, 0.85)).toFixed(3);
    }
    // the week
    const r = R.track.getBoundingClientRect(), span = r.height - innerHeight;
    const p = reduced ? 1 : span > 0 ? clamp(-r.top / span) : 0;
    const dayF = 1 + seg(p, 0.02, 0.92) * 6.999, day = Math.floor(dayF), ph = DAY_PHASE[day - 1];
    if (day !== R.lastDay) {
      R.lastDay = day;
      R.day.textContent = day;
      R.day.classList.remove("tick"); void R.day.offsetWidth; R.day.classList.add("tick");
      R.cells.forEach((c, i) => c.classList.toggle("on", i < day));
      R.flags.forEach((f) => f.classList.toggle("on", day >= +f.dataset.d));
    }
    if (ph !== R.lastPhase) {
      R.lastPhase = ph;
      R.phases.forEach((x, i) => x.classList.toggle("on", i === ph));
      R.photos.forEach((x, i) => { x.dataset.d = String(i - ph); });
    }
    R.fill.style.width = (seg(dayF, 1, 8) * 100).toFixed(2) + "%";
    // phase-local drawing
    const local = (i) => { const [a, b] = STEPS[i].days; return seg(dayF, a, b + 1); };
    R.flowDraw.forEach((d, k) => { d.style.strokeDashoffset = (1 - ease(seg(local(1), 0.15 + k * 0.3, 0.45 + k * 0.3))).toFixed(4); });
    R.kpiDraw.style.strokeDashoffset = (1 - ease(seg(local(2), 0.05, 0.75))).toFixed(4);
    q(".hw-flow").dataset.k = String(Math.floor(clamp(local(1) * 3.4, 0, 3)));
    // close: the loop draws in as it enters
    const c = R.close.getBoundingClientRect();
    R.loop.style.strokeDashoffset = (1 - ease(clamp((innerHeight - c.top) / (innerHeight * 0.8)))).toFixed(4);
  }
  let pend = 0;
  const req = () => { if (!pend) { pend = requestAnimationFrame(() => { pend = 0; render(); }); setTimeout(() => { if (pend) { cancelAnimationFrame(pend); pend = 0; render(); } }, 60); } };
  addEventListener("scroll", req, { passive: true });
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { if (R) { layoutStrips(); render(); } }, 120); });

  function ensure() {
    if (location.pathname !== "/how-it-works") { if (host) unmount(); return; }
    if (host && host.isConnected) return;
    const main = document.querySelector("main");
    if (!main) return;
    const orig = [...main.children].find((c) => c.tagName === "SECTION" && /One week implementation/.test(c.textContent));
    if (orig) mount(main);
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(ensure, 40); }).observe(document.documentElement, { childList: true, subtree: true });
  ensure();
})();
