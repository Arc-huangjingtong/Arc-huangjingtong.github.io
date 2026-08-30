/* ZODIAC — interactive canvas star map
   A generative twinkling star field + twelve stylised constellations arranged
   on a slowly rotating ecliptic wheel, with cursor parallax, shooting stars,
   hover/select highlighting, and a gentle camera nudge toward a chosen sign.
   Reduced motion => a single static frame, no drift, no shooting stars. */
(() => {
  'use strict';
  const docEl = document.documentElement;
  docEl.classList.add('js'); // (also set inline in <head>; harmless to repeat)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;
  const TAU = Math.PI * 2;

  /* Reveal the hero FIRST — scheduled before any risky work so a later throw
     can never leave the hero blank (compositor-driven via the .loaded class). */
  const heroEarly = document.querySelector('.hero');
  if (heroEarly) {
    requestAnimationFrame(() => requestAnimationFrame(() => heroEarly.classList.add('loaded')));
    setTimeout(() => heroEarly.classList.add('loaded'), 400); // hard failsafe
  }

  /* ---------- the twelve houses: meta + stylised geometry ----------
     nodes are local offsets (world units) around each sign's anchor on the
     ecliptic ring; edges connect node indices into the asterism. */
  const SIGNS = [
    { name:'Aries', latin:'勇气是爱情的开始', glyph:'♈', roman:'I', dates:'愿我们的爱，如烈火般炽热', element:'fire', depth:0.60,
      nodes:[[-0.11,0.04],[-0.03,-0.02],[0.05,-0.03],[0.12,0.03]], edges:[[0,1],[1,2],[2,3]] },
    { name:'Taurus', latin:'陪伴是最长情的告白', glyph:'♉', roman:'II', dates:'愿我们的爱，如大地般坚实', element:'earth', depth:0.52,
      nodes:[[-0.12,0.07],[-0.05,0.01],[0.0,-0.02],[0.06,-0.08],[0.12,-0.13],[0.05,0.05]], edges:[[0,1],[1,2],[2,3],[3,4],[2,5]] },
    { name:'Gemini', latin:'你是我灵魂的另一半', glyph:'♊', roman:'III', dates:'愿我们的爱，如清风般自由', element:'air', depth:0.66,
      nodes:[[-0.06,-0.11],[-0.05,0.0],[-0.04,0.11],[0.05,-0.11],[0.06,0.0],[0.07,0.11]], edges:[[0,1],[1,2],[3,4],[4,5],[1,4]] },
    { name:'Cancer', latin:'家是有你在的地方', glyph:'♋', roman:'IV', dates:'愿我们的爱，如深海般温柔', element:'water', depth:0.44,
      nodes:[[0,-0.10],[0,0.01],[-0.09,0.08],[0.09,0.07]], edges:[[0,1],[1,2],[1,3]] },
    { name:'Leo', latin:'你是我心中的太阳', glyph:'♌', roman:'V', dates:'愿我们的爱，如阳光般灿烂', element:'fire', depth:0.62,
      nodes:[[-0.13,-0.05],[-0.11,0.03],[-0.05,0.07],[0.0,0.04],[0.07,0.10],[0.13,0.02],[0.05,-0.02]], edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] },
    { name:'Virgo', latin:'爱你是我最完美的事', glyph:'♍', roman:'VI', dates:'愿我们的爱，如星辰般纯净', element:'earth', depth:0.5,
      nodes:[[-0.13,-0.03],[-0.05,-0.02],[0.0,0.03],[0.05,-0.02],[0.12,0.0],[0.02,0.10]], edges:[[0,1],[1,2],[2,3],[3,4],[2,5]] },
    { name:'Libra', latin:'你是我生命的平衡', glyph:'♎', roman:'VII', dates:'愿我们的爱，如天秤般公正', element:'air', depth:0.56,
      nodes:[[0,-0.09],[-0.10,0.02],[0.10,0.02],[-0.12,0.10],[0.12,0.10]], edges:[[0,1],[0,2],[1,3],[2,4]] },
    { name:'Scorpio', latin:'爱你是我最深的执念', glyph:'♏', roman:'VIII', dates:'愿我们的爱，如烈焰般浓烈', element:'water', depth:0.64,
      nodes:[[-0.13,-0.06],[-0.06,-0.02],[0.0,0.0],[0.05,0.05],[0.10,0.10],[0.14,0.06],[0.13,0.0]], edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]] },
    { name:'Sagittarius', latin:'愿与你共赴山海', glyph:'♐', roman:'IX', dates:'愿我们的爱，如箭矢般坚定', element:'fire', depth:0.58,
      nodes:[[-0.11,0.06],[-0.04,-0.02],[0.02,-0.06],[0.09,-0.01],[0.06,0.07],[-0.02,0.07],[0.12,-0.08]], edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,6]] },
    { name:'Capricorn', latin:'愿与你共度余生', glyph:'♑', roman:'X', dates:'愿我们的爱，如山峰般稳固', element:'earth', depth:0.48,
      nodes:[[-0.13,-0.04],[0.0,-0.09],[0.13,-0.02],[0.04,0.09],[-0.07,0.06]], edges:[[0,1],[1,2],[2,3],[3,4],[4,0]] },
    { name:'Aquarius', latin:'你是我生命的源泉', glyph:'♒', roman:'XI', dates:'愿我们的爱，如流水般绵长', element:'air', depth:0.54,
      nodes:[[-0.13,0.0],[-0.05,-0.05],[0.0,0.0],[0.05,-0.05],[0.12,0.0],[0.0,0.09]], edges:[[0,1],[1,2],[2,3],[3,4],[2,5]] },
    { name:'Pisces', latin:'愿与你相依为命', glyph:'♓', roman:'XII', dates:'愿我们的爱，如双鱼般缠绵', element:'water', depth:0.6,
      nodes:[[-0.13,0.07],[-0.06,0.0],[0.0,0.03],[0.06,-0.02],[0.13,-0.09],[0.11,0.05]], edges:[[0,1],[1,2],[2,3],[3,4],[4,5]] },
  ];
  // anchors on the ecliptic ellipse: Aries at 12 o'clock, running clockwise
  const RX = 1.16, RY = 0.66;
  SIGNS.forEach((s, i) => {
    const a = -Math.PI / 2 + i * (TAU / 12);
    s.au = RX * Math.cos(a);
    s.av = RY * Math.sin(a);
    s.glow = 0;      // eased highlight 0..1
    s.sx = 0; s.sy = 0; // cached screen centroid (per frame)
  });

  const GOLD = [227, 189, 119];
  const STARW = [231, 235, 251];
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /* ---------- canvas engine ---------- */
  const canvas = document.getElementById('skymap');
  let ctx = null;
  if (canvas) {
    try { ctx = canvas.getContext('2d'); } catch (e) { ctx = null; }
  }
  if (!ctx) { docEl.classList.add('no-canvas'); }

  const engine = (() => {
    if (!ctx) return null;
    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, S = 1;
    let stars = [];
    let bgGrad = null, vignette = null;
    let shooters = [];
    // camera / interaction state (eased)
    const cam = { x: 0, y: 0, s: 1, tx: 0, ty: 0, ts: 1 };
    const par = { x: 0, y: 0, tx: 0, ty: 0 }; // parallax offset (screen px)
    let mx = -9999, my = -9999;                // pointer in css px
    let rot = 0;                               // sky rotation
    let raf = 0, last = 0, tSec = 0;
    let skyHover = null;                        // constellation nearest cursor
    let onSkyHover = null;                      // callback -> UI

    const PARALLAX = finePointer ? 26 : 0;
    const HOVER_R = 66;                         // px radius for sky hover

    function makeStars() {
      const count = Math.max(160, Math.min(620, Math.round((w * h) / 3200)));
      stars = new Array(count);
      // deterministic-ish scatter using Math.random (fresh sky each load)
      for (let i = 0; i < count; i++) {
        const r = 2.05 * Math.sqrt(Math.random());   // disc radius (world units)
        const th = Math.random() * TAU;
        const depth = 0.15 + Math.random() * 0.85;
        const bright = Math.pow(Math.random(), 1.7);  // most faint, few bright
        let tint = STARW;
        const roll = Math.random();
        if (roll < 0.10) tint = GOLD;
        else if (roll < 0.18) tint = [150, 160, 220]; // faint indigo
        stars[i] = {
          u: r * Math.cos(th), v: r * Math.sin(th),
          depth,
          size: 0.4 + bright * 1.5 + depth * 0.3,
          base: 0.28 + bright * 0.72,
          tw: 0.5 + Math.random() * 1.9,
          ph: Math.random() * TAU,
          tint,
        };
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      cx = w / 2; cy = h / 2;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // background gradient (deep midnight, faint indigo lift low)
      bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#0a1130');
      bgGrad.addColorStop(0.55, '#070a18');
      bgGrad.addColorStop(1, '#04060f');
      // radial vignette to focus the centre + aid text contrast
      const vr = Math.hypot(w, h) * 0.62;
      vignette = ctx.createRadialGradient(cx, cy * 0.92, vr * 0.16, cx, cy * 0.92, vr);
      vignette.addColorStop(0, 'rgba(7,10,24,0)');
      vignette.addColorStop(0.7, 'rgba(6,8,20,0.28)');
      vignette.addColorStop(1, 'rgba(4,6,15,0.72)');
      makeStars();
    }

    // world -> screen. depth drives parallax; rotation + camera applied to base.
    function scaleNow() { return Math.min(w * 0.34, h * 0.72) * cam.s; }

    function drawSky(dtScaled) {
      S = scaleNow();
      const cr = Math.cos(rot), sr = Math.sin(rot);

      // clear
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // ecliptic ring (very faint) — sampled ellipse, co-rotating
      ctx.beginPath();
      for (let k = 0; k <= 96; k++) {
        const a = (k / 96) * TAU;
        const u = RX * Math.cos(a), v = RY * Math.sin(a);
        const rx = u * cr - v * sr, ry = u * sr + v * cr;
        const sx = cx + rx * S + cam.x + par.x * 0.5;
        const sy = cy + ry * S + cam.y + par.y * 0.5;
        if (k === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = rgba(GOLD, 0.06);
      ctx.lineWidth = 1;
      ctx.stroke();

      // background stars
      ctx.globalAlpha = 1;
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const rx = st.u * cr - st.v * sr, ry = st.u * sr + st.v * cr;
        const sx = cx + rx * S + cam.x + par.x * st.depth;
        const sy = cy + ry * S + cam.y + par.y * st.depth;
        if (sx < -6 || sx > w + 6 || sy < -6 || sy > h + 6) continue;
        const tw = reduce ? 1 : (0.62 + 0.38 * Math.sin(tSec * st.tw + st.ph));
        const b = st.base * tw;
        if (b <= 0.02) continue;
        ctx.fillStyle = rgba(st.tint, Math.min(1, b));
        ctx.beginPath();
        ctx.arc(sx, sy, st.size, 0, TAU);
        ctx.fill();
        if (st.size > 1.5 && b > 0.55) { // soft halo on the brightest
          ctx.globalAlpha = Math.min(1, b) * 0.22;
          ctx.beginPath();
          ctx.arc(sx, sy, st.size * 2.6, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // constellations: project nodes, track sky-hover, draw lines + nodes
      let nearest = null, nearestD = HOVER_R;
      for (let s = 0; s < SIGNS.length; s++) {
        const sign = SIGNS[s];
        const pts = sign._pts || (sign._pts = []);
        let ccx = 0, ccy = 0;
        for (let n = 0; n < sign.nodes.length; n++) {
          const u = sign.au + sign.nodes[n][0], v = sign.av + sign.nodes[n][1];
          const rx = u * cr - v * sr, ry = u * sr + v * cr;
          const sx = cx + rx * S + cam.x + par.x * sign.depth;
          const sy = cy + ry * S + cam.y + par.y * sign.depth;
          pts[n] = pts[n] || {};
          pts[n].x = sx; pts[n].y = sy;
          ccx += sx; ccy += sy;
          if (!reduce && finePointer) {
            const d = Math.hypot(sx - mx, sy - my);
            if (d < nearestD) { nearestD = d; nearest = s; }
          }
        }
        sign.sx = ccx / sign.nodes.length;
        sign.sy = ccy / sign.nodes.length;
      }
      skyHover = nearest;
      if (onSkyHover) onSkyHover(nearest);

      // draw each constellation (dim first, active on top with glow)
      for (let pass = 0; pass < 2; pass++) {
        for (let s = 0; s < SIGNS.length; s++) {
          const sign = SIGNS[s];
          const active = sign.glow > 0.04;
          if ((pass === 0 && active) || (pass === 1 && !active)) continue;
          const pts = sign._pts;
          const g = sign.glow;
          if (active) { ctx.shadowColor = rgba(GOLD, 0.5); ctx.shadowBlur = 10 * g; }
          // lines
          ctx.strokeStyle = rgba(GOLD, 0.1 + g * 0.55);
          ctx.lineWidth = 0.8 + g * 0.9;
          ctx.beginPath();
          for (let e = 0; e < sign.edges.length; e++) {
            const a = pts[sign.edges[e][0]], b = pts[sign.edges[e][1]];
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          }
          ctx.stroke();
          // nodes
          for (let n = 0; n < pts.length; n++) {
            const p = pts[n];
            ctx.fillStyle = rgba(GOLD, 0.55 + g * 0.45);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5 + g * 1.6, 0, TAU);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
      }

      // shooting stars
      if (!reduce) {
        if (shooters.length < 2 && Math.random() < 0.007) spawnShooter();
        for (let i = shooters.length - 1; i >= 0; i--) {
          const sh = shooters[i];
          sh.x += sh.vx * dtScaled; sh.y += sh.vy * dtScaled; sh.life -= dtScaled;
          const tx = sh.x - sh.vx * sh.len, ty = sh.y - sh.vy * sh.len;
          const fade = Math.max(0, Math.min(1, sh.life / 22));
          const g = ctx.createLinearGradient(sh.x, sh.y, tx, ty);
          g.addColorStop(0, rgba(STARW, 0.9 * fade));
          g.addColorStop(0.3, rgba(GOLD, 0.5 * fade));
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(tx, ty); ctx.stroke();
          ctx.fillStyle = rgba(STARW, 0.9 * fade);
          ctx.beginPath(); ctx.arc(sh.x, sh.y, 1.4, 0, TAU); ctx.fill();
          if (sh.life <= 0 || sh.x < -80 || sh.x > w + 80 || sh.y > h + 80) shooters.splice(i, 1);
        }
      }

      // vignette
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // active constellation label (above vignette so it stays legible)
      for (let s = 0; s < SIGNS.length; s++) {
        const sign = SIGNS[s];
        if (sign.glow < 0.4) continue;
        const a = (sign.glow - 0.4) / 0.6;
        const lx = sign.sx, ly = sign.sy - 0.14 * S - 14;
        ctx.textAlign = 'center';
        ctx.fillStyle = rgba([242, 221, 172], a);
        ctx.font = '600 26px "Cormorant Garamond", Georgia, serif';
        ctx.fillText(sign.glyph + '  ' + sign.name, lx, ly);
        ctx.fillStyle = rgba(GOLD, a * 0.7);
        ctx.font = '400 11px "Noto Serif SC", "Space Mono", monospace';
        ctx.fillText(sign.latin, lx, ly + 18);
      }
    }

    function spawnShooter() {
      const fromLeft = Math.random() < 0.5;
      const ang = (fromLeft ? 0.25 : 0.75) * Math.PI + (Math.random() - 0.5) * 0.4;
      const sp = 7 + Math.random() * 6;
      shooters.push({
        x: fromLeft ? Math.random() * w * 0.4 : w - Math.random() * w * 0.4,
        y: Math.random() * h * 0.42,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        len: 9 + Math.random() * 8, life: 26 + Math.random() * 14,
      });
    }

    function tick(now) {
      if (!last) last = now;
      let dt = (now - last) / 1000; last = now;
      if (dt > 0.1) dt = 0.1;               // clamp after tab-away
      const dtScaled = dt * 60;             // px-per-frame units
      tSec += dt;
      rot += dt * 0.006;                    // very slow drift (~17 min / turn)
      // ease parallax + camera
      par.x += (par.tx - par.x) * 0.06;
      par.y += (par.ty - par.y) * 0.06;
      cam.x += (cam.tx - cam.x) * 0.05;
      cam.y += (cam.ty - cam.y) * 0.05;
      cam.s += (cam.ts - cam.s) * 0.05;
      // ease each constellation's glow toward its focus target
      for (let s = 0; s < SIGNS.length; s++) {
        const sign = SIGNS[s];
        const target = sign._focus ? 1 : 0;
        sign.glow += (target - sign.glow) * 0.12;
      }
      drawSky(dtScaled);
      raf = requestAnimationFrame(tick);
    }

    // static render for reduced-motion / no-animation redraws
    function renderStatic() {
      S = scaleNow();
      for (let s = 0; s < SIGNS.length; s++) SIGNS[s].glow = SIGNS[s]._focus ? 1 : 0;
      par.x = par.y = 0; cam.x = cam.tx; cam.y = cam.ty; cam.s = cam.ts;
      drawSky(0);
    }

    // pointer parallax + hover source
    if (!reduce && finePointer) {
      window.addEventListener('pointermove', (e) => {
        mx = e.clientX; my = e.clientY;
        const nx = (e.clientX - cx) / (w / 2);
        const ny = (e.clientY - cy) / (h / 2);
        par.tx = -nx * PARALLAX;
        par.ty = -ny * PARALLAX;
      }, { passive: true });
      window.addEventListener('pointerleave', () => { par.tx = 0; par.ty = 0; mx = my = -9999; }, { passive: true });
    }

    let rt = 0;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(() => { resize(); if (reduce) renderStatic(); }, 180);
    }

    return {
      start() {
        resize();
        if (reduce) { renderStatic(); }
        else { raf = requestAnimationFrame(tick); }
      },
      onResize,
      renderStatic,
      isReduced: () => reduce,
      // camera nudge toward a sign centroid (subtle)
      focusCamera(idx) {
        if (idx == null) { cam.tx = 0; cam.ty = 0; cam.ts = 1; return; }
        const sign = SIGNS[idx];
        const cr = Math.cos(rot), sr = Math.sin(rot);
        const rx = sign.au * cr - sign.av * sr, ry = sign.au * sr + sign.av * cr;
        const baseS = Math.min(w * 0.34, h * 0.72);
        cam.tx = -rx * baseS * 0.55;
        cam.ty = -ry * baseS * 0.55;
        cam.ts = 1.08;
      },
      setHoverCallback(fn) { onSkyHover = fn; },
      getSkyHover: () => skyHover,
    };
  })();

  /* ---------- focus state shared across sky + UI ---------- */
  let selected = null;   // sticky (click)
  let btnHover = null;   // pointer/focus on a control
  let skyHover = null;   // from the canvas engine

  function currentFocus() {
    return selected != null ? selected : (btnHover != null ? btnHover : skyHover);
  }

  const heroBtns = [];
  const gridBtns = [];

  function applyFocus() {
    const f = currentFocus();
    for (let i = 0; i < SIGNS.length; i++) SIGNS[i]._focus = (i === f);
    // reflect on controls
    heroBtns.forEach((b, i) => {
      b.classList.toggle('active', i === f);
      b.classList.toggle('selected', i === selected);
      b.setAttribute('aria-pressed', String(i === selected));
    });
    gridBtns.forEach((b, i) => {
      b.classList.toggle('active', i === f);
      b.classList.toggle('selected', i === selected);
      b.setAttribute('aria-pressed', String(i === selected));
    });
    if (engine) {
      engine.focusCamera(f != null && !engine.isReduced() ? f : null);
      if (engine.isReduced()) engine.renderStatic();
    }
  }

  function setBtnHover(i) { btnHover = i; applyFocus(); }
  function clearBtnHover(i) { if (btnHover === i) { btnHover = null; applyFocus(); } }
  function toggleSelect(i) { selected = (selected === i) ? null : i; applyFocus(); }

  /* ---------- build hero glyph legend ---------- */
  const heroLegend = document.getElementById('hero-legend');
  if (heroLegend) {
    SIGNS.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hl-btn';
      b.textContent = s.glyph;
      b.setAttribute('aria-label', 'Highlight ' + s.name + ' constellation');
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('pointerenter', () => setBtnHover(i));
      b.addEventListener('pointerleave', () => clearBtnHover(i));
      b.addEventListener('focus', () => setBtnHover(i));
      b.addEventListener('blur', () => clearBtnHover(i));
      b.addEventListener('click', () => toggleSelect(i));
      heroLegend.appendChild(b);
      heroBtns.push(b);
    });
  }

  /* ---------- build "The Twelve" grid ---------- */
  const grid = document.getElementById('sign-grid');
  if (grid) {
    SIGNS.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sign reveal';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', s.name + ', ' + s.latin + ', ' + s.dates + ', ' + s.element + ' sign');
      b.innerHTML =
        '<div class="s-top"><span class="s-roman">' + s.roman + '</span>' +
        '<span class="s-glyph" aria-hidden="true">' + s.glyph + '</span></div>' +
        '<h3 class="s-name">' + s.name + '</h3>' +
        '<p class="s-latin">' + s.latin + '</p>' +
        '<div class="s-meta"><span class="s-dates">' + s.dates + '</span></div>';
      b.addEventListener('pointerenter', () => setBtnHover(i));
      b.addEventListener('pointerleave', () => clearBtnHover(i));
      b.addEventListener('focus', () => setBtnHover(i));
      b.addEventListener('blur', () => clearBtnHover(i));
      b.addEventListener('click', () => toggleSelect(i));
      grid.appendChild(b);
      gridBtns.push(b);
    });
  }

  /* ---------- rotating name band ---------- */
  const bandTrack = document.getElementById('band-track');
  if (bandTrack) {
    const names = ['FOREVER', 'ETERNAL', 'DEVOTION', 'PROMISE', 'TOGETHER', 'ALWAYS', 'LOVE', '星河', '永恒', '誓言', '相守', '一生'];
    const seq = names.concat(names);
    bandTrack.innerHTML = seq.map((n, k) =>
      '<span>' + n + '</span>' + (k < seq.length - 1 ? '<i>✦</i>' : '')).join('');
  }

  /* ---------- sky hover -> shared focus ---------- */
  if (engine) {
    engine.setHoverCallback((idx) => {
      if (idx !== skyHover) { skyHover = idx; if (selected == null && btnHover == null) applyFocus(); }
    });
  }

  /* ---------- wedding countdown ---------- */
  (function countdown() {
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');
    if (!dEl) return;
    const target = new Date('2026-10-06T11:28:00+08:00').getTime();

    function update() {
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / 86400000); diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000); diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);
      const pad = (n) => String(n).padStart(2, '0');
      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(mins);
      if (sEl) sEl.textContent = pad(secs);
    }
    update();
    setInterval(update, 1000);
  })();

  /* ---------- boot ---------- */
  try { if (engine) engine.start(); } catch (e) { docEl.classList.add('no-canvas'); }
  applyFocus();

  // scroll reveals
  const revealAll = () => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'));
  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // circular reveal mask — 长按圆形扩散蒙版 + 交互特效
  const photoBgs = [
    { el: document.querySelector('.hero-bg'), container: document.querySelector('.hero') },
    { el: document.querySelector('.twelve-bg'), container: document.querySelector('.twelve') },
    { el: document.querySelector('.reading-bg'), container: document.querySelector('.reading-inner') },
  ].filter(p => p.el && p.container);

  const fxLayer = document.getElementById('fx-layer');
  const fxCharge = document.getElementById('fx-charge');
  const fxRings = document.getElementById('fx-rings');
  const fxParticles = document.getElementById('fx-particles');
  const fxEdge = document.getElementById('fx-edge');

  if (photoBgs.length > 0 && fxLayer) {
    const MAX_RADIUS = 420;
    const EXPAND_DURATION = 320;   // 扩散时长 ms（更快）
    const CONTRACT_DURATION = 550;  // 收回时长 ms
    const PRESS_DELAY = 180;        // 长按触发延迟 ms
    let currentRadius = 0;
    let targetRadius = 0;
    let animationId = null;
    let lastTime = 0;
    let pressX = 0, pressY = 0;

    const updateMask = (radius, x, y) => {
      photoBgs.forEach(({ el, container }) => {
        const rect = container.getBoundingClientRect();
        const mx = ((x - rect.left) / rect.width) * 100;
        const my = ((y - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', mx + '%');
        el.style.setProperty('--my', my + '%');
        const edgeAlpha = Math.max(0, 0.22 - radius / 3000);
        const grad = `radial-gradient(circle ${radius}px at var(--mx) var(--my),#000 0%,rgba(0,0,0,${edgeAlpha}) 100%)`;
        el.style.webkitMaskImage = grad;
        el.style.maskImage = grad;
        el.style.opacity = radius > 5 ? '0.92' : '';
      });
      // 边缘发光跟随
      if (fxEdge) {
        fxEdge.style.left = x + 'px';
        fxEdge.style.top = y + 'px';
        fxEdge.style.width = (radius * 2) + 'px';
        fxEdge.style.height = (radius * 2) + 'px';
        fxEdge.style.transform = `translate(-50%,-50%) scale(${radius > 0 ? 1 : 0})`;
      }
    };

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const dt = timestamp - lastTime;
      lastTime = timestamp;

      const duration = targetRadius > currentRadius ? EXPAND_DURATION : CONTRACT_DURATION;
      const step = (dt / duration) * MAX_RADIUS;

      if (targetRadius > currentRadius) {
        currentRadius = Math.min(targetRadius, currentRadius + step);
      } else {
        currentRadius = Math.max(targetRadius, currentRadius - step);
      }

      updateMask(currentRadius, pressX, pressY);

      if (Math.abs(currentRadius - targetRadius) > 0.5) {
        animationId = requestAnimationFrame(animate);
      } else {
        animationId = null;
        lastTime = 0;
        if (targetRadius === 0) {
          photoBgs.forEach(({ el }) => {
            el.style.webkitMaskImage = '';
            el.style.maskImage = '';
            el.style.opacity = '';
          });
          if (fxEdge) fxEdge.classList.remove('active');
        }
      }
    };

    const startAnimation = () => {
      if (animationId) cancelAnimationFrame(animationId);
      lastTime = 0;
      animationId = requestAnimationFrame(animate);
    };

    // 爆发特效：光环 + 粒子
    const burstFX = (x, y) => {
      // 3 圈光环，依次延迟
      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'fx-ring';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
        ring.style.width = (MAX_RADIUS * 2.2) + 'px';
        ring.style.height = (MAX_RADIUS * 2.2) + 'px';
        ring.style.animationDelay = (i * 120) + 'ms';
        fxRings.appendChild(ring);
        requestAnimationFrame(() => ring.classList.add('burst'));
        setTimeout(() => ring.remove(), 1500 + i * 120);
      }
      // 12 个粒子向外飞散
      for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'fx-particle';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 120 + Math.random() * 100;
        p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        p.style.animationDelay = (Math.random() * 80) + 'ms';
        p.style.width = (3 + Math.random() * 3) + 'px';
        p.style.height = p.style.width;
        fxParticles.appendChild(p);
        requestAnimationFrame(() => p.classList.add('burst'));
        setTimeout(() => p.remove(), 1200);
      }
    };

    const activate = (x, y) => {
      pressX = x; pressY = y;
      fxCharge.classList.remove('active');
      fxEdge.classList.add('active');
      burstFX(x, y);
      targetRadius = MAX_RADIUS;
      startAnimation();
    };

    const deactivate = () => {
      fxCharge.classList.remove('active');
      targetRadius = 0;
      startAnimation();
    };

    // 桌面端
    let pressTimer = null;
    let pressPos = { x: 0, y: 0 };
    const onMouseDown = e => {
      if (e.button !== 0) return;
      pressPos = { x: e.clientX, y: e.clientY };
      fxCharge.style.left = e.clientX + 'px';
      fxCharge.style.top = e.clientY + 'px';
      fxCharge.classList.add('active');
      pressTimer = setTimeout(() => activate(e.clientX, e.clientY), PRESS_DELAY);
    };
    const onMouseUp = () => {
      clearTimeout(pressTimer);
      deactivate();
    };
    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('mouseup', onMouseUp, true);
    document.addEventListener('mouseleave', onMouseUp, true);

    // 移动端
    const onTouchStart = e => {
      const t = e.touches[0];
      pressPos = { x: t.clientX, y: t.clientY };
      fxCharge.style.left = t.clientX + 'px';
      fxCharge.style.top = t.clientY + 'px';
      fxCharge.classList.add('active');
      pressTimer = setTimeout(() => activate(t.clientX, t.clientY), PRESS_DELAY);
    };
    const onTouchEnd = () => {
      clearTimeout(pressTimer);
      deactivate();
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    document.addEventListener('touchend', onTouchEnd, true);
    document.addEventListener('touchcancel', onTouchEnd, true);
  }

  /* ---------- 地图导航 ---------- */
  (function initNav() {
    const venueName = '东方盛宴(东方荟店)';
    const city = '芜湖';
    const address = '东方盛宴(东方荟店),安徽省芜湖市无为市';

    const mapUrls = {
      amap: 'https://uri.amap.com/search?keyword=' + encodeURIComponent(venueName) + '&city=' + encodeURIComponent(city) + '&src=wedding-invitation',
      baidu: 'https://j.map.baidu.com/6e/OLw',
      tencent: 'https://apis.map.qq.com/uri/v1/search?keyword=' + encodeURIComponent(venueName) + '&region=' + encodeURIComponent(city) + '&referer=wedding-invitation',
      apple: 'https://maps.apple.com/?q=' + encodeURIComponent(venueName + ',' + city)
    };

    const mask = document.getElementById('nav-mask');
    const sheet = document.getElementById('nav-sheet');
    const navBtn = document.getElementById('nav-btn');
    const cancelBtn = document.getElementById('nav-cancel');
    if (!mask || !sheet || !navBtn) return;

    function openSheet() {
      mask.classList.add('show');
      sheet.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    function closeSheet() {
      mask.classList.remove('show');
      sheet.classList.remove('show');
      document.body.style.overflow = '';
    }

    navBtn.addEventListener('click', openSheet);
    cancelBtn.addEventListener('click', closeSheet);
    mask.addEventListener('click', closeSheet);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

    document.querySelectorAll('.nav-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const url = mapUrls[opt.dataset.map];
        if (url) window.open(url, '_blank', 'noopener');
        closeSheet();
      });
    });

    // 复制地址
    const copyBtn = document.getElementById('copy-btn');
    const toast = document.getElementById('toast');
    if (copyBtn && toast) {
      function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
      }
      copyBtn.addEventListener('click', async () => {
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(address);
          } else {
            const ta = document.createElement('textarea');
            ta.value = address;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          showToast('✦ 地址已复制到剪贴板');
        } catch (e) {
          showToast('复制失败，请手动复制');
        }
      });
    }
  })();

  // nav backdrop
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // resize
  window.addEventListener('resize', () => { if (engine) engine.onResize(); }, { passive: true });
})();
