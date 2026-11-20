/*
 * Site-wide rule: every list and every long text sits behind a dropdown.
 * - A list (ul/ol), or a text block of MIN_CHARS+ characters, starts closed.
 * - If a short heading/label sits right above it (h3–h6, or a short p/span), that
 *   element becomes the toggle (chevron added). Otherwise a small "Read more" /
 *   "Show all N" button is inserted above it.
 * - Skipped: nav, footer, forms, page heroes (the block holding the H1), and the
 *   custom Live Assist section (#ag-scale), which has its own dropdowns.
 * Works on top of the compiled build without moving React's nodes: it only adds
 * data-attributes and inserts toggle buttons. When porting to the Lovable source,
 * replace this with a real <Collapsible>/<Accordion> around each list and long text.
 */
(function () {
  "use strict";
  const MIN_CHARS = 90;
  const LABEL_MAX = 60;
  const SKIP = "nav, footer, form, #ag-scale, #ag-sol, #ag-how, #ag-contact, #ag-cases, [data-agc], [data-agt]";
  let uid = 0;

  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join("").trim();
  const visible = (el) => el.getClientRects().length > 0;

  // Page hero: the H1 and its subtitle live in the same small container.
  function inHero(el) {
    let n = el.parentElement;
    for (let i = 0; i < 2 && n; i++, n = n.parentElement) if (n.querySelector("h1")) return true;
    return false;
  }

  function isLabel(el) {
    if (!el || el.dataset.agt || el.dataset.agc) return false;
    if (el.querySelector("a, button, img, svg, ul, ol")) return false;
    const t = el.innerText.trim();
    if (!t || t.length > LABEL_MAX) return false;
    return /^H[3-6]$/.test(el.tagName) || /^(P|SPAN|STRONG|B)$/.test(el.tagName);
  }

  function findTargets(main) {
    const out = [];
    main.querySelectorAll("ul, ol").forEach((l) => {
      if (l.closest(SKIP) || l.parentElement.closest("ul, ol") || !visible(l) || inHero(l)) return;
      out.push({ el: l, kind: "list" });
    });
    main.querySelectorAll("p, span, div").forEach((e) => {
      if (e.closest(SKIP) || e.closest("ul, ol, a[data-agt], button") || !visible(e) || inHero(e)) return;
      const len = e.tagName === "P" ? e.innerText.trim().length : ownText(e).length;
      if (len >= MIN_CHARS) out.push({ el: e, kind: "text" });
    });
    return out;
  }

  function attach({ el, kind }) {
    if (el.dataset.agc) return;
    const prev = el.previousElementSibling;
    let trig;
    if (!el.closest("a") && isLabel(prev)) {
      trig = prev;
      trig.setAttribute("role", "button");
      trig.tabIndex = 0;
    } else {
      trig = document.createElement("button");
      trig.type = "button";
      trig.className = "ag-more";
      trig.dataset.lbl = kind === "list" ? `Show all ${el.children.length}` : "Read more";
      trig.innerHTML = `<span>${trig.dataset.lbl}</span>`;
      el.before(trig);
    }
    if (!el.id) el.id = "agc" + ++uid;
    trig.dataset.agt = "1";
    trig.setAttribute("aria-controls", el.id);
    trig.setAttribute("aria-expanded", "false");
    el.dataset.agc = "closed";
  }

  // Open and close both animate height, spacing and opacity, so closing is as smooth as opening.
  const DUR = 340, EASE = "cubic-bezier(.2,.7,.2,1)";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BOX = ["marginTop", "marginBottom", "paddingTop", "paddingBottom"];
  function toggle(t) {
    const el = document.getElementById(t.getAttribute("aria-controls"));
    if (!el) return;
    const open = el.dataset.agc !== "open";
    t.setAttribute("aria-expanded", String(open));
    if (t.classList.contains("ag-more")) t.firstElementChild.textContent = open ? "Show less" : t.dataset.lbl;
    if (el._agAnim) { el._agAnim.onfinish = null; el._agAnim.cancel(); el._agAnim = null; }
    if (reduced || !el.animate) { el.dataset.agc = open ? "open" : "closed"; return; }

    if (open) el.dataset.agc = "open"; else el.dataset.agc = "closing"; // still displayed while it animates out
    const cs = getComputedStyle(el);
    const full = { height: el.getBoundingClientRect().height + "px", opacity: 1, transform: "none" };
    const zero = { height: "0px", opacity: 0, transform: "translateY(-6px)" };
    BOX.forEach((k) => { full[k] = cs[k]; zero[k] = "0px"; });
    el.style.overflow = "hidden";
    const a = el.animate(open ? [zero, full] : [full, zero], { duration: open ? DUR : DUR * 0.9, easing: EASE });
    el._agAnim = a;
    a.onfinish = () => {
      el._agAnim = null;
      el.style.overflow = "";
      if (!open) el.dataset.agc = "closed";
    };
  }

  // Capture phase so a toggle inside a link card opens the dropdown instead of the link.
  document.addEventListener("click", (e) => {
    const t = e.target.closest && e.target.closest("[data-agt]");
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    toggle(t);
  }, true);
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[data-agt][role="button"]')) {
      e.preventDefault();
      toggle(e.target);
    }
  });

  function scan() {
    const main = document.querySelector("main");
    if (main) findTargets(main).forEach(attach);
  }
  let timer = 0;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(scan, 120); };
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener("resize", schedule);
  schedule();
})();
