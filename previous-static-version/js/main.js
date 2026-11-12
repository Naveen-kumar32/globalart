/* =====================================================================
   GLOBALART — playful interactions
   ===================================================================== */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const G = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  const animOn = G && !reduce;
  const COLORS = ["#0095DA", "#FFD43B", "#FF6FAE", "#22C58B", "#8B5CF6", "#FF6B57"];
  const page = document.body.dataset.page;

  if (animOn) { root.classList.add("anim"); gsap.registerPlugin(ScrollTrigger); }

  /* ================= PAGE TRANSITIONS ================= */
  const curtain = $$(".ptrans span");
  const curtainLogo = $(".ptrans__logo");
  function revealPage() {
    try { sessionStorage.removeItem("ga-trans"); } catch (e) {}
    if (!root.classList.contains("is-entering")) return;
    if (!animOn) { root.classList.remove("is-entering"); return; }
    gsap.set(curtain, { scaleY: 1, transformOrigin: "top" });
    root.classList.remove("is-entering");
    gsap.to(curtain, { scaleY: 0, duration: 0.7, ease: "expo.inOut", stagger: 0.06, delay: 0.05 });
  }
  revealPage();

  function isInternalPage(a) {
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return false;
    const href = a.getAttribute("href") || "";
    if (!/\.html(\?|#|$)/.test(href) || /^(https?:|mailto:|tel:)/.test(href)) return false;
    const url = new URL(a.href, location.href);
    return !(url.pathname === location.pathname && url.hash);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    // in-page anchors
    const href = a.getAttribute("href") || "";
    const url = new URL(a.href, location.href);
    if (href.startsWith("#") || (url.pathname === location.pathname && url.hash && !/^https?:/.test(href))) {
      const t = url.hash.length > 1 ? $(url.hash) : null;
      if (t) { e.preventDefault(); closeMenu(); scrollToEl(t); history.replaceState(null, "", url.hash); }
      return;
    }
    if (!isInternalPage(a) || !animOn) return;
    e.preventDefault();
    closeMenu();
    try { sessionStorage.setItem("ga-trans", "1"); } catch (err) {}
    gsap.set(curtain, { transformOrigin: "bottom" });
    gsap.timeline({ onComplete: () => (location.href = a.href) })
      .to(curtain, { scaleY: 1, duration: 0.55, ease: "expo.inOut", stagger: 0.05 })
      .fromTo(curtainLogo, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" }, "-=0.25");
  });
  window.addEventListener("pageshow", (e) => {
    if (e.persisted && animOn) { gsap.set(curtain, { scaleY: 0 }); gsap.set(curtainLogo, { scale: 0 }); }
  });

  /* ================= SMOOTH SCROLL ================= */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (G) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -100, duration: 1.3 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  /* ================= HEADER / MENU / FAB ================= */
  const header = $("#header"), fab = $("#fab"), burger = $("#burger"), mmenu = $("#mmenu");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    if (!mmenu.classList.contains("is-open")) header.classList.toggle("is-hidden", y > lastY && y > 300);
    if (fab) fab.classList.toggle("is-on", y > 700 && page !== "contact");
    lastY = y;
  }, { passive: true });
  function closeMenu() {
    if (!mmenu.classList.contains("is-open")) return;
    mmenu.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false");
    if (lenis) lenis.start(); document.body.style.overflow = "";
  }
  burger.addEventListener("click", () => {
    if (mmenu.classList.contains("is-open")) return closeMenu();
    mmenu.classList.add("is-open"); burger.setAttribute("aria-expanded", "true"); header.classList.remove("is-hidden");
    if (lenis) lenis.stop(); document.body.style.overflow = "hidden";
  });
  addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  /* ================= CURSOR + CLICK SPARKLES ================= */
  const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  if (fine && animOn) {
    const blob = document.createElement("div");
    blob.className = "cursor-blob"; document.body.appendChild(blob);
    const bx = gsap.quickTo(blob, "x", { duration: 0.35, ease: "power3" });
    const by = gsap.quickTo(blob, "y", { duration: 0.35, ease: "power3" });
    addEventListener("pointermove", (e) => { bx(e.clientX); by(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", (e) => blob.classList.toggle("is-hover", !!e.target.closest("a,button,select,input,textarea,summary,.globie,[role=button]")));
    let hue = 0;
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest("input,select,textarea")) return;
      burst(e.clientX, e.clientY, 9);
      blob.style.background = COLORS[hue++ % COLORS.length];
    });
  }
  function burst(x, y, n = 10, chars = ["✦", "★", "●", "♥", "✿"]) {
    if (!animOn) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "spark"; s.textContent = chars[i % chars.length];
      s.style.left = x + "px"; s.style.top = y + "px"; s.style.color = COLORS[i % COLORS.length];
      document.body.appendChild(s);
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.5, d = 40 + Math.random() * 60;
      gsap.fromTo(s, { x: -8, y: -10, scale: 0.4, rotate: 0 }, {
        x: Math.cos(a) * d - 8, y: Math.sin(a) * d - 10, scale: 1 + Math.random() * 0.6, rotate: gsap.utils.random(-180, 180),
        duration: 0.7, ease: "expo.out", onComplete: () => gsap.to(s, { opacity: 0, y: "+=20", duration: 0.35, onComplete: () => s.remove() }),
      });
    }
  }
  function confetti(el) {
    if (!animOn) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 70; i++) {
      const c = document.createElement("i");
      c.style.cssText = `position:fixed;z-index:960;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;width:${8 + Math.random() * 6}px;height:${6 + Math.random() * 10}px;background:${COLORS[i % 6]};border:2px solid #1E1B4B;border-radius:${i % 3 ? 2 : 50}px;pointer-events:none`;
      document.body.appendChild(c);
      gsap.to(c, { x: gsap.utils.random(-320, 320), y: gsap.utils.random(-420, -120), rotate: gsap.utils.random(-720, 720), duration: 1, ease: "expo.out" });
      gsap.to(c, { y: "+=520", opacity: 0, duration: 1.4, delay: 0.9, ease: "power2.in", onComplete: () => c.remove() });
    }
  }

  /* ================= TEXT SPLITTING ================= */
  function splitChars(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentNode.closest("svg") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
        const w = document.createElement("span"); w.className = "word"; w.style.display = "inline-block"; w.style.whiteSpace = "nowrap";
        for (const ch of part) { const c = document.createElement("span"); c.className = "ch"; c.style.display = "inline-block"; c.textContent = ch; w.appendChild(c); }
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return $$(".ch", el);
  }

  /* ================= ENTRANCE + SCROLL ANIMATIONS ================= */
  if (animOn) {
    const heads = [$("#heroTitle"), ...$$("[data-split]")].filter(Boolean);
    heads.forEach((h, idx) => {
      const chars = splitChars(h);
      gsap.from(chars, { yPercent: 120, rotate: () => gsap.utils.random(-25, 25), scale: 0.4, opacity: 0, duration: 1, ease: "elastic.out(1, .55)", stagger: 0.025, delay: 0.25 + idx * 0.1 });
      chars.forEach((c) => c.addEventListener("pointerenter", () => {
        gsap.fromTo(c, { y: 0 }, { y: -18, rotate: gsap.utils.random(-15, 15), duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 });
        c.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTimeout(() => (c.style.color = ""), 900);
      }));
    });

    const inHero = (el) => el.closest(".hero, .phero");
    const fromVars = { "data-up": { y: 60 }, "data-left": { x: -80, rotate: -3 }, "data-right": { x: 80, rotate: 3 }, "data-pop": { scale: 0.5, rotate: -8 } };
    Object.entries(fromVars).forEach(([attr, v]) => {
      $$(`[${attr}]`).forEach((el) => {
        const cfg = { ...v, opacity: 0, duration: 1, ease: attr === "data-pop" ? "back.out(2.2)" : "back.out(1.4)" };
        gsap.set(el, { opacity: 1 });
        if (inHero(el)) gsap.from(el, { ...cfg, delay: 0.6 });
        else gsap.from(el, { ...cfg, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    });
    $$("[data-stagger]").forEach((wrap) => {
      const kids = [...wrap.children];
      gsap.from(kids, { y: 70, rotate: () => gsap.utils.random(-6, 6), scale: 0.9, opacity: 0, duration: 0.9, ease: "back.out(1.6)", stagger: 0.09,
        scrollTrigger: { trigger: wrap, start: "top 85%", once: true } });
    });

    // scribble underlines draw on
    $$(".mark svg path").forEach((p) => {
      const len = p.getTotalLength();
      gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", delay: p.closest(".hero,.phero") ? 1.1 : 0.2,
        scrollTrigger: p.closest(".hero,.phero") ? undefined : { trigger: p, start: "top 85%", once: true } });
    });

    // ribbon reacts to scroll velocity
    $$(".ribbon__track").forEach((t) => {
      ScrollTrigger.create({ onUpdate: (s) => { const v = gsap.utils.clamp(-10, 10, s.getVelocity() / -300); gsap.to(t, { skewX: v, duration: 0.3, overwrite: "auto", onComplete: () => gsap.to(t, { skewX: 0, duration: 0.8, ease: "elastic.out(1,.4)" }) }); } });
    });

    // doodle scroll parallax + mouse parallax
    $$(".doodle, .orbit, .hero__polaroid").forEach((d) => {
      const depth = parseFloat(d.dataset.depth || 0.4);
      if (d.classList.contains("doodle")) gsap.to(d, { yPercent: -60 * depth, ease: "none", scrollTrigger: { trigger: d.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    if (fine) {
      const movers = $$(".hero [data-depth], .phero [data-depth]").map((el) => ({ el, d: parseFloat(el.dataset.depth), qx: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }), qy: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }) }));
      addEventListener("pointermove", (e) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        movers.forEach((m) => { m.qx(nx * 40 * m.d); m.qy(ny * 40 * m.d); });
      }, { passive: true });
    }

    // orbit stickers float
    $$(".orbit").forEach((o, i) => gsap.to(o, { rotate: i % 2 ? 14 : -14, duration: 1.6 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }));

    // hero splat morph
    const splat = $("#splat");
    if (splat) {
      gsap.to(splat, { attr: { d: "M200 22 C 290 30, 372 90, 368 170 C 364 250, 320 344, 230 370 C 150 392, 52 340, 32 260 C 14 180, 56 92, 116 54 C 146 34, 170 20, 200 22Z" }, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.from("#heroArt", { scale: 0.6, rotate: -10, opacity: 0, duration: 1.4, ease: "elastic.out(1,.6)", delay: 0.3 });
      gsap.from(".hero__art .orbit, .hero__polaroid, .bubble", { scale: 0, duration: 0.8, ease: "back.out(2.5)", stagger: 0.12, delay: 1 });
    }

    // course fan spreads out on scroll
    const fan = $("#fan");
    if (fan && innerWidth > 1080) {
      const cards = [...fan.children], mid = (cards.length - 1) / 2;
      cards.forEach((c, i) => gsap.set(c, { rotate: (i - mid) * 7, y: Math.abs(i - mid) * 22 }));
      gsap.from(cards, { x: (i) => (mid - i) * 230, rotate: 0, y: 0, ease: "back.out(1.2)", stagger: 0.04,
        scrollTrigger: { trigger: fan, start: "top 85%", end: "top 35%", scrub: 1 } });
      cards.forEach((c, i) => {
        c.addEventListener("pointerenter", () => gsap.to(c, { y: -36, rotate: 0, scale: 1.06, duration: 0.45, ease: "back.out(2)" }));
        c.addEventListener("pointerleave", () => gsap.to(c, { y: Math.abs(i - mid) * 22, rotate: (i - mid) * 7, scale: 1, duration: 0.6, ease: "back.out(2)" }));
      });
    }

    // stat cards bounce on hover
    $$(".card.stat, .flag, .chip").forEach((el) => el.addEventListener("pointerenter", () => gsap.fromTo(el, { scale: 1 }, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" })));
  }

  /* ================= ROTATING WORDS ================= */
  $$("[data-rotator]").forEach((r) => {
    const words = [...r.children]; let i = 0;
    if (reduce || words.length < 2) return;
    if (G) words.forEach((w, k) => gsap.set(w, { y: 0, yPercent: k === 0 ? 0 : 110 }));
    setInterval(() => {
      const cur = words[i], next = words[(i = (i + 1) % words.length)];
      if (G) {
        gsap.to(cur, { yPercent: -110, rotate: -6, duration: 0.5, ease: "back.in(1.6)" });
        gsap.fromTo(next, { yPercent: 110, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.7, ease: "back.out(1.8)", delay: 0.2 });
      } else { cur.classList.remove("is-on"); next.classList.add("is-on"); }
    }, 2300);
  });

  /* ================= GLOBIE MASCOT ================= */
  const SAYINGS = ["Let’s draw something amazing! 🎨", "Every child is an artist ✨", "Create, don’t copy! 💡", "Colours make me happy 🌈", "Found a centre near you yet? 📍", "Free trial classes are fun! ✏️", "I love your imagination! 💛"];
  let sayI = 0;
  $$(".globie").forEach((g) => {
    const pupils = $$(".globie__pupil", g), glints = $$(".globie__glint", g), eyes = $(".globie__eyes", g), all = $(".globie__all", g), brush = $(".globie__brushg", g);
    const svg = $("svg", g);
    function look() {
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      const sx = r.width / 240;
      pupils.forEach((p, k) => {
        const cx = +p.dataset.cx, cy = +p.dataset.cy;
        const ex = r.left + cx * sx, ey = r.top + cy * sx;
        const a = Math.atan2(pointer.y - ey, pointer.x - ex), dist = Math.min(8, Math.hypot(pointer.x - ex, pointer.y - ey) / 30);
        const nx = cx + Math.cos(a) * dist, ny = cy + Math.sin(a) * dist;
        p.setAttribute("cx", nx.toFixed(1)); p.setAttribute("cy", ny.toFixed(1));
        if (glints[k]) { glints[k].setAttribute("cx", (nx + 3).toFixed(1)); glints[k].setAttribute("cy", (ny - 6).toFixed(1)); }
      });
    }
    if (!reduce) { (function loop() { look(); requestAnimationFrame(loop); })(); }
    if (!animOn) return;
    gsap.to(all, { y: -8, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });
    gsap.to(brush, { rotate: 12, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "226px 100px" });
    (function blink() {
      gsap.timeline({ onComplete: () => setTimeout(blink, 2200 + Math.random() * 2800) })
        .to(eyes, { scaleY: 0.08, duration: 0.08, transformOrigin: "50% 50%" }).to(eyes, { scaleY: 1, duration: 0.12 });
    })();
    const poke = () => {
      gsap.timeline()
        .to(all, { scaleY: 0.82, scaleX: 1.12, duration: 0.12, transformOrigin: "50% 100%" })
        .to(all, { scaleY: 1.12, scaleX: 0.9, y: -40, duration: 0.22, ease: "power2.out" })
        .to(all, { scaleY: 1, scaleX: 1, y: 0, duration: 0.6, ease: "bounce.out" });
      const r = g.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height * 0.3, 14, ["★", "♥", "✦", "🎨", "🌈"]);
      const say = $("#globieSay");
      if (say && g.id === "globie") {
        say.textContent = SAYINGS[sayI++ % SAYINGS.length];
        gsap.fromTo(say, { scale: 0.5, rotate: -8 }, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1,.5)" });
      }
    };
    g.addEventListener("click", poke);
    g.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), poke()));
  });

  /* ================= COUNTERS ================= */
  const fmt = (n, inr) => (inr ? n.toLocaleString("en-IN") : String(n));
  const cio = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target; cio.unobserve(el);
    const to = +el.dataset.to, suf = el.dataset.suffix || "", inr = !!el.dataset.in;
    if (reduce) return (el.textContent = fmt(to, inr) + suf);
    const t0 = performance.now();
    (function tick(t) { const p = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(Math.round(to * e), inr) + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
  }), { threshold: 0.5 });
  $$(".count").forEach((c) => cio.observe(c));

  /* ================= AGE FINDER ================= */
  const range = $("#ageRange");
  if (range) {
    const face = $("#ageFace"), num = $("#ageNum"), res = $("#ageResult");
    const pick = (a) => {
      if (a <= 7) return { face: a <= 6 ? "👶" : "🧒", name: "Foundation 🐣", link: "#foundation", text: "Perfect first step! Joining dots, cut & paste and first colours build fine motor skills and confidence." + (a >= 6 ? " Plus: G-Clay is open for 6+!" : "") };
      if (a <= 9) return { face: "🧒", name: "Basic 🖍️", link: "#basic", text: "Ideas, shapes, backgrounds and action scenes. Kids who finished Foundation step into Pre-Basic first." };
      if (a <= 12) return { face: "👦", name: "Basic → Intermediate 🎭", link: "#tenplus", text: "It’s never too late! Classes meet your child at their level — now for kids 10 & over." };
      return { face: "🧑‍🎨", name: "Intermediate → Advanced 🖌️", link: "#advanced", text: "Human figures, mixed media, sketching, painting & illustration for young creators." };
    };
    const onPage = page === "courses";
    const update = () => {
      const a = +range.value, p = pick(a);
      num.textContent = a; face.textContent = p.face;
      res.innerHTML = `<span class="chip">Suggested start</span><h3>${p.name}</h3><p style="margin:0 0 14px">${p.text}</p><a class="btn btn--sm btn--white" href="${onPage ? p.link : "courses.html" + p.link}">See the course →</a> <a class="btn btn--sm btn--pink" href="contact.html#book">Book free trial</a>`;
      if (animOn) { gsap.fromTo(face, { scale: 0.6, rotate: -15 }, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1,.4)" }); gsap.from(res.children, { y: 14, opacity: 0, stagger: 0.04, duration: 0.4 }); }
    };
    range.addEventListener("input", update); update();
  }

  /* ================= CAROUSEL ================= */
  const car = $("#carousel");
  if (car) {
    let down = false, sx = 0, sl = 0, moved = false;
    car.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = car.scrollLeft; car.classList.add("is-drag"); });
    addEventListener("pointermove", (e) => { if (!down) return; if (Math.abs(e.clientX - sx) > 4) moved = true; car.scrollLeft = sl - (e.clientX - sx); });
    addEventListener("pointerup", () => { down = false; car.classList.remove("is-drag"); });
    car.addEventListener("click", (e) => moved && e.preventDefault(), true);
    $$("[data-car]").forEach((b) => b.addEventListener("click", () => car.scrollBy({ left: +b.dataset.car * (car.firstElementChild.offsetWidth + 24), behavior: "smooth" })));
  }

  /* ================= FAQ ================= */
  $$(".qa").forEach((d) => {
    const s = $("summary", d), body = $(".qa__body", d);
    s.addEventListener("click", (e) => {
      if (!animOn) return;
      e.preventDefault();
      if (d.open) gsap.to(body, { height: 0, opacity: 0, duration: 0.35, ease: "power2.in", onComplete: () => { d.open = false; gsap.set(body, { clearProps: "all" }); ScrollTrigger.refresh(); } });
      else { d.open = true; gsap.from(body, { height: 0, opacity: 0, duration: 0.55, ease: "back.out(1.2)", onComplete: () => ScrollTrigger.refresh() }); gsap.fromTo($(".q-emoji", d), { scale: 0.4, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1,.4)" }); }
    });
  });

  /* ================= LEVEL MAP PATH ================= */
  const lm = $("#levelmap");
  if (lm) {
    const svg = $(".levelmap__path", lm), bg = $(".bg", svg), fg = $(".fg", svg);
    let st;
    const draw = () => {
      if (innerWidth <= 860) return;
      const box = lm.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const pts = $$(".stop__badge", lm).map((b) => { const r = b.getBoundingClientRect(); return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]; });
      if (pts.length < 2) return;
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2; d += ` C${x0},${my} ${x1},${my} ${x1},${y1}`; }
      bg.setAttribute("d", d); fg.setAttribute("d", d);
      const len = fg.getTotalLength();
      fg.style.strokeDasharray = len;
      if (animOn) {
        if (st) st.kill();
        gsap.set(fg, { strokeDashoffset: len });
        st = gsap.to(fg, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: lm, start: "top 60%", end: "bottom 70%", scrub: 0.6 } }).scrollTrigger;
      } else fg.style.strokeDashoffset = 0;
    };
    addEventListener("load", draw); setTimeout(draw, 300);
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(draw, 200); });
  }

  /* ================= CENTRE DATA + LOCATOR ================= */
  const DATA = window.GA_CENTRES || null;
  const params = new URLSearchParams(location.search);
  const sortA = (a, b) => a.localeCompare(b);
  const opt = (v, t = v) => { const o = document.createElement("option"); o.value = v; o.textContent = t; return o; };
  const allCentres = DATA ? Object.entries(DATA).flatMap(([state, cities]) => Object.entries(cities).flatMap(([city, list]) => list.map((c) => ({ ...c, state, city })))) : [];

  function bindLocator(form, onChange) {
    const sState = $('[data-loc="state"]', form), sCity = $('[data-loc="city"]', form), sArea = $('[data-loc="area"]', form);
    if (!sState || !DATA) return null;
    const ph = (sel) => sel.options[0].textContent;
    const phC = ph(sCity), phA = ph(sArea);
    Object.keys(DATA).sort(sortA).forEach((s) => sState.appendChild(opt(s, `${s} (${Object.values(DATA[s]).flat().length})`)));
    const bump = (sel) => { const w = sel.closest(".select"); if (!w || reduce) return; w.classList.remove("is-bump"); void w.offsetWidth; w.classList.add("is-bump"); };
    const fillCities = () => {
      sCity.innerHTML = ""; sCity.appendChild(opt("", phC)); sArea.innerHTML = ""; sArea.appendChild(opt("", phA)); sArea.disabled = true;
      const st = DATA[sState.value];
      sCity.disabled = !st;
      if (st) { Object.keys(st).sort(sortA).forEach((c) => sCity.appendChild(opt(c, `${c} (${st[c].length})`))); bump(sCity); }
    };
    const fillAreas = () => {
      sArea.innerHTML = ""; sArea.appendChild(opt("", phA));
      const list = DATA[sState.value] && DATA[sState.value][sCity.value];
      sArea.disabled = !list;
      if (list) { [...new Set(list.map((c) => c.area))].sort(sortA).forEach((a) => sArea.appendChild(opt(a))); bump(sArea); }
    };
    sState.addEventListener("change", () => { fillCities(); onChange && onChange(); });
    sCity.addEventListener("change", () => { fillAreas(); onChange && onChange(); });
    sArea.addEventListener("change", () => onChange && onChange());
    const set = (s, c, a) => {
      if (s && DATA[s]) { sState.value = s; fillCities(); }
      if (c && DATA[s] && DATA[s][c]) { sCity.value = c; fillAreas(); }
      if (a) sArea.value = a;
    };
    set(params.get("state"), params.get("city"), params.get("area"));
    return { sState, sCity, sArea, set, get: () => ({ state: sState.value, city: sCity.value, area: sArea.value }) };
  }

  // Home quick finder
  const qf = $("#quickFinder");
  if (qf) {
    bindLocator(qf);
    qf.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new URLSearchParams();
      ["state", "city", "area"].forEach((k) => { const v = $(`[data-loc="${k}"]`, qf).value; if (v) q.set(k, v); });
      const a = document.createElement("a"); a.href = "centres.html" + (q.toString() ? "?" + q : ""); document.body.appendChild(a); a.click(); a.remove();
    });
  }

  const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const phones = (p) => (p || "").split(/[\/;,]/).map((x) => x.trim()).filter((x) => x.replace(/\D/g, "").length >= 8);

  // Centres page
  const locForm = $("#locator");
  if (locForm && DATA) {
    const results = $("#results"), title = $("#resultsTitle"), count = $("#resultsCount"), more = $("#loadMore"), text = $("#lcText"), chips = $("#stateChips");
    const PAGE = 12; let shown = PAGE, list = [];
    const loc = bindLocator(locForm, () => { shown = PAGE; render(true); syncUrl(); });
    // state chips
    const allBtn = document.createElement("button"); allBtn.type = "button"; allBtn.className = "chip"; allBtn.dataset.state = ""; allBtn.innerHTML = `🌏 All <em>${allCentres.length}</em>`; chips.appendChild(allBtn);
    Object.keys(DATA).sort(sortA).forEach((s) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.dataset.state = s; b.innerHTML = `${esc(s)} <em>${Object.values(DATA[s]).flat().length}</em>`; chips.appendChild(b); });
    chips.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; loc.sState.value = b.dataset.state; loc.sState.dispatchEvent(new Event("change")); });

    function syncUrl() { const q = new URLSearchParams(); const v = loc.get(); Object.entries(v).forEach(([k, x]) => x && q.set(k, x)); history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "")); }
    function card(c) {
      const ph = phones(c.phone);
      const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${c.address || c.area}, ${c.city}, ${c.state}`);
      const book = `contact.html?state=${encodeURIComponent(c.state)}&city=${encodeURIComponent(c.city)}&area=${encodeURIComponent(c.area)}#book`;
      return `<article class="card card--hover centre"><div class="centre__city"><span class="chip">📍 ${esc(c.city)}</span><span class="chip">${esc(c.state)}</span></div>
        <h3>${esc(c.area)}</h3><p class="centre__addr">${esc(c.address)}</p>${c.contact ? `<p class="centre__who">👩‍🏫 ${esc(c.contact)}</p>` : ""}
        <div class="centre__actions">${ph[0] ? `<a class="btn btn--sm btn--white" href="tel:${ph[0].replace(/[^\d+]/g, "")}">📞 ${esc(ph[0])}</a>` : ""}
        <a class="btn btn--sm btn--white" href="${maps}" target="_blank" rel="noopener">🗺️ Directions</a><a class="btn btn--sm btn--pink" href="${book}">✏️ Book trial</a></div></article>`;
    }
    function render(animate) {
      const v = loc.get(), q = text.value.trim().toLowerCase();
      list = allCentres.filter((c) => (!v.state || c.state === v.state) && (!v.city || c.city === v.city) && (!v.area || c.area === v.area)
        && (!q || `${c.area} ${c.address} ${c.city} ${c.state} ${c.contact}`.toLowerCase().includes(q)));
      const where = v.area ? `${v.area}, ${v.city}` : v.city ? `${v.city}, ${v.state}` : v.state || (q ? `“${text.value.trim()}”` : "");
      title.textContent = where ? `Centres in ${where}` : "All Globalart centres";
      count.textContent = `${list.length} centre${list.length === 1 ? "" : "s"}`;
      $$("button", chips).forEach((b) => b.classList.toggle("is-on", b.dataset.state === v.state));
      if (!list.length) {
        results.innerHTML = `<div class="empty card card--sun" style="grid-column:1/-1"><span class="big">🔍</span><h3 class="h3">No centres match that search</h3><p>Try another area, or <a class="link-arrow" href="contact.html">contact our team</a> — we’ll help you find the nearest one.</p></div>`;
        more.hidden = true; return;
      }
      results.innerHTML = list.slice(0, shown).map(card).join("");
      more.hidden = list.length <= shown;
      if (animate && animOn) gsap.from(results.children, { y: 50, scale: 0.92, rotate: () => gsap.utils.random(-5, 5), opacity: 0, duration: 0.6, ease: "back.out(1.6)", stagger: 0.04, clearProps: "transform,opacity" });
      if (G) ScrollTrigger.refresh();
    }
    locForm.addEventListener("submit", (e) => { e.preventDefault(); render(true); scrollToEl($(".results__head")); });
    let tt; text.addEventListener("input", () => { clearTimeout(tt); tt = setTimeout(() => { shown = PAGE; render(true); }, 220); });
    $("#lcReset").addEventListener("click", () => { text.value = ""; loc.sState.value = ""; loc.sState.dispatchEvent(new Event("change")); });
    more.addEventListener("click", () => {
      const before = shown; shown += PAGE; render(false);
      if (animOn) gsap.from([...results.children].slice(before), { y: 40, opacity: 0, duration: 0.5, ease: "back.out(1.6)", stagger: 0.04, clearProps: "transform,opacity" });
    });
    render(false);
  }

  /* ================= FORMS (mailto) ================= */
  const trial = $("#trialForm");
  let trialLoc = null;
  if (trial) {
    const box = $("#tfCentre");
    trialLoc = bindLocator(trial, showCentre);
    function showCentre() {
      const v = trialLoc.get();
      const m = v.area && DATA[v.state][v.city].filter((c) => c.area === v.area);
      if (!m || !m.length) { box.hidden = true; return; }
      box.hidden = false;
      box.innerHTML = m.map((c) => `<b style="font-family:var(--f-head)">🎨 Globalart ${esc(c.area)}</b><br/><span style="font-size:15px">${esc(c.address)}</span>${c.phone ? `<br/><a class="link-arrow" href="tel:${phones(c.phone)[0]?.replace(/[^\d+]/g, "") || ""}">📞 ${esc(c.phone)}</a>` : ""}`).join("<hr style='border:0;border-top:2px dashed rgba(30,27,75,.2)'/>");
      if (animOn) gsap.fromTo(box, { scale: 0.9, rotate: -2 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" });
    }
    showCentre();
  }

  $$("form[data-mailto]").forEach((f) => {
    const note = $(".form__note", f);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("input, select, textarea", f).forEach((el) => {
        const bad = !el.disabled && !el.checkValidity() || (el.required && el.disabled);
        const w = el.closest(".field") || el.closest(".select");
        if (w) w.classList.toggle("is-bad", bad);
        if (bad) ok = false;
      });
      if (!ok) {
        note.className = "form__note err"; note.textContent = "Oops! Please fill in the highlighted fields 🙂";
        if (animOn) gsap.fromTo(f, { x: -12 }, { x: 0, duration: 0.7, ease: "elastic.out(1,.25)" });
        return;
      }
      const lines = [];
      new FormData(f).forEach((v, k) => v && lines.push(`${k}: ${v}`));
      if (f === trial && !$("#tfCentre").hidden) lines.push("", "Centre details:", $("#tfCentre").innerText);
      const body = `${f.dataset.subject}\n\n${lines.join("\n")}\n\nSent from the Globalart website`;
      location.href = `mailto:${f.dataset.mailto}?subject=${encodeURIComponent(f.dataset.subject)}&body=${encodeURIComponent(body)}`;
      f.classList.add("is-sent");
      confetti(f);
      if (animOn) gsap.from($(".success", f), { scale: 0.7, opacity: 0, duration: 0.7, ease: "back.out(2)" });
    });
    $$("input, select, textarea", f).forEach((el) => el.addEventListener("input", () => { const w = el.closest(".field") || el.closest(".select"); w && w.classList.remove("is-bad"); }));
  });

  addEventListener("load", () => G && ScrollTrigger.refresh());
})();
