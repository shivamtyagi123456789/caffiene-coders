/* =========================================================
   Beyond the Fort — Heritage & Nature showcase
   Replaces the old spinning mandala wheel with a rotating
   gallery of line-art drawings of real Gwalior landmarks and
   landscapes. Each drawing "inks itself" (stroke draw) when it
   becomes active. Pure SVG, no images, works offline.
   Exposes window.BTF_ART (used by the Nature cards & footer).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- tiny SVG helpers ---------- */
  function P(d, c) { return '<path d="' + d + '" class="' + (c || 'l') + '" pathLength="1"/>'; }
  function C(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="' + (c || 'l') + '" pathLength="1"/>'; }
  function R(x, y, w, h, c) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="' + (c || 'l') + '" pathLength="1"/>'; }
  function E(x, y, rx, ry, c) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" class="' + (c || 'l') + '" pathLength="1"/>'; }

  /* chhatri (domed pavilion) centred at cx, sitting on y */
  function chhatri(cx, y, s) {
    s = s || 1;
    var w = 15 * s, h = 13 * s;
    return P('M' + (cx - w - 2) + ' ' + y + ' H' + (cx + w + 2)) +
      P('M' + (cx - w + 3) + ' ' + y + ' V' + (y - h) + ' M' + (cx + w - 3) + ' ' + y + ' V' + (y - h)) +
      P('M' + (cx - w) + ' ' + (y - h) + ' Q' + cx + ' ' + (y - h - 26 * s) + ' ' + (cx + w) + ' ' + (y - h) + ' Z', 'l t') +
      P('M' + cx + ' ' + (y - h - 19 * s) + ' V' + (y - h - 30 * s), 'l gd');
  }
  function arches(x0, x1, y, n, h) {
    var out = '', step = (x1 - x0) / n, w = step * .5;
    for (var i = 0; i < n; i++) {
      var x = x0 + step * i + (step - w) / 2;
      out += P('M' + x + ' ' + y + ' V' + (y - h) + ' Q' + (x + w / 2) + ' ' + (y - h - w * .9) + ' ' + (x + w) + ' ' + (y - h) + ' V' + y, 'l win');
    }
    return out;
  }
  var ground = P('M0 336 H400', 'l dim');

  var ART = {
    /* 1 — Gwalior Fort with Man Mandir's tiled façade */
    fort: function () {
      var s = P('M0 344 Q70 318 120 300 L290 300 Q340 318 400 344', 'l dim') +
        R(92, 206, 216, 94) +
        R(92, 226, 216, 11, 'l t fillt') + R(92, 242, 216, 5, 'l y filly');
      [104, 172, 228, 296].forEach(function (x) { s += R(x - 14, 192, 28, 108) + chhatri(x, 192, 1); });
      s += arches(118, 160, 286, 2, 22) + arches(186, 214, 286, 1, 22) + arches(242, 284, 286, 2, 22);
      // tile motifs: little ducks/diamonds along the band
      for (var i = 0; i < 9; i++) s += P('M' + (120 + i * 20) + ' 231 l5 -4 l5 4 l-5 4 Z', 'l y');
      // rampart running off to the sides
      s += P('M20 312 H92 M308 312 H382', 'l') + P('M20 312 v-8 h8 v8 m6 0 v-8 h8 v8 m6 0 v-8 h8 v8 m6 0 v-8 h8 v8 M326 312 v-8 h8 v8 m6 0 v-8 h8 v8 m6 0 v-8 h8 v8', 'l dim');
      return s;
    },
    /* 2 — Teli ka Mandir: tall wagon-vault (valabhi) roof */
    teli: function () {
      return ground +
        P('M128 336 V268 H272 V336') + P('M140 268 V150 H260 V268') +
        P('M132 150 C132 96 268 96 268 150', 'l t') + P('M146 150 C146 108 254 108 254 150', 'l dim') +
        P('M150 104 H250', 'l gd') + C(160, 100, 5, 'l gd') + C(200, 96, 6, 'l gd') + C(240, 100, 5, 'l gd') +
        P('M140 190 H260 M140 230 H260', 'l dim') +
        P('M182 210 a18 18 0 1 1 36 0 V228 H182 Z', 'l win') +
        P('M176 336 V292 Q200 262 224 292 V336', 'l win') +
        P('M150 172 v40 M250 172 v40 M150 246 v20 M250 246 v20', 'l dim');
    },
    /* 3 — Sas-Bahu (Sahastrabahu): pillared mandapa, stepped roof */
    sasbahu: function () {
      var s = ground + R(78, 314, 244, 22);
      for (var x = 102; x <= 298; x += 39) s += P('M' + x + ' 314 V236') + P('M' + (x - 6) + ' 236 H' + (x + 6) + ' M' + (x - 6) + ' 314 H' + (x + 6), 'l dim');
      s += R(88, 222, 224, 14) +
        P('M96 222 L304 222 L282 200 L118 200 Z') + P('M118 200 L282 200 L262 180 L138 180 Z', 'l t') +
        P('M138 180 L262 180 L242 160 L158 160 Z') + P('M158 160 L242 160 L220 138 L180 138 Z', 'l t') +
        E(200, 132, 20, 6, 'l gd') + P('M200 126 V104', 'l gd') + C(200, 100, 4, 'l gd');
      for (var k = 0; k < 10; k++) s += C(100 + k * 22, 229, 2.5, 'l y');
      return s;
    },
    /* 4 — Tansen's tomb, Hazira */
    tansen: function () {
      return ground + R(96, 236, 208, 100) + P('M88 236 H312') +
        arches(110, 290, 330, 3, 34) +
        R(148, 222, 104, 14) + P('M146 222 Q146 150 200 140 Q254 150 254 222', 'l t') +
        P('M200 140 V118', 'l gd') + C(200, 112, 5, 'l gd') +
        chhatri(108, 236, .9) + chhatri(292, 236, .9) +
        P('M118 256 h164 M118 264 h164', 'l dim') +
        // tamarind tree (legend: chewing its leaves sweetens the voice)
        P('M350 336 V276 M350 290 q-18 -8 -26 -26 M350 284 q18 -10 22 -30', 'l gr') +
        C(330, 254, 16, 'l gr') + C(356, 244, 20, 'l gr') + C(372, 266, 12, 'l gr');
    },
    /* 5 — Jai Vilas Palace (1874), Lashkar */
    jaivilas: function () {
      var s = ground + R(40, 196, 320, 140) + P('M30 196 H370 M30 188 H370');
      for (var x = 44; x <= 356; x += 12) s += P('M' + x + ' 188 V180', 'l dim');
      s += P('M30 180 H370', 'l dim') +
        P('M146 188 L200 146 L254 188', 'l gd') + C(200, 170, 7, 'l gd') +
        arches(52, 348, 262, 9, 24) + arches(52, 348, 330, 9, 32) + P('M40 266 H360', 'l dim');
      for (var c = 158; c <= 242; c += 21) s += P('M' + c + ' 196 V336', 'l y');
      return s;
    },
    /* 6 — Gopachal Parvat rock-cut Jain figures */
    gopachal: function () {
      return P('M8 336 L26 168 Q48 122 116 118 L292 112 Q356 118 372 172 L392 336', 'l dim') +
        P('M8 336 H392', 'l dim') +
        // niche 1 — standing (kayotsarga)
        P('M66 336 V208 Q66 172 104 172 Q142 172 142 208 V336', 'l win') +
        C(104, 198, 11) + P('M92 214 H116 L120 300 L110 300 V330 M98 330 V300 L88 300 Z') +
        // niche 2 — large seated (padmasana)
        P('M160 336 V186 Q160 140 214 140 Q268 140 268 186 V336', 'l win') +
        C(214, 176, 15) + P('M196 196 Q214 190 232 196 L240 252 Q214 262 188 252 Z') +
        P('M170 282 Q214 300 258 282 Q262 300 214 306 Q166 300 170 282 Z', 'l t') +
        P('M188 252 Q178 268 172 282 M240 252 Q250 268 256 282') +
        // niche 3 — standing
        P('M286 336 V214 Q286 182 318 182 Q350 182 350 214 V336', 'l win') +
        C(318, 206, 10) + P('M307 220 H329 L333 300 L324 300 V330 M312 330 V300 L303 300 Z') +
        P('M30 150 q8 -6 16 0 q8 -6 16 0', 'l gr');
    },
    /* 7 — Tigra lake & dam at dusk */
    tigra: function () {
      return C(296, 126, 30, 'l gd') +
        P('M0 232 Q70 166 150 218 Q220 160 300 210 Q356 190 400 214', 'l dim') +
        P('M0 256 Q90 214 180 246 Q260 222 400 250', 'l gr') +
        P('M236 256 H400 M236 256 v-14 h164', 'l') +
        P('M250 256 v-14 M270 256 v-14 M290 256 v-14 M310 256 v-14 M330 256 v-14 M350 256 v-14 M370 256 v-14', 'l dim') +
        P('M0 272 H400', 'l w') + P('M276 290 h40 M262 306 h68 M284 322 h24', 'l gd') +
        P('M30 296 q20 -6 40 0 t40 0 M140 318 q20 -6 40 0 t40 0 M40 336 q20 -6 40 0 t40 0', 'l w') +
        P('M104 300 Q134 316 164 300 Z', 'l t') + P('M134 300 V262 L156 294 Z', 'l y') +
        P('M70 116 q9 -8 18 0 q9 -8 18 0 M118 96 q7 -6 14 0 q7 -6 14 0 M150 128 q6 -5 12 0 q6 -5 12 0');
    },
    /* 8 — Chambal ravines & the gharial */
    chambal: function () {
      return P('M0 222 Q24 160 54 210 Q80 150 118 206 Q146 168 176 212 Q210 150 246 208 Q276 170 304 212 Q336 156 368 206 Q386 186 400 200', 'l dim') +
        P('M0 252 Q34 204 70 246 Q104 198 142 244 Q180 206 214 248 Q256 200 292 246 Q330 210 364 246 Q384 232 400 240', 'l y') +
        P('M0 280 Q200 252 400 280', 'l w') + P('M0 336 Q200 306 400 336', 'l w') +
        // gharial
        P('M96 310 Q140 296 206 300 L272 302 Q290 304 300 308 Q290 312 272 312 L206 314 Q140 320 96 310 Z', 'l t') +
        C(294, 304, 6, 'l t') +
        P('M120 300 l6 -6 l6 6 M144 298 l6 -6 l6 6 M168 298 l6 -6 l6 6 M192 298 l6 -6 l6 6', 'l t') +
        P('M150 316 l-6 10 M186 316 l-6 10', 'l t') +
        // Indian skimmer
        P('M300 112 q16 -14 32 0 q16 -14 32 0', 'l') + P('M332 112 l10 6', 'l y') +
        P('M30 330 q18 -8 36 0 M320 326 q18 -8 36 0', 'l w');
    },
    /* 9 — Phool Bagh: peacock in the garden */
    phoolbagh: function () {
      var s = ground, cx = 200, cy = 268;
      for (var i = 0; i <= 12; i++) {
        var a = Math.PI + (i / 12) * Math.PI, x = cx + Math.cos(a) * 128, y = cy + Math.sin(a) * 118;
        var mx = cx + Math.cos(a) * 84, my = cy + Math.sin(a) * 78;
        s += P('M' + cx + ' ' + cy + ' L' + x.toFixed(1) + ' ' + y.toFixed(1), 'l dim') +
          E(x.toFixed(1), y.toFixed(1), 9, 12, 'l t') + C(x.toFixed(1), y.toFixed(1), 4, 'l gd') +
          C(mx.toFixed(1), my.toFixed(1), 3, 'l gd');
      }
      s += P('M72 268 Q200 120 328 268', 'l t') +
        P('M206 300 Q186 264 194 226 Q198 204 212 210 Q216 222 206 232 Q204 262 222 300 Z', 'l t fillt') +
        C(212, 202, 7, 'l t') + P('M218 202 l10 3 l-10 2', 'l y') +
        P('M210 194 l-4 -14 M213 194 l0 -15 M216 194 l4 -14', 'l gd') +
        P('M204 300 V336 M220 300 V336', 'l') +
        P('M40 336 q10 -30 20 0 q10 -26 20 0 M320 336 q10 -30 20 0 q10 -26 20 0', 'l gr') +
        C(56, 300, 5, 'l y') + C(344, 300, 5, 'l y');
      return s;
    },
    /* 10 — Suraj Kund: the old tank on the fort plateau */
    surajkund: function () {
      return C(200, 104, 24, 'l gd') +
        P('M200 64 V52 M200 156 V144 M160 104 H148 M252 104 H240 M172 76 l-8 -8 M228 76 l8 -8 M172 132 l-8 8 M228 132 l8 8', 'l gd') +
        P('M40 196 H360 L330 226 H70 Z') + P('M70 226 L100 256 H300 L330 226', 'l dim') +
        P('M100 256 L128 286 H272 L300 256') + P('M128 286 L150 310 H250 L272 286', 'l dim') +
        P('M150 310 H250 L240 330 H160 Z', 'l w') + P('M168 320 h20 M204 320 h24', 'l gd') +
        P('M20 336 H380', 'l dim') + chhatri(52, 196, .8) + chhatri(348, 196, .8);
    },
    /* 11 — Madhav National Park, Shivpuri: forest lake & tiger */
    madhav: function () {
      var s = P('M0 250 H400', 'l dim');
      [[40, 1], [84, .8], [312, .9], [360, 1.1]].forEach(function (t) {
        var x = t[0], k = t[1];
        s += P('M' + x + ' 250 V' + (250 - 60 * k), 'l gr') + C(x, 250 - 76 * k, 26 * k, 'l gr') + C(x - 16 * k, 250 - 60 * k, 16 * k, 'l gr') + C(x + 18 * k, 250 - 62 * k, 15 * k, 'l gr');
      });
      s += P('M0 290 Q200 270 400 290', 'l w') + P('M60 316 q20 -6 40 0 t40 0 M240 320 q20 -6 40 0 t40 0', 'l w') +
        // tiger (simplified side profile)
        P('M128 246 Q132 214 168 212 L238 212 Q262 210 270 226 Q280 222 286 230 Q284 246 268 246 L262 246 V268 M248 246 V268 M150 246 V268 M136 246 V268', 'l y') +
        P('M128 230 Q110 222 104 238 Q110 246 120 236', 'l y') +
        P('M170 214 l6 14 M190 212 l4 16 M210 212 l4 16 M230 212 l2 14', 'l') +
        C(274, 230, 2, 'l') + C(180, 96, 18, 'l gd');
      return s;
    }
  };

  var SLIDES = [
    { k: 'fort', type: 'Heritage', name: 'Gwalior Fort · Man Mandir', hi: 'ग्वालियर किला · मान मंदिर' },
    { k: 'teli', type: 'Heritage', name: 'Teli ka Mandir', hi: 'तेली का मंदिर' },
    { k: 'tigra', type: 'Nature', name: 'Tigra Lake at dusk', hi: 'तिघरा जलाशय' },
    { k: 'sasbahu', type: 'Heritage', name: 'Sas-Bahu Temples', hi: 'सास-बहू मंदिर' },
    { k: 'chambal', type: 'Nature', name: 'Chambal ravines & gharial', hi: 'चंबल के बीहड़' },
    { k: 'tansen', type: 'Music', name: 'Tansen’s Tomb, Hazira', hi: 'तानसेन का मकबरा' },
    { k: 'phoolbagh', type: 'Nature', name: 'Peacock in Phool Bagh', hi: 'फूल बाग का मोर' },
    { k: 'gopachal', type: 'Heritage', name: 'Gopachal rock sculptures', hi: 'गोपाचल पर्वत' },
    { k: 'surajkund', type: 'Legend', name: 'Suraj Kund on the plateau', hi: 'सूरज कुंड' },
    { k: 'jaivilas', type: 'Heritage', name: 'Jai Vilas Palace', hi: 'जय विलास महल' },
    { k: 'madhav', type: 'Nature', name: 'Madhav National Park', hi: 'माधव राष्ट्रीय उद्यान' }
  ];

  function svg(key, cls) {
    return '<svg class="' + (cls || 'hs-art') + '" viewBox="0 0 400 360" role="img" aria-hidden="true" focusable="false">' + ART[key]() + '</svg>';
  }
  window.BTF_ART = { svg: svg, keys: Object.keys(ART) };

  /* ---------- Footer skyline built from the same drawings ---------- */
  var fs = document.getElementById('footer-skyline');
  if (fs) fs.innerHTML = ['fort', 'teli', 'tansen', 'sasbahu', 'jaivilas'].map(function (k) { return svg(k, 'fs-art'); }).join('');

  /* ---------- Hero showcase ---------- */
  var stage = document.getElementById('hs-stage');
  if (!stage) return;
  var dotsBox = document.getElementById('hs-dots');
  var elType = document.getElementById('hs-type'), elName = document.getElementById('hs-name'), elHi = document.getElementById('hs-hi');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  stage.innerHTML = SLIDES.map(function (s, i) {
    // faint pencil sketch underneath + ink layer that draws itself on top
    return '<div class="hs-slide' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' + svg(s.k, 'hs-art hs-ghost') + svg(s.k, 'hs-art hs-ink') + '</div>';
  }).join('');
  dotsBox.innerHTML = SLIDES.map(function (s, i) {
    return '<button type="button" role="tab" class="' + (i === 0 ? 'on' : '') + '" aria-label="' + s.name + '" aria-selected="' + (i === 0) + '" data-i="' + i + '"></button>';
  }).join('');

  var slides = stage.querySelectorAll('.hs-slide'), dots = dotsBox.querySelectorAll('button');
  var cur = 0, timer = null, paused = false, DUR = 5200;

  function show(i) {
    if (i === cur) return;
    slides[cur].classList.remove('active'); dots[cur].classList.remove('on'); dots[cur].setAttribute('aria-selected', 'false');
    cur = (i + SLIDES.length) % SLIDES.length;
    // restart the ink-draw animation
    var sl = slides[cur]; sl.classList.remove('active'); void sl.offsetWidth; sl.classList.add('active');
    dots[cur].classList.add('on'); dots[cur].setAttribute('aria-selected', 'true');
    var s = SLIDES[cur], cap = elName.parentNode;
    cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
    elType.textContent = s.type; elName.textContent = s.name; elHi.textContent = s.hi;
    cap.setAttribute('data-type', s.type.toLowerCase());
  }
  function next() { if (!paused && !document.hidden) show(cur + 1); }
  function start() { clearInterval(timer); timer = setInterval(next, DUR); }
  dotsBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { show(+b.dataset.i); start(); } });
  var fig = document.getElementById('hero-showcase');
  fig.addEventListener('pointerenter', function () { paused = true; });
  fig.addEventListener('pointerleave', function () { paused = false; });
  start();

  // gentle pointer parallax on the drawing
  if (!reduced && window.matchMedia('(hover:hover)').matches) {
    window.addEventListener('pointermove', function (e) {
      var x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
      stage.style.transform = 'translate3d(' + (x * -14).toFixed(1) + 'px,' + (y * -10).toFixed(1) + 'px,0)';
    }, { passive: true });
  }
})();
