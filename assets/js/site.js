/* Media Art Nation v1 — interactions
   Dependencies (loaded before this file): gsap, ScrollTrigger, Lenis */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const hasGsap = typeof gsap !== "undefined";
  if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* ---------- content protection: block drag, long-press / right-click menus (form fields excepted) ---------- */
  const editable = (el) => !!(el && el.closest && el.closest("input, textarea, select, [contenteditable='true']"));
  document.addEventListener("dragstart", (e) => { if (!editable(e.target)) e.preventDefault(); });
  document.addEventListener("contextmenu", (e) => { if (!editable(e.target)) e.preventDefault(); });
  $$("img, a").forEach((el) => el.setAttribute("draggable", "false"));

  /* ---------- language cookie ---------- */
  $$("[data-lang-switch]").forEach((a) =>
    a.addEventListener("click", () => {
      document.cookie = `lang=${a.dataset.langSwitch}; path=/; max-age=31536000; SameSite=Lax`;
    })
  );
  // Remember the language the visitor is reading so "/" keeps sending them here.
  const current = document.documentElement.lang === "ko" ? "ko" : "en";
  if (!/(?:^|; )lang=/.test(document.cookie)) document.cookie = `lang=${current}; path=/; max-age=31536000; SameSite=Lax`;

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  window.__lenis = lenis;
  const scrollTo = (target) => (lenis ? lenis.scrollTo(target, { offset: -80 }) : target.scrollIntoView({ behavior: "smooth" }));
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const el = a.getAttribute("href").length > 1 && $(a.getAttribute("href"));
      if (el) { e.preventDefault(); scrollTo(el); }
    })
  );

  /* ---------- pinned horizontal track (desktop) ----------
     Created before every other ScrollTrigger: triggers made before a pin
     do not account for its spacer, so this one has to come first. */
  const track = $("[data-pin-track]");
  if (track && hasGsap && !reduced) {
    const inner = $(".track__inner", track);
    const mq = matchMedia("(min-width: 900px)");
    let pinTween = null;
    const getDist = () => inner.scrollWidth - window.innerWidth + 24;
    // Build or tear down the pin by hand: a media-query listener alone proved
    // unreliable, and a stale pin-spacer leaves a tall gap below the section.
    const applyPin = () => {
      if (mq.matches && !pinTween) {
        pinTween = gsap.to(inner, {
          x: () => -getDist(), ease: "none",
          scrollTrigger: {
            trigger: track, start: "top top", end: () => "+=" + (getDist() + 200),
            pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
            refreshPriority: 1, // measure the pin before everything below it
          },
        });
        ScrollTrigger.refresh();
      } else if (!mq.matches && pinTween) {
        pinTween.scrollTrigger && pinTween.scrollTrigger.kill(true);
        pinTween.kill();
        pinTween = null;
        gsap.set(inner, { clearProps: "transform" });
        ScrollTrigger.refresh();
      }
    };
    applyPin();
    mq.addEventListener ? mq.addEventListener("change", applyPin) : mq.addListener(applyPin);
    let pinTo;
    window.addEventListener("resize", () => { clearTimeout(pinTo); pinTo = setTimeout(applyPin, 150); });
    // Belt and braces: if a resize event was missed, reconcile on the next scroll.
    window.addEventListener("scroll", () => { if (mq.matches !== !!pinTween) applyPin(); }, { passive: true });
  }

  /* ---------- preloader ---------- */
  const pre = $(".preloader");
  const finishLoad = () => document.body.classList.remove("is-loading");
  if (pre && hasGsap && !reduced) {
    const quick = sessionStorage.getItem("man-visited");
    sessionStorage.setItem("man-visited", "1");
    const tl = gsap.timeline({ onComplete: () => { pre.remove(); finishLoad(); } });
    const mark = $(".preloader__mark img", pre);
    if (quick) {
      tl.to(pre, { yPercent: -100, duration: 0.7, ease: "power4.inOut", delay: 0.1 });
    } else {
      tl.to(mark, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" })
        .to(mark, { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" }, "+=0.25")
        .to(pre, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.1");
    }
  } else {
    pre && pre.remove();
    finishLoad();
  }

  /* ---------- header ---------- */
  const header = $("[data-header]");
  const cursor = $(".cursor");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("header--scrolled", y > 24);
    // Lenis eases the last few pixels in tiny steps, so read its direction instead of a raw delta.
    const down = lenis ? lenis.direction === 1 : y > lastY + 4;
    const up = lenis ? lenis.direction === -1 : y < lastY - 4;
    if (down && y > 400 && !document.body.classList.contains("menu-open")) header.classList.add("header--hidden");
    else if (up || y <= 400) header.classList.remove("header--hidden");
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Page background + text colour morph between sections: the last section whose
  // top has crossed 55% of the viewport owns the page colour. CSS transitions the
  // tokens (see @property in site.css); the header/cursor chrome follows along.
  const root = document.documentElement;
  const themed = $$("[data-bg]");
  let currentBg = null;
  const setChrome = () => {
    const vh = window.innerHeight * 0.55;
    let sec = themed[0];
    for (const el of themed) { if (el.getBoundingClientRect().top <= vh) sec = el; else break; }
    if (!sec || sec === currentBg) return;
    currentBg = sec;
    root.style.setProperty("--page-bg", sec.dataset.bg);
    root.dataset.bgTheme = sec.dataset.theme || "light";
    const dark = root.dataset.bgTheme !== "light";
    header.classList.toggle("header--on-dark", dark);
    cursor && cursor.classList.toggle("on-dark", dark);
  };
  window.addEventListener("scroll", setChrome, { passive: true });
  window.addEventListener("resize", setChrome);
  setChrome();

  /* ---------- mobile menu ---------- */
  const menu = $("[data-menu]");
  const burger = $("[data-menu-toggle]");
  if (menu && burger) {
    const toggle = (open) => {
      const isOpen = open ?? !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", isOpen);
      menu.setAttribute("aria-hidden", String(!isOpen));
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
      if (lenis) isOpen ? lenis.stop() : lenis.start();
      if (isOpen) header.classList.remove("header--hidden");
      header.classList.toggle("header--on-dark", isOpen || header.classList.contains("header--on-dark"));
      if (!isOpen) setChrome();
    };
    burger.addEventListener("click", () => toggle());
    $$(".menu__link", menu).forEach((l) => l.addEventListener("click", () => toggle(false)));
    window.addEventListener("keydown", (e) => e.key === "Escape" && menu.classList.contains("is-open") && toggle(false));
  }

  /* ---------- reveal ---------- */
  const reveals = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    reveals.forEach((el) => io.observe(el));
    // stagger line reveals
    if (hasGsap) {
      $$('[data-reveal="lines"]').forEach((el) => {
        const inners = $$(".line__inner", el);
        gsap.set(inners, { yPercent: 110, y: 0 });
        ScrollTrigger.create({
          trigger: el, start: "top 88%", once: true,
          onEnter: () => gsap.to(inners, { yPercent: 0, y: 0, duration: 1.1, ease: "power4.out", stagger: 0.09 }),
        });
      });
    }
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- word-by-word statement ---------- */
  $$("[data-words]").forEach((el) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else { const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    const words = $$(".w", el);
    if (!hasGsap || reduced) { words.forEach((w) => w.classList.add("is-on")); return; }
    ScrollTrigger.create({
      trigger: el, start: "top 80%", end: "bottom 45%", scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle("is-on", i < n));
      },
    });
  });

  /* ---------- counters ---------- */
  $$("[data-counter]").forEach((el) => {
    const raw = el.dataset.counter;
    const m = raw.match(/^(\D*)(\d[\d,]*)(.*)$/);
    if (!m || !hasGsap || reduced) return;
    const target = parseInt(m[2].replace(/,/g, ""), 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(obj, {
        v: target, duration: 1.6, ease: "power3.out",
        onUpdate: () => { el.textContent = m[1] + String(Math.round(obj.v)) + m[3]; },
      }),
    });
    el.textContent = m[1] + "0" + m[3];
  });

  /* ---------- parallax ---------- */
  if (hasGsap && !reduced) {
    $$("[data-parallax]").forEach((el) => {
      const f = parseFloat(el.dataset.parallax) || 0.15;
      gsap.fromTo(el, { yPercent: -f * 40 }, {
        yPercent: f * 40, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }

  /* ---------- timeline line draw ---------- */
  if (hasGsap && !reduced) {
    $$("[data-timeline]").forEach((tl) => {
      const line = $("line", tl);
      if (!line) return;
      line.setAttribute("stroke-dasharray", "1000");
      line.setAttribute("stroke-dashoffset", "1000");
      line.classList.add("tl__draw");
      gsap.to(line, { attr: { "stroke-dashoffset": 0 }, duration: 1.8, ease: "power3.inOut", scrollTrigger: { trigger: tl, start: "top 80%", once: true } });
    });
  }

  /* ---------- hero canvas: interactive dot field ---------- */
  const canvas = $("[data-hero-canvas]");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, dots = [], raf = 0, visible = true, t0 = performance.now();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const palette = ["#3d5afe", "#ff5c39", "#7c8cff"];
    const build = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = W < 700 ? 26 : 34;
      dots = [];
      for (let y = gap / 2; y < H; y += gap)
        for (let x = gap / 2; x < W; x += gap)
          dots.push({ x, y, ox: x, oy: y, c: palette[(Math.random() * 3) | 0], s: 1.2 + Math.random() * 1.2, p: Math.random() * Math.PI * 2 });
    };
    const draw = (now) => {
      if (!visible) { raf = 0; return; }
      const t = (now - t0) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      ctx.clearRect(0, 0, W, H);
      const R = W < 700 ? 110 : 170;
      for (const d of dots) {
        const wave = Math.sin(t * 0.8 + d.p + d.ox * 0.004) * 2.5;
        let dx = d.ox - pointer.x, dy = d.oy - pointer.y;
        const dist = Math.hypot(dx, dy);
        let px = 0, py = 0, k = 0;
        if (dist < R) {
          k = 1 - dist / R;
          const push = k * k * 34;
          px = (dx / (dist || 1)) * push; py = (dy / (dist || 1)) * push;
        }
        d.x += (d.ox + px - d.x) * 0.18;
        d.y += (d.oy + py + wave - d.y) * 0.18;
        const size = d.s + k * 3.2;
        ctx.globalAlpha = 0.16 + k * 0.84;
        ctx.fillStyle = k > 0.02 ? d.c : "#15161b";
        ctx.beginPath(); ctx.arc(d.x, d.y, size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(draw); };
    build(); start();
    const hero = canvas.closest(".hero");
    const move = (x, y) => { const r = canvas.getBoundingClientRect(); pointer.tx = x - r.left; pointer.ty = y - r.top; };
    let lastInput = 0;
    hero.addEventListener("pointermove", (e) => { lastInput = performance.now(); move(e.clientX, e.clientY); }, { passive: true });
    hero.addEventListener("pointerleave", () => { if (fine) { pointer.tx = -9999; pointer.ty = -9999; } });
    hero.addEventListener("touchmove", (e) => { const tch = e.touches[0]; if (tch) { lastInput = performance.now(); move(tch.clientX, tch.clientY); } }, { passive: true });
    // Touch devices: when nobody has touched the hero for a while, drift the
    // focus point along a slow orbit so the field still feels alive.
    if (!fine) {
      let a = 0;
      gsap && gsap.ticker.add(() => {
        if (performance.now() - lastInput < 2500) return;
        a += 0.006;
        pointer.tx = W * 0.5 + Math.cos(a) * W * 0.32;
        pointer.ty = H * 0.45 + Math.sin(a * 1.3) * H * 0.22;
      });
    }
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) start(); }).observe(canvas);
    let rto; window.addEventListener("resize", () => { clearTimeout(rto); rto = setTimeout(build, 150); });
  }

  /* ---------- capability image switch ---------- */
  const caps = $$("[data-cap]");
  if (caps.length) {
    const imgs = $$("[data-cap-img]");
    const activate = (key) => {
      imgs.forEach((i) => i.classList.toggle("is-active", i.dataset.capImg === key));
      caps.forEach((c) => c.classList.toggle("is-active", c.dataset.cap === key));
    };
    caps.forEach((c) => {
      c.addEventListener("pointerenter", () => activate(c.dataset.cap));
      if (hasGsap && !fine) ScrollTrigger.create({ trigger: c, start: "top 60%", end: "bottom 60%", onToggle: (s) => s.isActive && activate(c.dataset.cap) });
    });
  }

  /* ---------- before/after compare ---------- */
  $$("[data-compare]").forEach((box) => {
    const handle = $(".compare__handle", box);
    const set = (clientX) => {
      const r = box.getBoundingClientRect();
      const p = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
      box.style.setProperty("--pos", p + "%");
      handle.setAttribute("aria-valuenow", Math.round(p));
    };
    let down = false;
    box.addEventListener("pointerdown", (e) => { down = true; box.setPointerCapture(e.pointerId); set(e.clientX); });
    box.addEventListener("pointermove", (e) => { if (down) set(e.clientX); });
    box.addEventListener("pointerup", () => (down = false));
    box.addEventListener("pointercancel", () => (down = false));
    handle.addEventListener("keydown", (e) => {
      const cur = parseFloat(box.style.getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") box.style.setProperty("--pos", Math.max(0, cur - 4) + "%");
      if (e.key === "ArrowRight") box.style.setProperty("--pos", Math.min(100, cur + 4) + "%");
    });
    // gentle intro sweep
    if (hasGsap && !reduced) {
      const o = { p: 50 };
      ScrollTrigger.create({
        trigger: box, start: "top 70%", once: true,
        onEnter: () => gsap.fromTo(o, { p: 85 }, { p: 45, duration: 1.6, ease: "power3.inOut", onUpdate: () => box.style.setProperty("--pos", o.p + "%") }),
      });
    }
  });

  /* ---------- tilt + magnetic (fine pointers only) ---------- */
  if (fine && !reduced) {
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1200px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(x * 0.18).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- custom cursor ---------- */
  if (cursor && fine && !reduced) {
    document.documentElement.classList.add("cursor-on");
    const label = $(".cursor__label", cursor);
    let cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    const loop = () => {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverSel = "a, button, summary, label, select, [data-cursor]";
    document.addEventListener("pointerover", (e) => {
      const el = e.target.closest(hoverSel);
      const lb = e.target.closest("[data-lightbox]");
      cursor.classList.toggle("is-hover", !!el && !lb);
      cursor.classList.toggle("is-label", !!lb);
      if (lb) label.textContent = document.documentElement.lang === "ko" ? "보기" : "View";
    });
    document.addEventListener("pointerout", (e) => {
      if (!e.relatedTarget) { cursor.classList.remove("is-hover", "is-label"); }
    });
  }

  /* ---------- work filters + lightbox ---------- */
  const filterBar = $("[data-filter-bar]");
  if (filterBar) {
    const items = $$("[data-cat]");
    const apply = (key) => {
      $$(".filter", filterBar).forEach((b) => { const on = b.dataset.filter === key; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", String(on)); });
      items.forEach((it) => it.classList.toggle("is-hidden", key !== "all" && it.dataset.cat !== key));
      hasGsap && ScrollTrigger.refresh();
    };
    filterBar.addEventListener("click", (e) => { const b = e.target.closest(".filter"); b && apply(b.dataset.filter); });
    const hash = location.hash.replace("#", "");
    if (hash && $(`.filter[data-filter="${hash}"]`)) apply(hash);
  }
  const lbRoot = $("[data-lightbox-root]");
  if (lbRoot) {
    const img = $(".lightbox__img", lbRoot);
    const open = (src, alt) => {
      img.src = src; img.alt = alt || "";
      // don't blow small gallery thumbnails up past 2x their real size
      img.style.maxWidth = "";
      const cap = () => { if (img.naturalWidth) img.style.maxWidth = Math.min(1200, img.naturalWidth * 2) + "px"; };
      img.complete ? cap() : img.addEventListener("load", cap, { once: true });
      lbRoot.classList.add("is-open"); lbRoot.setAttribute("aria-hidden", "false"); lenis && lenis.stop();
    };
    const close = () => { lbRoot.classList.remove("is-open"); lbRoot.setAttribute("aria-hidden", "true"); lenis && lenis.start(); };
    $$("[data-lightbox]").forEach((f) => f.addEventListener("click", () => open(f.dataset.lightbox, $("img", f)?.alt)));
    lbRoot.addEventListener("click", (e) => { if (e.target === lbRoot || e.target.closest(".lightbox__close")) close(); });
    window.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  /* ---------- PDF preview (company documents) ----------
     Click on a card opens the file in an in-page viewer (desktop); phones and
     tablets get a new tab, where the native viewer does a better job. The
     download link inside the card keeps working on its own. */
  const pv = $("[data-pdfview]");
  if (pv) {
    const frame = $(".pdfview__frame", pv), title = $(".pdfview__title", pv);
    const openA = $(".pdfview__open", pv), dlA = $(".pdfview__dl", pv), closeBtn = $(".pdfview__close", pv);
    const inline = () => matchMedia("(min-width: 900px)").matches && fine;
    let hideTimer = 0;
    const open = (file, name) => {
      if (!inline()) { window.open(file, "_blank", "noopener"); return; }
      clearTimeout(hideTimer);
      title.textContent = name; openA.href = file; dlA.href = file; frame.title = name;
      frame.src = `${file}#toolbar=0&navpanes=0&view=FitH`;
      pv.classList.add("is-open"); pv.setAttribute("aria-hidden", "false");
      lenis && lenis.stop();
      closeBtn.focus();
    };
    const close = () => {
      if (!pv.classList.contains("is-open")) return;
      pv.classList.remove("is-open"); pv.setAttribute("aria-hidden", "true");
      lenis && lenis.start();
      hideTimer = setTimeout(() => { frame.src = "about:blank"; }, 400);
    };
    $$("[data-doc]").forEach((card) => {
      card.addEventListener("click", (e) => { if (e.target.closest("a")) return; open(card.dataset.doc, card.dataset.docTitle); });
      card.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); open(card.dataset.doc, card.dataset.docTitle); }
      });
    });
    pv.addEventListener("click", (e) => { if (e.target === pv || e.target.closest(".pdfview__close")) close(); });
    window.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  /* ---------- custom dropdown (progressive enhancement of <select>) ---------- */
  $$(".select").forEach((wrap) => {
    const sel = $("select", wrap);
    if (!sel || !sel.id) return;
    sel.tabIndex = -1;
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "select__btn"; btn.id = `${sel.id}-btn`;
    btn.setAttribute("aria-haspopup", "listbox"); btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<span class="select__val"></span><i class="select__chev" aria-hidden="true"></i>';
    const menu = document.createElement("ul");
    menu.className = "select__menu"; menu.id = `${sel.id}-menu`; menu.setAttribute("role", "listbox");
    btn.setAttribute("aria-controls", menu.id);
    const opts = Array.from(sel.options).map((o, i) => {
      const li = document.createElement("li");
      li.className = "select__opt"; li.id = `${sel.id}-opt-${i}`; li.setAttribute("role", "option");
      li.dataset.value = o.value; li.textContent = o.text; li.setAttribute("data-cursor", "");
      menu.appendChild(li);
      return li;
    });
    wrap.append(btn, menu);
    wrap.classList.add("is-enhanced");
    const label = document.querySelector(`label[for="${sel.id}"]`);
    if (label) label.htmlFor = btn.id;
    let active = sel.selectedIndex;
    const isOpen = () => wrap.classList.contains("is-open");
    const render = () => {
      opts.forEach((li, i) => {
        const selected = i === sel.selectedIndex;
        li.classList.toggle("is-selected", selected);
        li.setAttribute("aria-selected", String(selected));
        li.classList.toggle("is-active", i === active);
      });
      $(".select__val", btn).textContent = sel.options[sel.selectedIndex].text;
      menu.setAttribute("aria-activedescendant", opts[active].id);
    };
    const open = (o) => {
      wrap.classList.toggle("is-open", o);
      btn.setAttribute("aria-expanded", String(o));
      if (o) { active = sel.selectedIndex; render(); }
    };
    const choose = (i) => {
      sel.selectedIndex = i;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      active = i; render(); open(false); btn.focus();
    };
    btn.addEventListener("click", () => open(!isOpen()));
    opts.forEach((li, i) => {
      li.addEventListener("click", () => choose(i));
      li.addEventListener("pointerenter", () => { active = i; render(); });
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen()) return open(true);
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length; render();
      } else if ((e.key === "Enter" || e.key === " ") && isOpen()) { e.preventDefault(); choose(active); }
      else if (e.key === "Escape" && isOpen()) { e.preventDefault(); open(false); }
      else if (e.key === "Home" && isOpen()) { active = 0; render(); }
      else if (e.key === "End" && isOpen()) { active = opts.length - 1; render(); }
    });
    document.addEventListener("pointerdown", (e) => { if (isOpen() && !wrap.contains(e.target)) open(false); });
    render();
  });

  /* ---------- contact form ---------- */
  const form = $("[data-form]");
  if (form) {
    const params = new URLSearchParams(location.search);
    const topic = params.get("topic");
    const sel = $('select[name="topic"]', form);
    if (topic && sel && $(`option[value="${topic}"]`, sel)) sel.value = topic;
    const msg = $(".form__msg", form);
    const btnLabel = $("button[type=submit] span", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form__msg";
      let ok = true;
      $$("[required]", form).forEach((f) => {
        const bad = f.type === "checkbox" ? !f.checked : !f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
        f.closest(".field")?.classList.toggle("is-invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) { msg.textContent = msg.dataset.required; msg.classList.add("is-error"); return; }
      btnLabel.textContent = btnLabel.dataset.sending;
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const res = await fetch(form.action, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error("bad status " + res.status);
        form.classList.add("is-sent");
        msg.textContent = msg.dataset.success; msg.classList.add("is-success");
        form.reset();
      } catch (err) {
        const subject = encodeURIComponent(`[${data.topic}] ${data.name} / ${data.company || ""}`);
        const body = encodeURIComponent(`${data.message}\n\n${data.name} · ${data.email} · ${data.phone || ""}`);
        msg.innerHTML = `${msg.dataset.error} <a href="mailto:contact@mediaartnation.studio?subject=${subject}&body=${body}">contact@mediaartnation.studio</a>`;
        msg.classList.add("is-error");
      } finally {
        btnLabel.textContent = btnLabel.dataset.label;
      }
    });
  }

  window.addEventListener("load", () => hasGsap && ScrollTrigger.refresh());
})();
