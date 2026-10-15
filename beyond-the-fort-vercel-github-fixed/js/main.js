/* =========================================================
   Beyond the Fort — interactions, animation & data
   Classic script: works on any static host AND from file://
   ========================================================= */
(function () {
  'use strict';
  var D = window.BTF;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var isFile = location.protocol === 'file:';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  if (hasST) gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js');

  /* ---------- Loader ---------- */
  var bar = $('#loader-progress');
  var prog = 0;
  var loadTimer = setInterval(function () { prog = Math.min(prog + Math.random() * 18, 92); bar.style.width = prog + '%'; }, 120);
  var loaded = false;
  function finishLoad() {
    if (loaded) return; loaded = true;
    clearInterval(loadTimer); bar.style.width = '100%';
    setTimeout(function () { $('#loader').classList.add('done'); heroIntro(); }, 380);
  }
  window.addEventListener('scene:ready', function () { setTimeout(finishLoad, 500); });
  if (window.__sceneReady) setTimeout(finishLoad, 500);
  setTimeout(finishLoad, 4000); // safety net — never get stuck on the loader

  /* ---------- i18n helper (dictionary lives in js/i18n.js) ---------- */
  var T = function (k, en) { return window.BTF_T ? window.BTF_T(k, en) : en; };

  /* ---------- Heritage ribbon ---------- */
  function ribbonHTML(list) {
    var one = list.map(function (p) {
      return '<span class="rb-item"><span class="rb-en">' + esc(p[0]) + '</span><span class="rb-hi" lang="hi">' + esc(p[1]) + '</span></span><span class="rb-sep" aria-hidden="true">❁</span>';
    }).join('');
    return one + one + one; // 3× for seamless loop on wide screens
  }
  $('#ribbon-a').innerHTML = ribbonHTML(D.ribbonA);
  $('#ribbon-b').innerHTML = ribbonHTML(D.ribbonB);

  /* ---------- Heritage cards ---------- */
  $('#heritage-grid').innerHTML = D.heritage.map(function (h, i) {
    return '<article class="heritage-card" data-tilt>' +
      '<div class="jharokha"><span class="hc-hi" lang="hi">' + esc(h.hi) + '</span><i class="fa-solid ' + h.icon + '"></i></div>' +
      '<span class="hc-era">' + esc(h.era) + '</span>' +
      '<h3>' + esc(h.name) + '</h3><p>' + esc(h.text) + '</p>' +
      '<span class="hc-num">' + ['१', '२', '३', '४', '५', '६'][i] + '</span></article>';
  }).join('');
  $('#flavours').innerHTML = D.flavours.map(function (f) {
    return '<div class="flavour"><i class="fa-solid ' + f.icon + '"></i><div><span lang="hi">' + esc(f.hi) + '</span><h4>' + esc(f.title) + '</h4><p>' + esc(f.text) + '</p></div></div>';
  }).join('');

  /* ---------- Nature cards (line-art from js/showcase.js) ---------- */
  $('#nature-grid').innerHTML = D.nature.map(function (n) {
    var art = window.BTF_ART ? window.BTF_ART.svg(n.art, 'nc-art') : '';
    return '<article class="nature-card" data-tilt>' +
      '<div class="nc-visual">' + art + '<span class="nc-dist"><i class="fa-solid fa-location-arrow"></i> ' + esc(n.dist) + '</span></div>' +
      '<div class="nc-body"><span class="nc-tag">' + esc(n.tag) + '</span>' +
      '<h3>' + esc(n.name) + ' <span lang="hi">' + esc(n.hi) + '</span></h3>' +
      '<p>' + esc(n.text) + '</p><p class="nc-tip"><i class="fa-regular fa-lightbulb"></i> ' + esc(n.tip) + '</p></div></article>';
  }).join('');

  /* ---------- Render static content ---------- */
  $('#evidence-grid').innerHTML = D.evidence.map(function (e) {
    return '<article class="ev-card" tabindex="0" aria-label="' + esc(e.signal) + '">' +
      '<div class="ev-inner">' +
      '<div class="ev-face ev-front"><i class="fa-solid ' + e.icon + ' ev-icon"></i>' +
      '<div><span class="ev-label">Signal</span><h4>' + esc(e.signal) + '</h4></div>' +
      '<p>' + esc(e.evidence) + '</p><span class="ev-hint">Hover / tap → what remains uncertain</span></div>' +
      '<div class="ev-face ev-back"><span class="ev-label">What remains uncertain</span><p>' + esc(e.unknown) + '</p>' +
      '<i class="fa-solid fa-circle-question" style="font-size:2rem;opacity:.6"></i></div>' +
      '</div></article>';
  }).join('');
  $$('.ev-card').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('flipped'); });
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.classList.toggle('flipped'); } });
  });

  $('#hscroll-track').innerHTML = D.workflow.map(function (w, i) {
    return '<article class="wf-step">' +
      '<span class="wf-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<i class="fa-solid ' + w.icon + ' wf-icon"></i>' +
      '<p class="wf-tag">' + esc(w.tag) + '</p>' +
      '<h3>' + esc(w.title) + '</h3><p>' + esc(w.text) + '</p>' +
      '<ul>' + w.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
      '<div class="wf-out">' + esc(w.out) + '</div></article>';
  }).join('');

  $('#verdict-grid').innerHTML = D.verdicts.map(function (v) {
    var ic = v.k === 'go' ? 'fa-circle-check' : v.k === 'stop' ? 'fa-circle-xmark' : 'fa-triangle-exclamation';
    return '<article class="verdict ' + v.k + '" data-tilt><span class="verdict-tag"><i class="fa-solid ' + ic + '"></i> ' + esc(v.tag) + '</span>' +
      '<h4>' + esc(v.title) + '</h4><p>' + esc(v.text) + '</p><div class="fix">' + v.fix + '</div></article>';
  }).join('');

  /* ---------- Framings scoring ---------- */
  var weights = { evidence: 4, feasible: 3, inclusion: 4, safety: 3 };
  function renderFramings(animate) {
    var total = Object.keys(weights).reduce(function (a, k) { return a + weights[k]; }, 0) || 1;
    var scored = D.framings.map(function (f) {
      var sc = Object.keys(weights).reduce(function (a, k) { return a + f.s[k] * weights[k]; }, 0) / total;
      return Object.assign({}, f, { score: sc });
    }).sort(function (a, b) { return b.score - a.score; });
    var box = $('#framings');
    var first = {};
    $$('.framing', box).forEach(function (el) { first[el.dataset.id] = el.getBoundingClientRect().top; });
    box.innerHTML = scored.map(function (f, i) {
      return '<div class="framing ' + (f.id === 'avail' ? 'selected' : '') + '" data-id="' + f.id + '">' +
        '<span class="rank">' + (i + 1) + '</span>' +
        '<div><h4>' + esc(f.title) + (f.id === 'avail' ? '<span class="chosen">Our pick</span>' : '') + '</h4><p>' + esc(f.text) + '</p></div>' +
        '<div class="bar"><span style="width:' + (f.score / 5) * 100 + '%"></span></div>' +
        '<span class="score">' + f.score.toFixed(2) + '</span></div>';
    }).join('');
    if (animate && hasGSAP && !reduced) {
      $$('.framing', box).forEach(function (el) {
        var prev = first[el.dataset.id];
        if (prev !== undefined) {
          var dy = prev - el.getBoundingClientRect().top;
          if (dy) gsap.fromTo(el, { y: dy }, { y: 0, duration: .7, ease: 'power3.out', clearProps: 'transform' });
        }
      });
    }
  }
  renderFramings(false);
  $$('#weights input').forEach(function (inp) {
    inp.addEventListener('input', function () {
      weights[inp.dataset.w] = +inp.value;
      inp.nextElementSibling.textContent = inp.value;
      inp.style.setProperty('--v', (inp.value / 5 * 100) + '%');
      renderFramings(true);
    });
    inp.style.setProperty('--v', (inp.value / 5 * 100) + '%');
  });

  /* ---------- Countries ---------- */
  var cc = $('#cc-select');
  cc.innerHTML = D.countries.map(function (c) { return '<option value="' + c[1] + '">' + esc(c[0]) + ' (' + c[1] + ')</option>'; }).join('');
  cc.addEventListener('change', function () { $('#cc-prefix').textContent = cc.value; });

  /* ---------- Login demo ---------- */
  var msg = $('#login-msg');
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var num = $('#phone-input').value.replace(/\D/g, '');
    var code = cc.value.replace(/\D/g, '');
    var full = code.length + num.length;
    msg.classList.remove('err');
    if (num.length < 4 || full < 8 || full > 15) {
      msg.textContent = 'Please enter a valid number (E.164 allows 8–15 digits including country code).';
      msg.classList.add('err');
      if (hasGSAP) gsap.fromTo('#login-form', { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)', clearProps: 'x' });
      return;
    }
    msg.textContent = 'Demo: code "sent" to ' + cc.value + ' ' + num + '. No SMS is sent from this prototype.';
    var row = $('#otp-row'); row.hidden = false;
    var inputs = $$('input', row); inputs[0].focus();
    if (hasGSAP && !reduced) gsap.from(inputs, { y: 20, opacity: 0, stagger: .06, duration: .5, ease: 'back.out(2)', clearProps: 'all' });
    inputs.forEach(function (inp, i) {
      inp.oninput = function () {
        inp.value = inp.value.replace(/\D/g, '');
        if (inp.value && inputs[i + 1]) inputs[i + 1].focus();
        if (inputs.every(function (x) { return x.value; })) { msg.textContent = '✓ Signed in (demo). Swagat hai — welcome to Gwalior!'; toast('Signed in — enjoy Beyond the Fort 🪔'); }
      };
      inp.onkeydown = function (ev) { if (ev.key === 'Backspace' && !inp.value && inputs[i - 1]) inputs[i - 1].focus(); };
    });
  });

  /* ---------- Toast ---------- */
  var toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
  var toastT;
  function toast(t) { toastEl.textContent = t; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600); }

  /* ---------- Data: events & guides ---------- */
  var EVENTS = [], GUIDES = [];
  var state = { day: 0, cat: 'all', q: '' };
  function fetchTable(name) {
    // Table API only exists on the hosted platform; skip on file:// to avoid console noise
    if (isFile || !window.fetch) return Promise.resolve(null);
    var ctrl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 4000);
    return fetch('tables/' + name + '?limit=100', ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { return (j && j.data) || null; })
      .catch(function () { clearTimeout(to); return null; });
  }
  var statusLabel = { verified: ['fa-circle-check', 'Verified'], stakeholder: ['fa-user-pen', 'Stakeholder-provided'], inferred: ['fa-wand-magic-sparkles', 'Inferred'] };
  function dayName(d) { return d === 0 ? T('day.today', 'Today') : d === 1 ? T('day.tomorrow', 'Tomorrow') : new Date(Date.now() + d * 864e5).toLocaleDateString(window.BTF_LANG === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long' }); }

  /* FR-04: listing not re-checked for more than 7 days is stale */
  var STALE_DAYS = 7;
  function isStale(e) { return Number(e.last_checked_days || 0) > STALE_DAYS; }
  /* FR-06: fragile sites carry a daily cap — at the cap we stop promoting them */
  function capInfo(e) {
    var cap = Number(e.daily_cap || 0); if (!cap) return null;
    var b = Math.min(cap, Number(e.booked || 0));
    return { cap: cap, booked: b, left: cap - b, pct: Math.round(b / cap * 100) };
  }
  function effectiveCapacity(e) { var c = capInfo(e); return c && c.left <= 0 ? 'full' : e.capacity; }
  function capLabel(c) { return T('cap.' + c, c); }

  function eventCard(e) {
    var st = statusLabel[e.source_status] || statusLabel.inferred;
    var cap = effectiveCapacity(e), ci = capInfo(e), stale = isStale(e);
    return '<article class="event-card ' + (cap === 'full' ? 'is-full ' : '') + (stale ? 'is-stale' : '') + '" data-id="' + esc(e.id) + '" tabindex="0" data-tilt>' +
      '<div class="event-top"><span class="event-cat">' + esc(e.category) + '</span><span class="cap ' + esc(cap) + '">' + esc(capLabel(cap)) + '</span></div>' +
      (stale ? '<div class="stale-flag"><i class="fa-solid fa-hourglass-end"></i> ' + T('stale.flag', 'Not re-checked for') + ' ' + esc(e.last_checked_days) + ' ' + T('stale.days', 'days — confirm before going') + '</div>' : '') +
      '<h4>' + esc(e.title) + '</h4>' +
      (ci ? '<div class="capbar" title="Daily visitor cap for a fragile site"><span style="width:' + ci.pct + '%"></span><em><i class="fa-solid fa-gauge-high"></i> ' + (ci.left > 0 ? ci.left + ' / ' + ci.cap + ' ' + T('cap.left', 'places left today') : T('cap.reached', 'Daily cap reached — protecting the site')) + '</em></div>' : '') +
      '<div class="event-meta">' +
      '<span><i class="fa-regular fa-clock"></i> ' + dayName(+e.day_offset) + ' · ' + esc(e.time) + '</span>' +
      '<span><i class="fa-solid fa-location-dot"></i> ' + esc(e.venue) + '</span>' +
      '<span><i class="fa-solid fa-route"></i> ' + Number(e.distance_km).toFixed(1) + ' km from fort corridor</span></div>' +
      '<div class="event-foot"><span class="badge ' + esc(e.source_status) + '"><i class="fa-solid ' + st[0] + '"></i> ' + st[1] + '</span><span class="event-price">' + esc(e.price) + '</span></div>' +
      '</article>';
  }
  function renderEvents() {
    var q = state.q.toLowerCase();
    var list = EVENTS.filter(function (e) { return state.day === 7 ? true : +e.day_offset === state.day; })
      .filter(function (e) { return state.cat === 'all' || e.category === state.cat; })
      .filter(function (e) { return !q || [e.title, e.venue, e.area, e.category].join(' ').toLowerCase().indexOf(q) > -1; })
      // stale listings are demoted to the end (FR-04), then by day and time
      .sort(function (a, b) { return (isStale(a) - isStale(b)) || (+a.day_offset - +b.day_offset) || String(a.time).localeCompare(String(b.time)); });
    var grid = $('#event-grid');
    if (!list.length) { grid.innerHTML = '<p class="empty">' + T('events.empty', 'Nothing listed for this filter yet — try another day or category.') + '</p>'; return; }
    var html = list.map(eventCard).join('');
    var full = list.filter(function (e) { return effectiveCapacity(e) === 'full'; });
    if (full.length) {
      // plan B never promotes stale or capped-out listings
      var alts = EVENTS.filter(function (e) { return effectiveCapacity(e) !== 'full' && !isStale(e) && +e.day_offset <= Math.max(1, +full[0].day_offset); })
        .sort(function (a, b) { return a.distance_km - b.distance_km; }).slice(0, 3);
      html = '<div class="planb"><i class="fa-solid fa-life-ring"></i><div><h4>' + esc(full[0].title.split('—')[0].trim()) + ' ' + T('planb.full', 'is full — here\'s your plan B') + '</h4>' +
        '<p>' + alts.map(function (a) { return '<b>' + esc(a.title) + '</b> (' + dayName(+a.day_offset) + ' ' + esc(a.time) + ', ' + Number(a.distance_km).toFixed(1) + ' km)'; }).join(' · ') + '</p></div></div>' + html;
    }
    grid.innerHTML = html;
    if (hasGSAP && !reduced) {
      gsap.fromTo($$('.event-card, .planb', grid), { y: 50, opacity: 0, rotateX: -18 }, { y: 0, opacity: 1, rotateX: 0, duration: .8, stagger: .06, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
    bindTilt(grid);
  }
  function openEvent(id) {
    var e = EVENTS.filter(function (x) { return String(x.id) === String(id); })[0]; if (!e) return;
    var st = statusLabel[e.source_status] || statusLabel.inferred;
    var mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.venue + ', Gwalior');
    $('#modal-body').innerHTML =
      '<span class="badge ' + esc(e.source_status) + '"><i class="fa-solid ' + st[0] + '"></i> ' + st[1] + '</span>' +
      '<h3>' + esc(e.title) + '</h3><p>' + esc(e.description || '') + '</p>' +
      '<p><i class="fa-regular fa-clock"></i> ' + dayName(+e.day_offset) + ' · ' + esc(e.time) + ' &nbsp; <i class="fa-solid fa-ticket"></i> ' + esc(e.price) + ' &nbsp; <span class="cap ' + esc(effectiveCapacity(e)) + '">' + esc(capLabel(effectiveCapacity(e))) + '</span></p>' +
      '<p class="sens"><b>Local norms:</b> ' + esc(e.sensitivity || 'None noted.') + '</p>' +
      '<p class="checked"><i class="fa-solid fa-calendar-check"></i> Last checked: ' + (Number(e.last_checked_days || 0) === 0 ? 'today' : esc(e.last_checked_days) + ' days ago') + (isStale(e) ? ' — <b>stale, demoted in results</b>' : '') + '</p>' +
      (capInfo(e) ? '<p class="checked"><i class="fa-solid fa-gauge-high"></i> Fragile site: daily cap of ' + capInfo(e).cap + ' visitors (' + capInfo(e).left + ' left). Promotion pauses at the cap.</p>' : '') +
      (e.source_status !== 'verified' ? '<p class="unverified">This listing is not independently verified. Please confirm timings with the host before travelling.</p>' : '') +
      '<div class="modal-actions"><a class="btn btn-gold" href="' + mapUrl + '" target="_blank" rel="noopener"><i class="fa-solid fa-map-location-dot"></i> Open in maps</a>' +
      '<button class="btn btn-line" id="modal-save"><i class="fa-regular fa-bookmark"></i> Save to my day</button></div>';
    var dlg = $('#event-modal');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    if (lenis) lenis.stop();
    $('#modal-save').onclick = function () { toast('Saved to your day plan'); };
  }
  function closeModal() { var d = $('#event-modal'); if (d.close) d.close(); else d.removeAttribute('open'); }
  $('#event-modal').addEventListener('close', function () { if (lenis) lenis.start(); });
  $('#event-grid').addEventListener('click', function (e) { var c = e.target.closest('.event-card'); if (c) openEvent(c.dataset.id); });
  $('#event-grid').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var c = e.target.closest('.event-card'); if (c) openEvent(c.dataset.id); } });
  $('.modal-close').addEventListener('click', closeModal);
  $('#event-modal').addEventListener('click', function (e) { if (e.target.id === 'event-modal') closeModal(); });

  $$('#day-tabs button').forEach(function (b) { b.addEventListener('click', function () { $$('#day-tabs button').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); state.day = +b.dataset.day; renderEvents(); }); });
  $$('#cat-tabs button').forEach(function (b) { b.addEventListener('click', function () { $$('#cat-tabs button').forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); state.cat = b.dataset.cat; renderEvents(); }); });
  var sT; $('#event-search').addEventListener('input', function (e) { clearTimeout(sT); sT = setTimeout(function () { state.q = e.target.value; renderEvents(); }, 200); });

  function renderGuides() {
    $('#guide-grid').innerHTML = GUIDES.map(function (g) {
      var initials = String(g.name).split(' ').map(function (s) { return s[0]; }).join('').slice(0, 2);
      var sites = Array.isArray(g.sites) ? g.sites : [];
      var langs = Array.isArray(g.languages) ? g.languages : [];
      return '<article class="guide-card" data-tilt>' +
        '<div class="guide-avatar"><span>' + esc(initials) + '</span></div>' +
        '<span class="guide-role">' + esc(g.role) + '</span><h4>' + esc(g.name) + '</h4>' +
        '<p class="guide-spec">' + esc(g.specialty) + '</p>' +
        '<div class="guide-chips">' + sites.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + langs.map(function (l) { return '<span>🗣 ' + esc(l) + '</span>'; }).join('') + '</div>' +
        '<div class="guide-checks">' +
        '<span class="' + (g.site_qualified ? 'ok' : 'no') + '"><i class="fa-solid ' + (g.site_qualified ? 'fa-circle-check' : 'fa-clock') + '"></i> ' + (g.site_qualified ? 'Qualified for listed sites' : 'Qualification pending') + '</span>' +
        '<span class="' + (g.accountable ? 'ok' : 'no') + '"><i class="fa-solid ' + (g.accountable ? 'fa-circle-check' : 'fa-circle-exclamation') + '"></i> ' + (g.accountable ? 'Accountable: masked contact + complaints' : 'Accountability not yet set up') + '</span>' +
        '<span class="cred"><i class="fa-solid fa-certificate"></i> ' + esc(g.credential) + '</span></div>' +
        '<div class="guide-rating"><i class="fa-solid fa-star"></i> ' + Number(g.rating).toFixed(1) + ' · ' + esc(g.tours) + ' completed tours</div>' +
        '<button class="btn guide-contact" data-name="' + esc(g.name) + '"><i class="fa-solid fa-phone-slash"></i> Contact via masked line</button></article>';
    }).join('') || '<p class="empty">No guides listed yet.</p>';
    $$('.guide-contact').forEach(function (b) { b.addEventListener('click', function () { toast('Demo: masked call request sent to ' + b.dataset.name + '. Numbers stay hidden.'); }); });
    bindTilt($('#guide-grid'));
    if (hasST && !reduced) {
      gsap.fromTo($$('.guide-card'), { y: 80, opacity: 0, rotateY: 20 }, { y: 0, opacity: 1, rotateY: 0, duration: 1, stagger: .1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '#guide-grid', start: 'top 88%', once: true } });
    }
  }

  var API_OK = false;
  Promise.all([fetchTable('events'), fetchTable('guides')]).then(function (res) {
    API_OK = !!(res[0] && res[0].length);
    EVENTS = API_OK ? res[0] : D.fallbackEvents.slice();
    GUIDES = res[1] && res[1].length ? res[1] : D.fallbackGuides;
    // approved local submissions (offline / no-API mode) join the board
    if (!API_OK) localQueue().filter(function (s) { return s.status === 'approved'; }).forEach(function (s) { EVENTS.push(toEvent(s)); });
    renderEvents(); renderGuides(); loadQueue();
    if (hasST) ScrollTrigger.refresh();
  });

  /* ---------- Operator submission + verification queue (FR-08) ---------- */
  var LS_KEY = 'btf_submissions';
  function localQueue() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) { return []; } }
  function saveLocal(list) { try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { } }
  function dayOffsetFrom(dateStr) {
    var d = new Date(dateStr + 'T00:00:00'), t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((d - t) / 864e5);
  }
  function toEvent(s) {
    return {
      id: s.id, title: s.title, category: s.category, venue: s.venue, area: s.area, day_offset: dayOffsetFrom(s.date), time: s.time,
      capacity: 'open', price: s.price || 'Free', distance_km: Number(s.distance_km) || 0, source_status: 'stakeholder', last_checked_days: 0,
      daily_cap: s.fragile ? Number(s.daily_cap) || 40 : 0, booked: 0, sensitivity: s.sensitivity || '', description: s.description || ''
    };
  }
  var QUEUE = [];
  var subForm = $('#submit-form'), subMsg = $('#submit-msg');
  var fragileBox = subForm.querySelector('[name=fragile]'), capLbl = subForm.querySelector('.f-cap');
  fragileBox.addEventListener('change', function () { capLbl.hidden = !fragileBox.checked; });
  (function setMinDate() {
    var d = new Date(), iso = new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    var inp = subForm.querySelector('[name=date]'); inp.min = iso; inp.value = iso;
  })();

  function loadQueue() {
    if (isFile) { QUEUE = localQueue(); renderQueue(); return; }
    fetchTable('event_submissions').then(function (rows) {
      QUEUE = rows ? rows : localQueue();
      QUEUE.__api = !!rows;
      renderQueue();
    });
  }
  function renderQueue() {
    var pending = QUEUE.filter(function (s) { return s.status === 'pending'; });
    $('#queue-count').textContent = pending.length;
    var items = QUEUE.slice().sort(function (a, b) { return (a.status !== 'pending') - (b.status !== 'pending') || (b.created_at || 0) - (a.created_at || 0); }).slice(0, 12);
    $('#queue-list').innerHTML = items.length ? items.map(function (s) {
      return '<li class="q-item q-' + esc(s.status) + '" data-id="' + esc(s.id) + '">' +
        '<div class="q-top"><span class="q-cat">' + esc(s.category) + '</span><span class="q-status">' + esc(s.status) + '</span></div>' +
        '<b>' + esc(s.title) + '</b><span class="q-meta">' + esc(s.venue) + ' · ' + esc(s.date) + ' ' + esc(s.time) + (s.fragile ? ' · cap ' + esc(s.daily_cap) : '') + '</span>' +
        (s.status === 'pending' ? '<div class="q-actions"><button class="q-ok" data-act="approved"><i class="fa-solid fa-check"></i> Approve</button><button class="q-no" data-act="rejected"><i class="fa-solid fa-xmark"></i> Reject</button></div>' : '') +
        '</li>';
    }).join('') : '<li class="q-empty">No submissions yet. Use the form to add one.</li>';
  }
  function api(method, url, body) {
    return fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.status === 204 ? null : r.json(); });
  }

  subForm.addEventListener('submit', function (e) {
    e.preventDefault();
    subMsg.classList.remove('err');
    var fd = new FormData(subForm), s = {};
    fd.forEach(function (v, k) { s[k] = typeof v === 'string' ? v.trim() : v; });
    if (!s.title || !s.venue || !s.area || !s.date || !s.time) {
      subMsg.textContent = 'Please fill in title, venue, area, date and time.'; subMsg.classList.add('err');
      if (hasGSAP) gsap.fromTo(subForm, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)', clearProps: 'x' });
      return;
    }
    if (dayOffsetFrom(s.date) < 0) { subMsg.textContent = 'The date cannot be in the past.'; subMsg.classList.add('err'); return; }
    var rec = {
      title: s.title, category: s.category, venue: s.venue, area: s.area, date: s.date, time: s.time, price: s.price || 'Free',
      distance_km: Number(s.distance_km) || 0, sensitivity: s.sensitivity || '', description: s.description || '',
      fragile: !!s.fragile, daily_cap: s.fragile ? Number(s.daily_cap) || 40 : 0, status: 'pending'
    };
    var btn = subForm.querySelector('button[type=submit]'); btn.disabled = true;
    var done = function (saved) {
      QUEUE.unshift(saved); renderQueue(); subForm.reset(); capLbl.hidden = true;
      subMsg.textContent = '✓ Received. It will appear on the board as “Stakeholder-provided” once a moderator approves it.';
      toast('Event sent for verification');
      btn.disabled = false;
      var first = $('#queue-list li'); if (first && hasGSAP && !reduced) gsap.from(first, { x: 40, opacity: 0, duration: .6, ease: 'power3.out' });
    };
    if (QUEUE.__api) {
      api('POST', 'tables/event_submissions', rec).then(done).catch(function () {
        rec.id = 'local-' + Date.now(); rec.created_at = Date.now(); var l = localQueue(); l.unshift(rec); saveLocal(l); done(rec);
      });
    } else {
      rec.id = 'local-' + Date.now(); rec.created_at = Date.now(); var l = localQueue(); l.unshift(rec); saveLocal(l); done(rec);
    }
  });

  $('#queue-list').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-act]'); if (!b) return;
    var li = b.closest('li'), id = li.dataset.id, act = b.dataset.act;
    var s = QUEUE.filter(function (x) { return String(x.id) === String(id); })[0]; if (!s) return;
    var finish = function () {
      s.status = act; renderQueue();
      if (act === 'approved') {
        EVENTS.push(toEvent(s)); renderEvents();
        toast('Approved — now live on the event board');
      } else toast('Submission rejected');
    };
    if (QUEUE.__api && String(id).indexOf('local-') !== 0) {
      api('PATCH', 'tables/event_submissions/' + encodeURIComponent(id), { status: act })
        .then(function () { return act === 'approved' && API_OK ? api('POST', 'tables/events', toEvent(s)) : null; })
        .then(function (created) { if (created && created.id) s.id = created.id; finish(); })
        .catch(function () { toast('Could not reach the server — try again'); });
    } else {
      var l = localQueue().map(function (x) { if (String(x.id) === String(id)) x.status = act; return x; }); saveLocal(l); finish();
    }
  });

  /* re-render dynamic text when the language changes */
  window.addEventListener('btf:lang', function () { if (EVENTS.length) renderEvents(); });

  /* ---------- 3D tilt (GSAP-driven, no CSS transition fight) ---------- */
  function bindTilt(root) {
    if (!finePointer || reduced) return;
    $$('[data-tilt]', root || document).forEach(function (el) {
      if (el.__tilt) return; el.__tilt = true;
      var rx, ry;
      if (hasGSAP) {
        gsap.set(el, { transformPerspective: 900 });
        rx = gsap.quickTo(el, 'rotationX', { duration: .5, ease: 'power3.out' });
        ry = gsap.quickTo(el, 'rotationY', { duration: .5, ease: 'power3.out' });
      }
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        if (rx) { rx((.5 - y) * 9); ry((x - .5) * 11); }
        el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
      });
      el.addEventListener('pointerleave', function () { if (rx) { rx(0); ry(0); } });
    });
  }
  bindTilt();

  /* ---------- Custom cursor: dot is EXACTLY on the pointer, ring follows tightly ---------- */
  var ring = $('#cursor-ring'), dot = $('#cursor-dot');
  if (finePointer && !reduced) {
    document.documentElement.classList.add('custom-cursor');
    var tx = -100, ty = -100, rxp = -100, ryp = -100, last = performance.now(), visible = false;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      if (!visible) { visible = true; rxp = tx; ryp = ty; ring.classList.add('on'); dot.classList.add('on'); }
    }, { passive: true });
    document.addEventListener('pointerleave', function () { visible = false; ring.classList.remove('on'); dot.classList.remove('on'); });
    (function loop(now) {
      var dt = Math.min(64, now - last); last = now;
      var k = 1 - Math.exp(-dt / 45); // ~45ms time-constant → feels attached, still silky
      rxp += (tx - rxp) * k; ryp += (ty - ryp) * k;
      ring.style.transform = 'translate3d(' + rxp + 'px,' + ryp + 'px,0)';
      requestAnimationFrame(loop);
    })(last);
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      ring.classList.toggle('hover', !!t.closest('a,button,[data-tilt],.ev-card,select,label'));
      ring.classList.toggle('text', !!t.closest('input[type=search],input[type=tel],input[inputmode]'));
    });
    document.addEventListener('pointerdown', function () { ring.classList.add('down'); });
    document.addEventListener('pointerup', function () { ring.classList.remove('down'); });

    $$('.magnetic').forEach(function (m) {
      var mx = hasGSAP ? gsap.quickTo(m, 'x', { duration: .4, ease: 'power3.out' }) : null;
      var my = hasGSAP ? gsap.quickTo(m, 'y', { duration: .4, ease: 'power3.out' }) : null;
      m.addEventListener('pointermove', function (e) { if (!mx) return; var r = m.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .3); my((e.clientY - r.top - r.height / 2) * .4); });
      m.addEventListener('pointerleave', function () { if (mx) { mx(0); my(0); } });
    });
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
    lenis.on('scroll', function (l) {
      window.__btfScroll = l.progress; // the 3D camera reads this → same timing as the page
      if (hasST) ScrollTrigger.update();
    });
    if (hasGSAP) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }
  }

  /* ---------- Header / nav ---------- */
  var header = $('#site-header');
  var nav = $('#main-nav'), tog = $('#menu-toggle');
  tog.addEventListener('click', function () { var o = nav.classList.toggle('open'); tog.setAttribute('aria-expanded', o); });
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault(); nav.classList.remove('open'); tog.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.scrollTo(t, { offset: -60, duration: 1.6 }); else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  var prog2 = $('#scroll-progress');
  var sections = $$('main section[id]');
  var navLinks = $$('#main-nav a');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', y > 40);
    prog2.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    var cur = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Split words ---------- */
  function splitWords(el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'word';
            var i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1) walk(ch);
      });
    };
    walk(el);
  }
  $$('.split-words').forEach(splitWords);

  /* ---------- Hero intro ---------- */
  function heroIntro() {
    countUp();
    if (!hasGSAP || reduced) return;
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero-title .split', { yPercent: 115, rotate: 5, duration: 1.6, stagger: .12 })
      .from('#hero-section .reveal-up', { y: 40, opacity: 0, duration: 1.2, stagger: .1 }, '-=1.25')
      .from('.hero-stats .stat', { y: 30, opacity: 0, duration: 1, stagger: .1 }, '-=.9')
      .from('.hero-showcase', { y: 60, opacity: 0, scale: .92, duration: 2 }, 0.1)
      .from('#site-header', { y: -80, opacity: 0, duration: 1 }, '-=1.6');
  }
  function countUp() {
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count, t0 = performance.now();
      (function step(t) { var p = Math.min(1, (t - t0) / 1800); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
    });
  }

  /* ---------- Scroll animations ---------- */
  if (hasST && !reduced) {
    var once = function (trigger, start) { return { trigger: trigger, start: start || 'top 85%', once: true }; };

    $$('.split-words').forEach(function (el) {
      gsap.from($$('.word > span', el), { yPercent: 115, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: .03, scrollTrigger: once(el, 'top 88%') });
    });
    $$('.kicker, .section-lede').forEach(function (el) { gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: once(el, 'top 92%') }); });

    // ribbon: rows drift slightly with scroll direction + velocity (flat, no tilt)
    var ra = $('.ribbon-a .ribbon-track'), rb = $('.ribbon-b .ribbon-track');
    var baseA = 0, baseB = 0, boost = 0;
    var wA = function () { return ra.scrollWidth / 3; }, wB = function () { return rb.scrollWidth / 3; };
    var ribbonOn = true;
    ScrollTrigger.create({ trigger: '.ribbon', start: 'top bottom', end: 'bottom top', onToggle: function (s) { ribbonOn = s.isActive; }, onUpdate: function (s) { boost = Math.max(-6, Math.min(6, s.getVelocity() / 300)); } });
    gsap.ticker.add(function (time, dt) {
      if (!ribbonOn) return;
      boost *= .92;
      var sp = (dt / 16.67);
      baseA -= (0.6 + Math.abs(boost)) * sp; baseB += (0.6 + Math.abs(boost)) * sp;
      var a = wA(), b = wB();
      if (a && baseA <= -a) baseA += a;
      if (b && baseB >= 0) baseB -= b;
      ra.style.transform = 'translate3d(' + baseA + 'px,0,0)';
      rb.style.transform = 'translate3d(' + baseB + 'px,0,0)';
    });
    baseB = -(rb.scrollWidth / 3);
    gsap.from('.ribbon-row', { opacity: 0, y: 30, duration: 1.2, stagger: .15, ease: 'expo.out', scrollTrigger: once('.ribbon', 'top 95%') });

    gsap.from('.heritage-card', { y: 90, opacity: 0, scale: .94, duration: 1.1, stagger: .09, ease: 'expo.out', clearProps: 'scale,y,opacity', scrollTrigger: once('#heritage-grid') });
    gsap.from('.heritage-card .jharokha', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, stagger: .09, ease: 'expo.out', scrollTrigger: once('#heritage-grid') });
    gsap.from('.flavour', { x: -40, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: once('#flavours', 'top 90%') });
    gsap.from('.nature-card', { y: 90, opacity: 0, duration: 1.1, stagger: .09, ease: 'expo.out', clearProps: 'y,opacity', scrollTrigger: once('#nature-grid') });
    gsap.from('.submit-card, .queue-card', { y: 70, opacity: 0, duration: 1.1, stagger: .15, ease: 'expo.out', clearProps: 'y,opacity', scrollTrigger: once('.submit-layout') });
    $$('.divider').forEach(function (d) { gsap.from($('span', d), { scaleX: 0, duration: 1.6, ease: 'expo.inOut', scrollTrigger: once(d, 'top 92%') }); });

    gsap.from('.problem-card', { y: 120, opacity: 0, rotateX: -25, duration: 1.3, stagger: .2, ease: 'expo.out', clearProps: 'y,opacity', scrollTrigger: once('.loop-wrap', 'top 82%') });
    gsap.from('.loop-center', { scale: 0, rotate: -180, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: once('.loop-wrap', 'top 78%') });
    gsap.from('.ev-card', { y: 100, opacity: 0, rotateY: -35, duration: 1.1, stagger: .08, ease: 'power3.out', scrollTrigger: once('#evidence-grid', 'top 85%') });
    gsap.from('.flow-steps li', { y: 80, opacity: 0, scale: .9, duration: .9, stagger: .08, ease: 'back.out(1.5)', clearProps: 'transform', scrollTrigger: once('#flow-steps', 'top 88%') });
    gsap.from('.weights', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: once('.weights', 'top 90%') });
    gsap.from('.framing', { x: -50, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: once('#framings', 'top 88%') });
    gsap.from('.check-card', { y: 60, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', scrollTrigger: once('.two-checks', 'top 88%') });
    gsap.from('.verdict', { y: 80, opacity: 0, rotateX: -18, duration: 1, stagger: .08, ease: 'power3.out', clearProps: 'y,opacity', scrollTrigger: once('#verdict-grid', 'top 88%') });
    gsap.from('.req', { x: -60, opacity: 0, duration: .8, stagger: .06, ease: 'power3.out', clearProps: 'x,opacity', scrollTrigger: once('.srs-reqs', 'top 82%') });
    gsap.from('.road-item', { x: 60, opacity: 0, duration: .9, stagger: .15, ease: 'power3.out', scrollTrigger: once('#roadmap', 'top 82%') });
    gsap.to('.road-line span', { height: '100%', ease: 'none', scrollTrigger: { trigger: '#roadmap', start: 'top 70%', end: 'bottom 60%', scrub: .6 } });
    gsap.from('.statement-tags span', { y: 30, opacity: 0, stagger: .08, duration: .8, scrollTrigger: once('.statement-tags', 'top 92%') });
    gsap.from('.boundary-card', { scale: .88, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: once('.boundary-card') });
    gsap.from('.login-card', { rotateY: 25, x: 80, opacity: 0, duration: 1.2, ease: 'expo.out', clearProps: 'x,opacity', scrollTrigger: once('.login-card') });
    gsap.from('.terminal', { y: 60, opacity: 0, scale: .97, duration: 1.1, ease: 'expo.out', scrollTrigger: once('#terminal', 'top 90%') });
    gsap.from('.footer-big', { yPercent: 60, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: once('#site-footer', 'top 92%') });
    gsap.from('.footer-skyline .fs-art', { y: 60, opacity: 0, duration: 1.4, stagger: .1, ease: 'expo.out', scrollTrigger: once('#site-footer', 'top 95%') });

    // hero parallax (scrubbed, smooth)
    gsap.to('.hero-title', { yPercent: -28, opacity: .15, ease: 'none', scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom top', scrub: .5 } });
    gsap.to('.hero-showcase', { yPercent: 18, opacity: .25, ease: 'none', scrollTrigger: { trigger: '#hero-section', start: 'top top', end: 'bottom top', scrub: .5 } });

    // statement: words light up as you read
    var sWords = $$('#statement-quote .word > span');
    gsap.fromTo(sWords, { opacity: .18 }, { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: '#statement-quote', start: 'top 75%', end: 'bottom 45%', scrub: .5 } });

    // Horizontal workflow scroll (pinned)
    var track = $('#hscroll-track');
    var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
    gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: {
        trigger: '#hscroll', start: 'center center', end: function () { return '+=' + dist(); },
        pin: '#workflow-section', scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (s) { $('#hscroll-bar').style.transform = 'scaleX(' + s.progress + ')'; }
      }
    });
    gsap.from('.wf-step', { y: 100, opacity: 0, rotateZ: 2, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: once('#hscroll', 'top 88%') });

    ScrollTrigger.create({ trigger: '#terminal', start: 'top 75%', once: true, onEnter: typeTrail });

    // Recalculate positions once fonts & images are in (prevents pin jumps)
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    var rT; window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { ScrollTrigger.refresh(); }, 200); });
  } else {
    $('#hscroll').style.overflowX = 'auto';
    $$('.ribbon-track').forEach(function (t) { t.classList.add('css-anim'); });
    typeTrail();
  }

  /* ---------- Reasoning trail typing ---------- */
  var typed = false;
  function typeTrail() {
    if (typed) return; typed = true;
    var body = $('#term-body');
    var lines = D.trail, li = 0;
    function nextLine() {
      if (li >= lines.length) { body.insertAdjacentHTML('beforeend', '<span class="caret"></span>'); return; }
      var L = lines[li++];
      var row = document.createElement('div');
      row.innerHTML = '<span style="color:#6b6380">[' + String(li).padStart(2, '0') + ']</span> <span class="' + L[0] + '">' + L[1] + '</span> → <span class="txt"></span>';
      body.appendChild(row);
      var span = $('.txt', row), ci = 0, text = L[2];
      if (reduced) { span.textContent = text; nextLine(); return; }
      (function typeCh() { span.textContent = text.slice(0, ++ci); if (ci < text.length) setTimeout(typeCh, 12); else setTimeout(nextLine, 140); })();
    }
    nextLine();
  }
})();
