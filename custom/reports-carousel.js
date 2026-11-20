/*
 * Home "Intelligent Retail / Latest Business Reports" — 3D coverflow carousel.
 * - Drag / swipe to spin (with inertia + snap), horizontal trackpad scroll, arrow keys,
 *   prev/next buttons and dots. Clicking a side card brings it to the front; the front
 *   card's link (and its "Read more" dropdown) work as before.
 * - Gentle auto-advance while in view; pauses on hover, focus, drag, or an open dropdown.
 * Layered on the compiled build: the grid becomes the stage, the existing cards are
 * positioned with transforms (no React nodes moved). Port as a component later.
 */
(function () {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CHEV = (d) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  let C = null;

  function setup(grid) {
    const cells = [...grid.children].filter((c) => c.querySelector("a"));
    const N = cells.length;
    if (N < 2) return null;
    grid.classList.add("agrc-stage");
    const head = grid.previousElementSibling; // "Intelligent Retail / Latest Business Reports"
    if (head) head.setAttribute("data-agrc-head", "");
    grid.tabIndex = 0;
    grid.setAttribute("role", "region");
    grid.setAttribute("aria-roledescription", "carousel");
    grid.setAttribute("aria-label", "Latest Business Reports");
    cells.forEach((c) => {
      c.querySelector("a").draggable = false;
      c.querySelectorAll("img").forEach((i) => { i.draggable = false; });
    });
    const ctrl = document.createElement("div");
    ctrl.className = "agrc-ctrl";
    ctrl.innerHTML = `<button type="button" class="agrc-btn" data-d="-1" aria-label="Previous report">${CHEV("m15 18-6-6 6-6")}</button>
      <div class="agrc-dots">${cells.map((_, i) => `<button type="button" data-i="${i}" aria-label="Report ${i + 1}"></button>`).join("")}</div>
      <button type="button" class="agrc-btn" data-d="1" aria-label="Next report">${CHEV("m9 18 6-6-6-6")}</button>`;
    const hint = document.createElement("div");
    hint.className = "agrc-hint";
    hint.textContent = "Drag to spin";
    grid.after(ctrl);
    ctrl.after(hint);
    const c = { grid, cells, N, ctrl, hint, anchors: cells.map((x) => x.querySelector("a")), dots: [...ctrl.querySelectorAll(".agrc-dots button")],
      rot: 0, target: null, spacing: 300, anim: 0, drag: null, justDragged: false, hover: false, inView: false, auto: 0, wheelT: 0 };
    bind(c);
    return c;
  }

  function layout(c) {
    const W = Math.min(400, c.grid.clientWidth * 0.82);
    c.grid.style.setProperty("--agrc-w", W + "px");
    c.spacing = innerWidth < 760 ? W * 0.64 : W * 0.88;
    const h = Math.max(...c.anchors.map((a) => a.offsetHeight));
    c.grid.style.setProperty("--agrc-h", h + 30 + "px");
  }

  const front = (c) => ((Math.round(c.rot) % c.N) + c.N) % c.N;

  function render(c) {
    c.cells.forEach((cell, i) => {
      let pos = (((i - c.rot) % c.N) + c.N) % c.N;
      if (pos > c.N / 2) pos -= c.N;
      const a = Math.abs(pos);
      const el = c.anchors[i];
      // At rest the front card gets no transform at all, so its text renders perfectly sharp.
      if (a < 0.0005) el.style.transform = "none"; else el.style.transform = `translateX(${(pos * c.spacing).toFixed(1)}px) translateZ(${(-a * 240).toFixed(1)}px) rotateY(${(-pos * 38).toFixed(2)}deg) scale(${(1 - a * 0.06).toFixed(3)})`;
      el.style.opacity = (a <= 1 ? 1 : Math.max(0, 1 - (a - 1) * 2)).toFixed(3);
      cell.style.zIndex = String(100 - Math.round(a * 10));
      cell.classList.toggle("agrc-side", a > 0.5);
      cell.setAttribute("aria-hidden", a > 0.5 ? "true" : "false");
    });
    const f = front(c);
    c.dots.forEach((d, i) => d.classList.toggle("on", i === f));
  }

  // Next frame via rAF, with a timer fallback for throttled/background tabs.
  function nextFrame(fn) { let done = false; const go = () => { if (!done) { done = true; fn(); } }; requestAnimationFrame(go); setTimeout(go, 34); }
  function animate(c) {
    if (c.anim) return;
    const token = (c.anim = (c.anim || 0) + Math.random() + 1);
    const step = () => {
      if (c.anim !== token) return;
      const d = c.target - c.rot;
      if (Math.abs(d) < 0.0008) { c.rot = c.target; c.target = null; c.anim = 0; render(c); return; }
      c.rot += d * (reduced ? 1 : 0.14);
      render(c);
      nextFrame(step);
    };
    nextFrame(step);
  }
  function goTo(c, rotTarget) { c.target = rotTarget; animate(c); }
  function goIndex(c, k) {
    let delta = (((k - c.rot) % c.N) + c.N) % c.N;
    if (delta > c.N / 2) delta -= c.N;
    goTo(c, Math.round(c.rot + delta));
  }
  const stopAnim = (c) => { c.anim = 0; c.target = null; };

  function bind(c) {
    const g = c.grid;
    g.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      stopAnim(c);
      c.drag = { x0: e.clientX, r0: c.rot, lastX: e.clientX, lastT: performance.now(), v: 0, active: false, id: e.pointerId };
    });
    g.addEventListener("pointermove", (e) => {
      const d = c.drag;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x0;
      if (!d.active && Math.abs(dx) > 6) { d.active = true; g.setPointerCapture(e.pointerId); g.classList.add("dragging"); }
      if (!d.active) return;
      const now = performance.now(), dt = Math.max(1, now - d.lastT);
      d.v = 0.8 * d.v + 0.2 * (-(e.clientX - d.lastX) / c.spacing / dt);
      d.lastX = e.clientX; d.lastT = now;
      c.rot = d.r0 - dx / c.spacing;
      render(c);
    });
    const end = (e) => {
      const d = c.drag;
      if (!d || (e && e.pointerId !== d.id)) return;
      c.drag = null;
      g.classList.remove("dragging");
      if (!d.active) return;
      c.justDragged = true;
      setTimeout(() => { c.justDragged = false; }, 60);
      goTo(c, Math.round(c.rot + d.v * 260)); // fling: velocity carries it on, then it snaps
    };
    g.addEventListener("pointerup", end);
    g.addEventListener("pointercancel", end);

    // Window-capture runs before the site's own handlers: swallow the click after a drag,
    // and turn a click on a side card into "bring it to the front".
    window.addEventListener("click", (e) => {
      if (!g.isConnected || !g.contains(e.target)) return;
      if (c.justDragged) { e.preventDefault(); e.stopPropagation(); return; }
      const cell = c.cells.find((x) => x.contains(e.target));
      if (cell && cell.classList.contains("agrc-side")) { e.preventDefault(); e.stopPropagation(); goIndex(c, c.cells.indexOf(cell)); }
    }, true);

    g.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      stopAnim(c);
      c.rot += e.deltaX / c.spacing;
      render(c);
      clearTimeout(c.wheelT);
      c.wheelT = setTimeout(() => goTo(c, Math.round(c.rot)), 140);
    }, { passive: false });

    g.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(c, Math.round(c.target ?? c.rot) + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(c, Math.round(c.target ?? c.rot) - 1); }
    });
    c.ctrl.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.d) goTo(c, Math.round(c.target ?? c.rot) + +b.dataset.d);
      if (b.dataset.i) goIndex(c, +b.dataset.i);
    });

    g.addEventListener("pointerenter", () => { c.hover = true; });
    g.addEventListener("pointerleave", () => { c.hover = false; });
    new IntersectionObserver((es) => { c.inView = es[0].isIntersecting; }, { threshold: 0.4 }).observe(g);
    new ResizeObserver(() => { layout(c); render(c); }).observe(g);
    c.anchors.forEach((a) => new ResizeObserver(() => layout(c)).observe(a));
    c.auto = setInterval(() => {
      if (!g.isConnected) { clearInterval(c.auto); return; }
      const busy = c.hover || c.drag || c.anim || document.activeElement === g || g.contains(document.activeElement) || g.querySelector('[data-agc="open"]');
      if (c.inView && !busy && !reduced && !document.hidden) goTo(c, Math.round(c.rot) + 1);
    }, 5000);
  }

  function ensure() {
    if (location.pathname !== "/" && location.pathname !== "/index.html") return;
    const h = [...document.querySelectorAll("main section h2")].find((e) => e.textContent.trim() === "Latest Business Reports");
    const grid = h && h.closest("section").querySelector(".grid");
    if (!grid || grid.classList.contains("agrc-stage")) return;
    C = setup(grid);
    if (!C) return;
    layout(C);
    render(C);
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(ensure, 60); }).observe(document.documentElement, { childList: true, subtree: true });
  ensure();
})();
