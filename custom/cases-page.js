/*
 * /case-studies — redesigned page: "the screening room".
 *   Hero      "Case Studies" / "See Agile AI in action" + two screens tilted in 3D showing
 *             live frames of the two films.
 *   Reel 01   pinned; the "Mobile AI Assistant" film grows from a framed card to full screen
 *             with scroll (from the centre). Plays muted while on screen.
 *   Reel 02   pinned; the "Sales Representative AI Assistant" film straightens out of a 3D
 *             tilt while it grows. "Watch with sound" opens either film with controls.
 *   Coming    a huge "Coming Soon" glides behind while the three client logos arrive one by
 *             one, each tagged "In production".
 * Same video files and logos as the original page. Site font only; no orphan words.
 */
(function () {
  "use strict";
  const FILMS = [
    { n: "01", t: "Mobile AI Assistant", src: "/videos/hardware-chain-stores.mp4", poster: "" },
    { n: "02", t: "Sales Representative AI Assistant", src: "/videos/case-study-demo.mp4", poster: "/videos/case-study-poster.png" },
  ];
  const LOGOS = [
    { src: "/assets/logo-samsung-BE2Wg9Ja.png", alt: "Samsung", cls: "gray" },
    { src: "/assets/logo-tivtaam-LRmzJqyL.png", alt: "Tiv Taam", cls: "" },
    { src: "/assets/logo-bug-Dj2iIq8V.png", alt: "Bug", cls: "gray" },
  ];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const frameSrc = (f) => f.src + "#t=1.2"; // shows a real frame before playback

  const html = () => `
<div class="cs">
  <section class="cs-hero">
    <div class="cs-wrap cs-hero-in">
      <div class="cs-copy">
        <h1 class="cs-h1">Case <span>Studies</span></h1>
        <p class="cs-sub">See Agile AI in action</p>
        <div class="cs-index">${FILMS.map((f, i) => `<a href="#reel-${i}" data-reel="${i}"><b>${f.n}</b>${f.t}</a>`).join("")}</div>
      </div>
      <div class="cs-screens" aria-hidden="true">
        ${FILMS.map((f, i) => `<div class="cs-screen s${i}" data-reel="${i}"><video src="${frameSrc(f)}" ${f.poster ? `poster="${f.poster}"` : ""} muted playsinline preload="metadata"></video><span><b>${f.n}</b>${f.t}</span></div>`).join("")}
      </div>
    </div>
  </section>

  <section class="cs-reel r0" id="reel-0">
    <div class="cs-track"><div class="cs-sticky">
      <video class="cs-ambient" src="${frameSrc(FILMS[0])}" muted playsinline preload="metadata" aria-hidden="true"></video>
      <div class="cs-wrap cs-phone-grid">
        <div class="cs-cap cs-cap-side"><span class="cs-n">${FILMS[0].n}</span><h2 class="cs-h2">${FILMS[0].t}</h2>
          <button type="button" class="cs-watch" data-film="0"><i></i>Watch with sound</button></div>
        <div class="cs-phone cs-frame"><video src="${FILMS[0].src}" muted loop playsinline preload="metadata"></video></div>
      </div>
    </div></div>
  </section>

  <section class="cs-reel r1" id="reel-1">
    <div class="cs-track"><div class="cs-sticky">
      <div class="cs-wide-wrap">
        <div class="cs-frame cs-wide"><video src="${FILMS[1].src}" poster="${FILMS[1].poster}" muted loop playsinline preload="metadata"></video></div>
        <div class="cs-cap cs-cap-below"><div><span class="cs-n">${FILMS[1].n}</span><h2 class="cs-h2">${FILMS[1].t}</h2></div>
          <button type="button" class="cs-watch" data-film="1"><i></i>Watch with sound</button></div>
      </div>
    </div></div>
  </section>

  <section class="cs-soon">
    <div class="cs-soon-track"><div class="cs-soon-sticky">
      <div class="cs-marquee" aria-hidden="true"><span>Coming Soon</span><span>Coming Soon</span></div>
      <div class="cs-wrap">
        <h2 class="cs-soon-h">Coming Soon</h2>
        <div class="cs-logos">${LOGOS.map((l) => `<figure class="cs-logo"><img class="${l.cls}" src="${l.src}" alt="${l.alt}"><figcaption>In production</figcaption></figure>`).join("")}</div>
      </div>
    </div></div>
  </section>
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

  function openFilm(i) {
    const f = FILMS[i];
    const lb = document.createElement("div");
    lb.className = "cs-lb";
    lb.innerHTML = `<div class="cs-lb-in"><button type="button" class="cs-lb-x" aria-label="Close">✕</button><video src="${f.src}" ${f.poster ? `poster="${f.poster}"` : ""} controls autoplay playsinline></video></div>`;
    document.body.appendChild(lb);
    const close = () => { lb.classList.remove("on"); removeEventListener("keydown", onKey); setTimeout(() => lb.remove(), 300); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".cs-lb-x")) close(); });
    addEventListener("keydown", onKey);
    requestAnimationFrame(() => lb.classList.add("on"));
    setTimeout(() => lb.classList.add("on"), 50);
    lb.querySelector(".cs-lb-x").focus();
  }

  let host = null, hidden = [], R = null, io = null;
  const q = (s) => host.querySelector(s), qa = (s) => [...host.querySelectorAll(s)];

  function mount(main) {
    hidden = [...main.children].filter((c) => c.tagName === "SECTION");
    hidden.forEach((s) => { s.style.display = "none"; s.querySelectorAll("video").forEach((v) => v.pause()); });
    host = document.createElement("div");
    host.id = "ag-cases";
    host.innerHTML = html();
    (hidden[hidden.length - 1] || main.lastElementChild).after(host);
    host.querySelectorAll(".cs-h1, .cs-h2").forEach(glue);
    R = {
      hero: q(".cs-hero"), copy: q(".cs-copy"), screens: qa(".cs-screen"),
      reels: qa(".cs-reel").map((sec) => ({ sec, track: sec.querySelector(".cs-track"), frame: sec.querySelector(".cs-frame"), cap: sec.querySelector(".cs-cap"), veil: sec.querySelector(".cs-veil"), ambient: sec.querySelector(".cs-ambient"), video: sec.querySelector(".cs-frame video") })),
      soon: q(".cs-soon-track"), marquee: q(".cs-marquee"), logos: qa(".cs-logo"), soonH: q(".cs-soon-h"),
    };
    host.addEventListener("click", (e) => {
      const w = e.target.closest(".cs-watch");
      if (w) { openFilm(+w.dataset.film); return; }
      const r = e.target.closest("[data-reel]");
      if (r) {
        e.preventDefault();
        const t = R.reels[+r.dataset.reel].track;
        scrollTo({ top: t.getBoundingClientRect().top + scrollY + (t.offsetHeight - innerHeight) * 0.6, behavior: reduced ? "auto" : "smooth" });
      }
    });
    // films play muted only while mostly on screen
    io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target.querySelector("video");
      if (e.isIntersecting && !reduced) v.play().catch(() => {}); else v.pause();
    }), { threshold: 0.45 });
    R.reels.forEach((r) => io.observe(r.frame));
    render();
  }
  function unmount() {
    if (io) io.disconnect();
    if (host) host.remove();
    host = null; R = null; io = null;
    hidden.forEach((s) => { s.style.display = ""; });
    hidden = [];
  }

  function render() {
    if (!R || !host.isConnected) return;
    const vh = innerHeight, narrow = innerWidth < 760;
    // hero: copy lifts away, screens drift and flatten a little
    const h = R.hero.getBoundingClientRect(), hp = clamp(-h.top / h.height);
    if (h.bottom > 0) {
      R.copy.style.transform = `translateY(${(-hp * 70).toFixed(1)}px)`;
      R.copy.style.opacity = (1 - seg(hp, 0.3, 0.85)).toFixed(3);
      R.screens.forEach((s, i) => {
        const ry = (i ? -16 : 18) * (1 - hp * 0.6), y = -hp * (i ? 140 : 70);
        s.style.transform = `translateY(${y.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`;
      });
    }
    // reels
    R.reels.forEach((r, i) => {
      const tr = r.track.getBoundingClientRect(), span = tr.height - vh;
      const p = reduced ? 1 : span > 0 ? clamp(-tr.top / span) : 0;
      const g = ease(seg(p, 0, 0.55));
      if (i === 0) {
        // portrait film: the phone rises and straightens; ambient light swells behind it
        r.frame.style.transform = g < 1 ? `translateY(${((1 - g) * 38).toFixed(2)}vh) rotate(${((1 - g) * -9).toFixed(2)}deg) scale(${(0.8 + 0.2 * g).toFixed(3)})` : "";
        r.ambient.style.opacity = (0.15 + 0.45 * g).toFixed(3);
        const c = ease(seg(p, 0.3, 0.65));
        r.cap.style.opacity = c.toFixed(3);
        r.cap.style.transform = `translateX(${((1 - c) * -40).toFixed(1)}px)`;
        return;
      }
      // wide film: the screen straightens out of a 3D tilt and grows; caption sits below it
      r.frame.style.transform = g < 1 ? `perspective(1400px) rotateX(${(28 * (1 - g)).toFixed(2)}deg) scale(${(0.72 + 0.28 * g).toFixed(3)})` : "";
      const c = ease(seg(p, 0.35, 0.7));
      r.cap.style.opacity = c.toFixed(3);
      r.cap.style.transform = `translateY(${((1 - c) * 30).toFixed(1)}px)`;
    });
    // coming soon
    const s = R.soon.getBoundingClientRect(), sspan = s.height - vh;
    const sp = reduced ? 1 : sspan > 0 ? clamp(-s.top / sspan) : clamp((vh - s.top) / vh);
    R.marquee.style.transform = `translateX(${(-sp * 40).toFixed(2)}%)`;
    R.soonH.style.opacity = ease(seg(sp, 0, 0.25)).toFixed(3);
    R.logos.forEach((l, i) => {
      const e = ease(seg(sp, 0.12 + i * 0.16, 0.38 + i * 0.16));
      l.style.opacity = e.toFixed(3);
      l.style.transform = e < 1 ? `translateY(${((1 - e) * 60).toFixed(1)}px) rotate(${((1 - e) * (i - 1) * 6).toFixed(2)}deg)` : "";
      l.classList.toggle("on", e >= 1);
    });
  }
  let pend = 0;
  const req = () => { if (!pend) { pend = requestAnimationFrame(() => { pend = 0; render(); }); setTimeout(() => { if (pend) { cancelAnimationFrame(pend); pend = 0; render(); } }, 60); } };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);

  function ensure() {
    if (location.pathname !== "/case-studies") { if (host) unmount(); return; }
    if (host && host.isConnected) return;
    const main = document.querySelector("main");
    if (!main) return;
    const orig = [...main.children].find((c) => c.tagName === "SECTION" && /See Agile AI in action/.test(c.textContent));
    if (orig) mount(main);
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(ensure, 40); }).observe(document.documentElement, { childList: true, subtree: true });
  ensure();
})();
