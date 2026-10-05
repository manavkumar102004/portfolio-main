(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- Human / AI mode ---------- */
  const modes = {
    human: {
      badge: 'Building in public',
      title: 'Hello, I\'m <span class="n">Manav Kumar.</span>',
      role: 'AI Engineer / Aspiring Developer',
      desc: 'Turning ideas, data and code into intelligent solutions. I\'m building my foundation in Python, SQL and Artificial Intelligence while learning how technology solves real-world problems.',
      cta: 'Explore my work', href: '#projects',
      meta: 'Currently: <b>B.Sc. Artificial Intelligence, 2nd year</b>',
      chipT: 'Manav, 2nd year', chipD: 'Learning by building across Python, SQL and AI.'
    },
    ai: {
      badge: 'AI mode, system online',
      title: 'MANAV<span class="n">.exe</span>',
      role: 'Artificial Intelligence // Online',
      desc: 'Same mind, new perspective. Exploring machine learning, data, automation and intelligent digital experiences.',
      cta: 'See my skills', href: '#skills',
      meta: 'Core stack: <b>Python, SQL, AI, ML</b>',
      chipT: 'Manav.exe', chipD: 'Machine learning, data analysis, Python and SQL.'
    }
  };
  const copy = $('copy'), hBtn = $('hBtn'), aBtn = $('aBtn');
  let colors = [];
  function setMode(m, animate) {
    const d = modes[m] || modes.human; m = modes[m] ? m : 'human';
    body.dataset.mode = m;
    hBtn.setAttribute('aria-pressed', m === 'human');
    aBtn.setAttribute('aria-pressed', m === 'ai');
    $('badge').textContent = d.badge; $('title').innerHTML = d.title; $('role').textContent = d.role;
    $('desc').textContent = d.desc; $('cta').textContent = d.cta; $('cta').href = d.href;
    $('meta').innerHTML = d.meta; $('chipT').textContent = d.chipT; $('chipD').textContent = d.chipD;
    colors = m === 'ai' ? ['66,220,255', '145,77,255'] : ['255,189,104', '255,122,76'];
    if (animate && !reduce) { copy.classList.remove('swap'); void copy.offsetWidth; copy.classList.add('swap'); }
    try { localStorage.setItem('manavMode', m); } catch (e) {}
  }
  hBtn.onclick = () => setMode('human', true);
  aBtn.onclick = () => setMode('ai', true);
  let saved = 'human'; try { saved = localStorage.getItem('manavMode') || 'human'; } catch (e) {}
  setMode(saved, false);

  /* ---------- Mobile menu ---------- */
  const links = $('links'), burger = $('burger');
  const closeMenu = () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.onclick = () => burger.setAttribute('aria-expanded', links.classList.toggle('open'));
  links.addEventListener('click', e => e.target.closest('a') && closeMenu());
  addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

  /* ---------- Reveal on scroll + active nav (IntersectionObserver, no scroll listeners) ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('v'); rv.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px' });
  document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; rv.observe(el); });

  const navLinks = [...links.querySelectorAll('a')];
  const nav = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => nav.observe(s));

  /* ---------- 3D tilt (one delegated listener, transform only, rAF-batched) ---------- */
  if (fine && !reduce) {
    let el = null, ev = null, queued = false;
    const paint = () => {
      queued = false; if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      const k = el.id === 'tilt' ? 16 : 8;
      el.style.transform = `perspective(900px) rotateX(${(-y * k).toFixed(2)}deg) rotateY(${(x * k).toFixed(2)}deg)${el.id === 'tilt' ? '' : ' translateY(-6px)'}`;
    };
    document.addEventListener('pointermove', e => {
      const t = e.target.closest('[data-tilt],#tilt');
      if (t !== el) { if (el) el.style.transform = ''; el = t; }
      if (!el) return;
      ev = e; if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => { if (el) el.style.transform = ''; el = null; });
  }

  /* ---------- Particle network (single canvas, paused when hidden) ---------- */
  const cv = $('fx');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d'); let w, h, dpr, run = true, raf;
    const N = innerWidth < 700 ? 28 : 55, P = [];
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; };
    size(); addEventListener('resize', size, { passive: true });
    for (let i = 0; i < N; i++) P.push({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * 4e-4, vy: (Math.random() - .5) * 4e-4 });
    const tick = () => {
      if (!run) return;
      ctx.clearRect(0, 0, w, h);
      const c = colors[0] || '66,220,255', D = 130 * dpr;
      for (const p of P) { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1; }
      for (let i = 0; i < N; i++) {
        const a = P[i], ax = a.x * w, ay = a.y * h;
        ctx.fillStyle = `rgba(${c},.7)`; ctx.fillRect(ax - 1, ay - 1, 2 * dpr, 2 * dpr);
        for (let j = i + 1; j < N; j++) {
          const b = P[j], dx = ax - b.x * w, dy = ay - b.y * h, d = Math.hypot(dx, dy);
          if (d < D) { ctx.strokeStyle = `rgba(${c},${.18 * (1 - d / D)})`; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    const toggle = on => { if (on && !run) { run = true; tick(); } else if (!on) { run = false; cancelAnimationFrame(raf); } };
    document.addEventListener('visibilitychange', () => toggle(!document.hidden));
    tick();
  }
})();
