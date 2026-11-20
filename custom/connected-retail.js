/*
 * Home "Why retailers choose us / Connected retail" — scroll-driven build-in animation.
 * Scrubbed by scroll (reverses when scrolling back up):
 *   1. The dark band unfolds from a rounded capsule to full width.
 *   2. A "Research online ⟶ Purchase offline" bridge draws itself (phone ⟶ store),
 *      then a data dot keeps travelling across it (the ROPO idea from the subtitle).
 *   3. Eyebrow tightens in, the heading rises and sharpens, the subtitle follows.
 *   4. The industries card rises and tilts flat in 3D; its rows slide in one by one.
 * Layered on the compiled build: only adds inline styles / one decorative SVG and
 * neutralises the original fade-in on the wrappers. Port as a component later.
 */
(function () {
  "use strict";
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const back = (t) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ICON_PHONE = '<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M12 18h.01"/>';
  const ICON_STORE = '<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/><path d="M3 9h18"/>';
  // Bridge geometry is computed from the real band + heading positions (in px), so the
  // nodes sit level with the heading and the arc clears the eyebrow at any width.
  const node = (x, y, ic, label) => `
    <g class="agcr-node">
      <circle cx="${x}" cy="${y}" r="58" class="agcr-halo"/>
      <circle cx="${x}" cy="${y}" r="36" class="agcr-disc"/>
      <g transform="translate(${x - 16.8} ${y - 16.8}) scale(1.4)" class="agcr-ic">${ic}</g>
      <text x="${x}" y="${y + 64}" text-anchor="middle" class="agcr-lbl">${label}</text>
    </g>`;
  function bridgeSVG(band, h2, eyebrow) {
    const br = band.getBoundingClientRect(), W = band.clientWidth, H = band.clientHeight;
    const hr = h2.getBoundingClientRect(), er = eyebrow.getBoundingClientRect();
    const cy = hr.top + hr.height / 2 - br.top;
    const x1 = Math.max(90, W * 0.11), x2 = W - x1;
    const peak = Math.max(28, er.top - br.top - 34);
    const yc = (peak - 0.25 * cy) / 0.75;
    const arc = `M${x1 + 38} ${cy} C ${x1 + (x2 - x1) * 0.2} ${yc}, ${x1 + (x2 - x1) * 0.8} ${yc}, ${x2 - 38} ${cy}`;
    return `<svg class="agcr-bridge" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
      <path class="agcr-arc-bg" d="${arc}"/>
      <path class="agcr-arc" pathLength="1" d="${arc}"/>
      <g class="agcr-pk">${[0, 1, 2].map((k) => `<circle r="4.5"><animateMotion dur="2.6s" begin="${k * 0.87}s" repeatCount="indefinite" path="${arc}"/></circle>`).join("")}</g>
      ${node(x1, cy, ICON_PHONE, "Research online")}${node(x2, cy, ICON_STORE, "In-store purchase")}
    </svg>`;
  }
  function placeBridge() {
    if (!S) return;
    const old = S.band.querySelector(".agcr-bridge");
    if (old) old.remove();
    S.band.insertAdjacentHTML("beforeend", bridgeSVG(S.band, S.h2, S.eyebrow));
    S.arc = S.band.querySelector(".agcr-arc");
    S.pk = S.band.querySelector(".agcr-pk");
    S.nodes = [...S.band.querySelectorAll(".agcr-node")];
  }

  let S = null; // refs for the current section instance

  // ---------- display: the grey card becomes a dark "console" of industry tiles ----------
  const TILE_ICONS = {
    computers: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
    electronics: '<rect width="20" height="15" x="2" y="7" rx="2"/><polyline points="17 2 12 7 7 2"/>',
    fmcg: '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
    furniture: '<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/>',
  };
  const iconFor = (label) => {
    const l = label.toLowerCase();
    const k = l.startsWith("computer") ? "computers" : l.startsWith("electronic") ? "electronics" : l.startsWith("fmcg") ? "fmcg" : l.startsWith("furniture") ? "furniture" : "computers";
    return `<svg class="agcr-tile-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TILE_ICONS[k]}</svg>`;
  };
  function styleTiles(sec, card, rows) {
    card.classList.add("agcr-console");
    rows.forEach((row) => {
      row.classList.add("agcr-tile");
      const badge = row.firstElementChild;           // was the green check circle
      const label = row.querySelector(".font-semibold");
      if (!badge || !label) return;
      // drop the trailing colon on the label ("Computers:" -> "Computers")
      const tn = [...label.childNodes].find((n) => n.nodeType === 3 && /:\s*$/.test(n.nodeValue));
      if (tn) tn.nodeValue = tn.nodeValue.replace(/:\s*$/, "");
      badge.classList.add("agcr-badge");
      badge.insertAdjacentHTML("beforeend", iconFor(label.textContent));
      // the whole tile opens/closes its description (the label is the real toggle)
      row.addEventListener("click", (e) => { if (!label.contains(e.target) && !e.target.closest("[data-agc]")) label.click(); });
      // cursor-following glow (background only: no transforms, so text stays sharp)
      row.addEventListener("pointermove", (e) => {
        const r = row.getBoundingClientRect();
        row.style.setProperty("--mx", e.clientX - r.left + "px");
        row.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  function setup(sec) {
    const band = sec.firstElementChild;                       // dark band
    const content = band.querySelector(".z-10");               // motion wrapper (text)
    const textBox = content && content.firstElementChild;      // motion wrapper (text)
    const cardOuter = sec.children[1];                         // motion wrapper (card)
    const cardInner = cardOuter && cardOuter.firstElementChild; // motion wrapper (card)
    const card = sec.querySelector(".bg-\\[\\#D9D9D9\\]");
    if (!band || !textBox || !card) return null;
    [content, textBox, cardOuter, cardInner].forEach((el) => el && el.setAttribute("data-agcr-m", ""));
    const [eyebrow, h2, sub] = textBox.children;
    band.classList.add("agcr-band");
    const rows = [...card.querySelectorAll(".space-y-6 > .flex")];
    sec.dataset.agcr = "1";
    styleTiles(sec, card, rows);
    return {
      sec, band, eyebrow, h2, sub, card, rows,
      checks: rows.map((r) => r.firstElementChild),
    };
  }

  function render() {
    if (!S || !S.sec.isConnected) return;
    const vh = innerHeight;
    const pb = reduced ? 1 : clamp((vh - S.band.getBoundingClientRect().top) / (vh * 0.8));
    const pc = reduced ? 1 : clamp((vh - S.card.getBoundingClientRect().top) / (vh * 0.65));

    // 1. band unfolds
    const eb = ease(seg(pb, 0, 0.55));
    S.band.style.clipPath = `inset(${((1 - eb) * 30).toFixed(2)}% ${((1 - eb) * 14).toFixed(2)}% round ${((1 - eb) * 48).toFixed(1)}px)`;

    // 2. bridge: nodes pop, arc draws, data dots flow once connected
    S.nodes.forEach((n, i) => {
      const e = back(seg(pb, 0.2 + i * 0.32, 0.38 + i * 0.32));
      n.style.opacity = clamp(e * 1.2).toFixed(3);
      n.style.transform = `scale(${(0.6 + 0.4 * e).toFixed(3)})`;
    });
    const ea = seg(pb, 0.3, 0.72);
    S.arc.style.strokeDashoffset = (1 - ea).toFixed(4);
    S.pk.classList.toggle("on", ea >= 1);

    // 3. texts
    const e1 = ease(seg(pb, 0.12, 0.5)), e2 = ease(seg(pb, 0.22, 0.62)), e3 = ease(seg(pb, 0.34, 0.74));
    if (S.eyebrow) { S.eyebrow.style.opacity = e1; S.eyebrow.style.letterSpacing = `${(0.1 + (1 - e1) * 0.55).toFixed(3)}em`; }
    if (S.h2) {
      S.h2.style.opacity = e2;
      S.h2.style.transform = `translateY(${((1 - e2) * 42).toFixed(1)}px) scale(${(0.92 + 0.08 * e2).toFixed(3)})`;
      S.h2.style.filter = e2 < 1 ? `blur(${((1 - e2) * 8).toFixed(2)}px)` : "";
    }
    if (S.sub) { S.sub.style.opacity = e3; S.sub.style.transform = `translateY(${((1 - e3) * 24).toFixed(1)}px)`; }

    // 4. card + rows
    const ec = ease(seg(pc, 0, 0.62));
    S.card.style.opacity = (0.15 + 0.85 * ec).toFixed(3);
    S.card.style.transform = ec < 1 ? `perspective(1200px) translateY(${((1 - ec) * 90).toFixed(1)}px) rotateX(${((1 - ec) * 26).toFixed(2)}deg) scale(${(0.9 + 0.1 * ec).toFixed(3)})` : "";
    S.rows.forEach((r, i) => {
      const er = ease(seg(pc, 0.3 + i * 0.1, 0.6 + i * 0.1));
      r.style.opacity = er.toFixed(3);
      r.style.transform = er < 1 ? `translateX(${((1 - er) * -44).toFixed(1)}px)` : "";
      const ek = back(seg(pc, 0.36 + i * 0.1, 0.6 + i * 0.1));
      S.checks[i].style.transform = `scale(${Math.max(0, ek).toFixed(3)})`;
    });
  }

  let raf = 0;
  const run = () => { if (raf) { raf = 0; render(); } };
  const req = () => { if (!raf) { raf = requestAnimationFrame(run); setTimeout(run, 60); } };
  addEventListener("scroll", req, { passive: true });
  let rz = 0;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { if (S && S.sec.isConnected) { S.h2.style.transform = ""; placeBridge(); render(); } }, 150); });

  function ensure() {
    if (location.pathname !== "/" && location.pathname !== "/index.html") { S = null; return; }
    const h = [...document.querySelectorAll("main section h2")].find((e) => e.textContent.trim() === "Connected retail");
    const sec = h && h.closest("section");
    if (!sec || (S && S.sec === sec)) return;
    if (sec.dataset.agcr) return;
    S = setup(sec);
    if (!S) return;
    // measure with the heading at rest (no transform) so the nodes line up with it
    S.h2.style.transform = "";
    placeBridge();
    render();
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(ensure, 60); }).observe(document.documentElement, { childList: true, subtree: true });
  ensure();
})();
