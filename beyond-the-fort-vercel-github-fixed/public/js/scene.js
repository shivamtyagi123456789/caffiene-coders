/* =========================================================
   Beyond the Fort — procedural 3D Gwalior-inspired hill fort
   ---------------------------------------------------------
   CLASSIC SCRIPT (no ES modules, no import maps, no CDN).
   It uses the global THREE from js/vendor/three.min.js, so it
   works when index.html is opened straight from a folder
   (file://), from a zip, or from any static host — offline too.
   If WebGL is not available, a static SVG fort is shown instead.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  function fallback(reason) {
    root.classList.add('no-webgl');
    if (window.console) console.info('[BTF] 3D scene disabled → static fort fallback:', reason);
    window.__sceneReady = true;
    window.dispatchEvent(new CustomEvent('scene:ready'));
  }

  if (/[?&]nogl\b/.test(location.search) || window.__BTF_NOGL) { fallback('disabled via ?nogl'); return; }
  if (typeof window.THREE === 'undefined') { fallback('three.js not loaded'); return; }
  var canvas = document.getElementById('scene-canvas');
  if (!canvas) { fallback('no canvas'); return; }

  // quick WebGL capability test
  try {
    var test = document.createElement('canvas');
    if (!(test.getContext('webgl2') || test.getContext('webgl') || test.getContext('experimental-webgl'))) { fallback('WebGL unsupported'); return; }
  } catch (e) { fallback('WebGL test failed'); return; }

  var THREE = window.THREE;
  var isMobile = window.matchMedia('(max-width: 768px)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
  } catch (e) { fallback('renderer error'); return; }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); root.classList.add('no-webgl'); }, false);
  canvas.addEventListener('webglcontextrestored', function () { root.classList.remove('no-webgl'); }, false);

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a1438, 0.016);

  var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 420);
  camera.position.set(0, 8, 46);

  /* ---------- Sky dome (gradient shader with soft aurora bands) ---------- */
  var skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      uTop: { value: new THREE.Color(0x07061a) },
      uMid: { value: new THREE.Color(0x2a1d55) },
      uBottom: { value: new THREE.Color(0xc4553a) },
      uShift: { value: 0 }, uTime: { value: 0 }
    },
    vertexShader: 'varying vec3 vPos; void main(){ vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: [
      'uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBottom; uniform float uShift; uniform float uTime; varying vec3 vPos;',
      'void main(){',
      '  float h = vPos.y + uShift*0.12;',
      '  vec3 c = mix(uBottom, uMid, smoothstep(-0.05, 0.2, h));',
      '  c = mix(c, uTop, smoothstep(0.2, 0.75, h));',
      '  float band = sin(vPos.x*3.0 + uTime*0.05) * sin(vPos.z*2.0 - uTime*0.04);',
      '  c += vec3(0.9,0.45,0.25) * 0.05 * smoothstep(0.0,1.0,band) * smoothstep(0.35,0.05,abs(h-0.15));',
      '  gl_FragColor = vec4(c,1.0);',
      '}'
    ].join('\n')
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(210, 32, 16), skyMat));

  /* ---------- Lights ---------- */
  scene.add(new THREE.HemisphereLight(0xffc98a, 0x1a1438, 0.6));
  var sun = new THREE.DirectionalLight(0xffa860, 2.1);
  sun.position.set(-30, 18, -20); scene.add(sun);
  var rim = new THREE.DirectionalLight(0x6a7bff, 0.6);
  rim.position.set(30, 20, 30); scene.add(rim);

  /* ---------- Glow texture (used by moon halo, diyas, fireflies) ---------- */
  function glowTexture(inner, mid) {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, inner || 'rgba(255,235,170,1)');
    g.addColorStop(.25, mid || 'rgba(255,170,70,.9)');
    g.addColorStop(.6, 'rgba(196,85,58,.22)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
    var t = new THREE.CanvasTexture(c);
    if ('colorSpace' in t) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  var glowTex = glowTexture();

  /* Moon + halo sprite */
  var moon = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.MeshBasicMaterial({ color: 0xffd68a, transparent: true, opacity: .95, fog: false }));
  moon.position.set(-45, 22, -120); scene.add(moon);
  var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffc070, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  halo.scale.set(48, 48, 1); halo.position.copy(moon.position).add(new THREE.Vector3(0, 0, -1)); scene.add(halo);

  /* ---------- Materials ---------- */
  var sandstone = new THREE.MeshStandardMaterial({ color: 0xd9a86c, roughness: .85, metalness: .05, flatShading: true });
  var sandstoneDark = new THREE.MeshStandardMaterial({ color: 0xa8714a, roughness: .9, flatShading: true });
  var tile = new THREE.MeshStandardMaterial({ color: 0x2aa198, roughness: .4, metalness: .3, emissive: 0x0b3b38, emissiveIntensity: .5 });
  var tileYellow = new THREE.MeshStandardMaterial({ color: 0xe8b04a, roughness: .45, metalness: .2, emissive: 0x3a2a08, emissiveIntensity: .4 });
  var gold = new THREE.MeshStandardMaterial({ color: 0xe8b04a, roughness: .3, metalness: .8, emissive: 0x5a3a08, emissiveIntensity: .5 });
  var rock = new THREE.MeshStandardMaterial({ color: 0x3b2a4a, roughness: 1, flatShading: true });
  var windowMat = new THREE.MeshBasicMaterial({ color: 0xffb860 });
  var saffron = new THREE.MeshBasicMaterial({ color: 0xff8a1f, side: THREE.DoubleSide });

  var fort = new THREE.Group(); scene.add(fort);

  /* deterministic random so the scene looks identical on every computer */
  var seed = 1337;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  /* ---------- Plateau (hill) ---------- */
  var hillGeo = new THREE.CylinderGeometry(22, 30, 7, 28, 4, false);
  var hp = hillGeo.attributes.position;
  for (var i = 0; i < hp.count; i++) {
    if (hp.getY(i) < 3.4) { var n = rnd() * .1; hp.setX(i, hp.getX(i) * (1 + n)); hp.setZ(i, hp.getZ(i) * (1 + n)); }
  }
  hillGeo.computeVertexNormals();
  var hill = new THREE.Mesh(hillGeo, rock);
  hill.scale.set(1.5, 1, .55); hill.position.y = -3.5; fort.add(hill);

  /* ground */
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600, 60, 60), new THREE.MeshStandardMaterial({ color: 0x15102a, roughness: 1, flatShading: true }));
  var gp = ground.geometry.attributes.position;
  for (i = 0; i < gp.count; i++) gp.setZ(i, Math.sin(gp.getX(i) * .05) * Math.cos(gp.getY(i) * .04) * 1.5);
  ground.geometry.computeVertexNormals();
  ground.rotation.x = -Math.PI / 2; ground.position.y = -7; scene.add(ground);

  /* Lake (shimmering reflective water in front of the fort) */
  var lakeMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: [
      'uniform float uTime; varying vec2 vUv;',
      'void main(){',
      '  vec2 p = vUv - .5; float d = length(p*vec2(1.0,2.2));',
      '  float a = smoothstep(.5,.35,d);',
      '  float w = sin(vUv.x*60.0 + uTime*1.2)*sin(vUv.y*90.0 - uTime*.9);',
      '  float glint = smoothstep(.75,1.0,w) * smoothstep(.45,.0,abs(vUv.x-.32));',
      '  vec3 base = mix(vec3(.08,.06,.2), vec3(.45,.2,.25), smoothstep(.0,.5,vUv.y));',
      '  vec3 col = base + vec3(1.0,.75,.4)*glint*.9;',
      '  gl_FragColor = vec4(col, a*.85);',
      '}'
    ].join('\n')
  });
  var lake = new THREE.Mesh(new THREE.PlaneGeometry(90, 40), lakeMat);
  lake.rotation.x = -Math.PI / 2; lake.position.set(-5, -6.85, 34); scene.add(lake);

  /* ---------- Builders ---------- */
  function chhatri(scale) {
    scale = scale || 1;
    var g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .2, 8), sandstone));
    for (var k = 0; k < 6; k++) {
      var a = (k / 6) * Math.PI * 2;
      var p = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 1, 6), sandstone);
      p.position.set(Math.cos(a) * .7, .6, Math.sin(a) * .7); g.add(p);
    }
    var cap = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, .15, 8), sandstoneDark); cap.position.y = 1.15; g.add(cap);
    var dome = new THREE.Mesh(new THREE.SphereGeometry(.75, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), tile); dome.position.y = 1.2; g.add(dome);
    var fin = new THREE.Mesh(new THREE.ConeGeometry(.1, .6, 6), gold); fin.position.y = 2.1; g.add(fin);
    g.scale.setScalar(scale);
    return g;
  }
  function tower(h, r) {
    h = h || 5; r = r || 1.3;
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CylinderGeometry(r * .9, r * 1.1, h, 12), sandstone); body.position.y = h / 2; g.add(body);
    var band = new THREE.Mesh(new THREE.CylinderGeometry(r * .93, r * .93, .35, 12), tile); band.position.y = h * .72; g.add(band);
    var band2 = new THREE.Mesh(new THREE.CylinderGeometry(r * .95, r * .95, .18, 12), tileYellow); band2.position.y = h * .6; g.add(band2);
    var c = chhatri(r * .95); c.position.y = h; g.add(c);
    return g;
  }
  function wallSegment(len, h) {
    h = h || 2.6;
    var g = new THREE.Group();
    var w = new THREE.Mesh(new THREE.BoxGeometry(len, h, .9), sandstone); w.position.y = h / 2; g.add(w);
    var cnt = Math.floor(len / .9);
    for (var k = 0; k < cnt; k++) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .95), sandstoneDark);
      m.position.set(-len / 2 + .45 + k * .9, h + .25, 0); g.add(m);
    }
    var band = new THREE.Mesh(new THREE.BoxGeometry(len, .25, .95), tile); band.position.y = h * .7; g.add(band);
    return g;
  }

  /* ---------- Rampart ring ---------- */
  var pts = [], RX = 26, RZ = 10, N = 14;
  for (i = 0; i < N; i++) { var an = (i / N) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(an) * RX, 0, Math.sin(an) * RZ)); }
  for (i = 0; i < N; i++) {
    var a = pts[i], b = pts[(i + 1) % N];
    var seg = wallSegment(a.distanceTo(b));
    seg.position.copy(a).lerp(b, .5);
    seg.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
    fort.add(seg);
    var tw = tower(4.2 + (i % 3) * .6, 1.25); tw.position.copy(a); fort.add(tw);
  }

  /* ---------- Palace (Man Mandir inspired) ---------- */
  var palace = new THREE.Group();
  var pBody = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 4), sandstone); pBody.position.y = 2.5; palace.add(pBody);
  var palaceWindows = [];
  for (var row = 0; row < 2; row++) for (i = 0; i < 9; i++) {
    var win = new THREE.Mesh(new THREE.PlaneGeometry(.6, .9), windowMat.clone());
    win.position.set(-6 + i * 1.5, 1.6 + row * 2, 2.01); palace.add(win); palaceWindows.push(win);
  }
  var tileBand = new THREE.Mesh(new THREE.BoxGeometry(14.1, .5, 4.1), tile); tileBand.position.y = 4.4; palace.add(tileBand);
  var tileBand2 = new THREE.Mesh(new THREE.BoxGeometry(14.1, .22, 4.1), tileYellow); tileBand2.position.y = 3.95; palace.add(tileBand2);
  [-7, -2.4, 2.4, 7].forEach(function (x, k) { var t = tower(6.5 + (k % 2), 1.1); t.position.set(x, 0, 2); palace.add(t); });
  palace.position.set(-6, 0, 2); fort.add(palace);

  /* ---------- Temple shikharas ---------- */
  function shikhara(h) {
    var g = new THREE.Group();
    var plinth = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), sandstoneDark); plinth.position.y = .5; g.add(plinth);
    for (var k = 0; k < 7; k++) {
      var s = 1 - k / 8;
      var tier = new THREE.Mesh(new THREE.BoxGeometry(3.2 * s, h / 8, 3.2 * s), k % 2 ? sandstoneDark : sandstone);
      tier.position.y = 1 + k * (h / 8) + h / 16; g.add(tier);
    }
    var amalaka = new THREE.Mesh(new THREE.TorusGeometry(.5, .25, 8, 16), gold); amalaka.rotation.x = Math.PI / 2; amalaka.position.y = 1 + h * .88; g.add(amalaka);
    var kalash = new THREE.Mesh(new THREE.ConeGeometry(.25, 1, 8), gold); kalash.position.y = 1 + h * .95; g.add(kalash);
    return g;
  }
  var temple1 = shikhara(10); temple1.position.set(12, 0, -2); fort.add(temple1);
  var temple2 = shikhara(7); temple2.position.set(17, 0, 3); temple2.rotation.y = .4; fort.add(temple2);

  /* Saffron temple flag (dhwaj) — waves in the wind */
  var flagGeo = new THREE.PlaneGeometry(2.4, 1.3, 16, 4);
  var flagBase = flagGeo.attributes.position.array.slice();
  var flag = new THREE.Mesh(flagGeo, saffron);
  var pole = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 3.2, 6), gold);
  pole.position.set(12, 13.4, -2); fort.add(pole);
  flag.position.set(13.2, 14.4, -2); fort.add(flag);

  /* ---------- City below ---------- */
  var city = new THREE.Group(), cityLights = [];
  for (i = 0; i < 80; i++) {
    var r = 40 + rnd() * 60, ang = rnd() * Math.PI * 2, bh = .8 + rnd() * 2.5;
    var bld = new THREE.Mesh(new THREE.BoxGeometry(1.5 + rnd() * 2, bh, 1.5 + rnd() * 2), i % 3 ? sandstoneDark : sandstone);
    bld.position.set(Math.cos(ang) * r, -7 + bh / 2, Math.sin(ang) * r * .8); city.add(bld);
    if (rnd() > .5) {
      var l = new THREE.Mesh(new THREE.PlaneGeometry(.35, .5), windowMat.clone());
      l.position.set(bld.position.x, bld.position.y, bld.position.z + 1.2); city.add(l); cityLights.push(l);
    }
    if (i % 9 === 0) { var ch = chhatri(1.1); ch.position.set(bld.position.x, -7 + bh, bld.position.z); city.add(ch); }
  }
  scene.add(city);

  /* ---------- Stars (twinkle via shader) ---------- */
  var starCount = isMobile ? 900 : 2200;
  var starGeo = new THREE.BufferGeometry();
  var sp = new Float32Array(starCount * 3), sPhase = new Float32Array(starCount);
  for (i = 0; i < starCount; i++) {
    var sr = 150 + rnd() * 40, th = rnd() * Math.PI * 2, ph = rnd() * Math.PI * .45;
    sp[i * 3] = sr * Math.sin(ph) * Math.cos(th); sp[i * 3 + 1] = sr * Math.cos(ph) + 5; sp[i * 3 + 2] = sr * Math.sin(ph) * Math.sin(th);
    sPhase[i] = rnd() * 6.28;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(sPhase, 1));
  var starMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, fog: false,
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() } },
    vertexShader: 'attribute float aPhase; uniform float uTime; uniform float uPR; varying float vA; void main(){ vA = .45 + .55*sin(uTime*1.6 + aPhase); vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = (1.4 + vA*1.6)*uPR; gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'varying float vA; void main(){ vec2 c = gl_PointCoord-.5; float d = length(c); if(d>.5) discard; gl_FragColor = vec4(1.0,.95,.82, vA*smoothstep(.5,.0,d)); }'
  });
  var stars = new THREE.Points(starGeo, starMat); scene.add(stars);

  /* ---------- Floating diya lanterns (sky lanterns rising) ---------- */
  var lanternCount = isMobile ? 160 : 380;
  var lg = new THREE.BufferGeometry();
  var lp = new Float32Array(lanternCount * 3), lseed = new Float32Array(lanternCount);
  for (i = 0; i < lanternCount; i++) {
    lp[i * 3] = (rnd() - .5) * 120; lp[i * 3 + 1] = -6 + rnd() * 40; lp[i * 3 + 2] = (rnd() - .5) * 90; lseed[i] = rnd() * 100;
  }
  lg.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  var lanterns = new THREE.Points(lg, new THREE.PointsMaterial({ size: isMobile ? 1.6 : 1.3, map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff }));
  scene.add(lanterns);

  /* Diyas lining the ramparts (small flickering flames) */
  var diyaGroup = new THREE.Group(), diyas = [];
  for (i = 0; i < 42; i++) {
    var da = (i / 42) * Math.PI * 2;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffb050, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.position.set(Math.cos(da) * (RX + .2), 3.3, Math.sin(da) * (RZ + .2));
    s.scale.set(1.3, 1.3, 1); s.userData.p = rnd() * 10;
    diyaGroup.add(s); diyas.push(s);
  }
  fort.add(diyaGroup);

  /* ---------- Kites (patang) drifting over the city ---------- */
  var kites = [];
  var kiteColors = [0xe0447a, 0xff8a1f, 0x2aa198, 0xffd68a, 0x8a5cf6];
  var kiteShape = new THREE.Shape();
  kiteShape.moveTo(0, 1); kiteShape.lineTo(.75, 0); kiteShape.lineTo(0, -1); kiteShape.lineTo(-.75, 0); kiteShape.lineTo(0, 1);
  var kiteGeo = new THREE.ShapeGeometry(kiteShape);
  for (i = 0; i < (isMobile ? 4 : 7); i++) {
    var km = new THREE.Mesh(kiteGeo, new THREE.MeshBasicMaterial({ color: kiteColors[i % kiteColors.length], side: THREE.DoubleSide, transparent: true, opacity: .9 }));
    km.userData = { r: 30 + rnd() * 25, a: rnd() * 6.28, y: 14 + rnd() * 12, sp: .04 + rnd() * .05, ph: rnd() * 6.28 };
    km.scale.setScalar(1 + rnd() * .5);
    scene.add(km); kites.push(km);
  }

  /* ---------- Birds (simple V-shapes in a lazy flock) ---------- */
  var birds = [];
  var birdGeo = new THREE.BufferGeometry();
  birdGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-.6, .15, 0, 0, 0, 0, 0, 0, 0, .6, .15, 0]), 3));
  var birdMat = new THREE.LineBasicMaterial({ color: 0x0b0a1a, transparent: true, opacity: .8 });
  for (i = 0; i < (isMobile ? 6 : 12); i++) {
    var bd = new THREE.LineSegments(birdGeo.clone(), birdMat);
    bd.userData = { ox: (rnd() - .5) * 14, oy: (rnd() - .5) * 4, oz: (rnd() - .5) * 8, ph: rnd() * 6.28 };
    scene.add(bd); birds.push(bd);
  }

  /* ---------- Warm point lights ---------- */
  var fortLight = new THREE.PointLight(0xffa040, 30, 40, 2); fortLight.position.set(-6, 4, 6); scene.add(fortLight);
  var templeLight = new THREE.PointLight(0xff7040, 20, 30, 2); templeLight.position.set(14, 6, 4); scene.add(templeLight);

  /* ---------- Fireworks (occasional, festival feel) ---------- */
  var fwCount = isMobile ? 60 : 110;
  var fireworks = [];
  function makeFirework() {
    var g = new THREE.BufferGeometry();
    var pos = new Float32Array(fwCount * 3), vel = new Float32Array(fwCount * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var m = new THREE.PointsMaterial({ size: 1.1, map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff, opacity: 0 });
    var p = new THREE.Points(g, m); scene.add(p);
    return { p: p, pos: pos, vel: vel, life: 0, active: false };
  }
  for (i = 0; i < 3; i++) fireworks.push(makeFirework());
  var fwPalette = [0xffd68a, 0xff8a1f, 0xe0447a, 0x7ff0e4, 0xffffff];
  function launch(fw) {
    var cx = (Math.random() - .5) * 70, cy = 22 + Math.random() * 14, cz = -20 - Math.random() * 30;
    for (var k = 0; k < fwCount; k++) {
      fw.pos[k * 3] = cx; fw.pos[k * 3 + 1] = cy; fw.pos[k * 3 + 2] = cz;
      var u = Math.random() * 2 - 1, t = Math.random() * 6.28, sq = Math.sqrt(1 - u * u), spd = 6 + Math.random() * 3;
      fw.vel[k * 3] = sq * Math.cos(t) * spd; fw.vel[k * 3 + 1] = u * spd; fw.vel[k * 3 + 2] = sq * Math.sin(t) * spd;
    }
    fw.p.material.color.setHex(fwPalette[Math.floor(Math.random() * fwPalette.length)]);
    fw.life = 0; fw.active = true;
  }
  var nextFw = 4;

  /* ---------- Camera path driven by scroll ---------- */
  function V(x, y, z) { return new THREE.Vector3(x, y, z); }
  var camPath = new THREE.CatmullRomCurve3([V(0, 8, 52), V(-28, 12, 34), V(-36, 6, 6), V(-18, 16, -26), V(14, 22, -30), V(38, 10, -4), V(30, 5, 26), V(4, 30, 40), V(0, 9, 50)]);
  var lookPath = new THREE.CatmullRomCurve3([V(0, 3, 0), V(-6, 3, 2), V(-6, 4, 0), V(0, 2, 0), V(12, 5, 0), V(14, 4, 0), V(6, 2, 0), V(0, -2, 0), V(0, 3, 0)]);

  /* Scroll progress: read from Lenis (window.__btfScroll) when available so
     the camera follows the SAME smoothed value the page uses → no double lag. */
  var scrollT = 0, smoothT = 0;
  function readScroll() {
    if (typeof window.__btfScroll === 'number') { scrollT = window.__btfScroll; return; }
    var max = document.documentElement.scrollHeight - window.innerHeight;
    scrollT = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }
  window.addEventListener('scroll', readScroll, { passive: true });
  readScroll(); smoothT = scrollT;

  var mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener('pointermove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  var resizeT;
  window.addEventListener('resize', function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 80);
  });

  var intro = reduced ? 1 : 0;
  var clock = new THREE.Clock();
  var tmp = new THREE.Vector3(), look = new THREE.Vector3(), lookS = new THREE.Vector3(0, 3, 0);
  var running = true;
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) { clock.getDelta(); requestAnimationFrame(animate); } });

  function animate() {
    if (!running) return;
    var dt = Math.min(clock.getDelta(), .05);
    var t = clock.elapsedTime;
    intro = Math.min(1, intro + dt * .32);
    var ie = 1 - Math.pow(1 - intro, 3);

    readScroll();
    // light, frame-rate-independent smoothing (Lenis already eases the scroll)
    smoothT += (scrollT - smoothT) * (1 - Math.exp(-dt * 8));
    var k = 1 - Math.exp(-dt * 4);
    mouse.sx += (mouse.x - mouse.sx) * k; mouse.sy += (mouse.y - mouse.sy) * k;

    var st = Math.min(.9999, Math.max(0, smoothT));
    camPath.getPointAt(st, tmp);
    lookPath.getPointAt(st, look);
    lookS.lerp(look, 1 - Math.exp(-dt * 6));
    tmp.y += (1 - ie) * 30; tmp.z += (1 - ie) * 40;
    camera.position.set(tmp.x + mouse.sx * 2.5, tmp.y - mouse.sy * 1.5 + Math.sin(t * .4) * .25, tmp.z);
    camera.lookAt(lookS);

    // lanterns rise & sway
    var arr = lg.attributes.position.array;
    for (var q = 0; q < lanternCount; q++) {
      arr[q * 3 + 1] += dt * (.6 + (lseed[q] % 1) * .8);
      arr[q * 3] += Math.sin(t * .5 + lseed[q]) * dt * .3;
      if (arr[q * 3 + 1] > 38) arr[q * 3 + 1] = -6;
    }
    lg.attributes.position.needsUpdate = true;

    // diya flicker
    for (q = 0; q < diyas.length; q++) {
      var f = .9 + Math.sin(t * 9 + diyas[q].userData.p) * .15 + Math.sin(t * 17 + q) * .08;
      diyas[q].scale.set(1.3 * f, 1.5 * f, 1);
    }
    // palace & city windows breathe
    for (q = 0; q < palaceWindows.length; q++) palaceWindows[q].material.color.setRGB(1, .62 + Math.sin(t * 2 + q) * .08, .3);
    for (q = 0; q < cityLights.length; q += 3) cityLights[q].visible = Math.sin(t * .7 + q * 3.1) > -.85;

    // flag wave
    var fa = flagGeo.attributes.position.array;
    for (q = 0; q < fa.length; q += 3) {
      var x0 = flagBase[q] + 1.2;
      fa[q + 2] = Math.sin(x0 * 2.4 - t * 5) * .22 * x0;
      fa[q + 1] = flagBase[q + 1] - x0 * .08;
    }
    flagGeo.attributes.position.needsUpdate = true;

    // kites
    for (q = 0; q < kites.length; q++) {
      var kd = kites[q].userData; kd.a += kd.sp * dt;
      kites[q].position.set(Math.cos(kd.a) * kd.r, kd.y + Math.sin(t * .8 + kd.ph) * 1.2, Math.sin(kd.a) * kd.r * .7 - 10);
      kites[q].rotation.set(Math.sin(t + kd.ph) * .25, kd.a + Math.PI / 2, Math.sin(t * 1.3 + kd.ph) * .35);
    }
    // birds flock across the moon
    var bx = ((t * 3) % 160) - 80;
    for (q = 0; q < birds.length; q++) {
      var bu = birds[q].userData, flap = Math.sin(t * 8 + bu.ph) * .25;
      var bp = birds[q].geometry.attributes.position.array; bp[1] = .15 + flap; bp[10] = .15 + flap;
      birds[q].geometry.attributes.position.needsUpdate = true;
      birds[q].position.set(-30 + bx + bu.ox, 28 + bu.oy + Math.sin(t + bu.ph) * .4, -60 + bu.oz);
      birds[q].lookAt(camera.position);
    }

    // fireworks
    nextFw -= dt;
    if (nextFw <= 0 && !reduced) {
      for (q = 0; q < fireworks.length; q++) if (!fireworks[q].active) { launch(fireworks[q]); break; }
      nextFw = 3 + Math.random() * 4;
    }
    for (q = 0; q < fireworks.length; q++) {
      var fw = fireworks[q]; if (!fw.active) continue;
      fw.life += dt;
      for (var z = 0; z < fwCount; z++) {
        fw.vel[z * 3 + 1] -= 3.5 * dt;
        fw.vel[z * 3] *= .985; fw.vel[z * 3 + 1] *= .985; fw.vel[z * 3 + 2] *= .985;
        fw.pos[z * 3] += fw.vel[z * 3] * dt; fw.pos[z * 3 + 1] += fw.vel[z * 3 + 1] * dt; fw.pos[z * 3 + 2] += fw.vel[z * 3 + 2] * dt;
      }
      fw.p.geometry.attributes.position.needsUpdate = true;
      fw.p.material.opacity = Math.max(0, 1 - fw.life / 2.2);
      if (fw.life > 2.2) { fw.active = false; fw.p.material.opacity = 0; }
    }

    starMat.uniforms.uTime.value = t;
    lakeMat.uniforms.uTime.value = t;
    skyMat.uniforms.uTime.value = t;
    skyMat.uniforms.uShift.value = smoothT;
    fortLight.intensity = 26 + Math.sin(t * 7) * 3 + Math.sin(t * 13) * 2;
    templeLight.intensity = 18 + Math.sin(t * 5 + 1) * 3;
    moon.position.y = 22 + smoothT * 14; halo.position.y = moon.position.y;
    var hs = 48 * (1 + Math.sin(t * .8) * .05); halo.scale.set(hs, hs, 1);
    fort.rotation.y = Math.sin(t * .1) * .02;
    stars.rotation.y = t * .004;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  try {
    renderer.render(scene, camera);
  } catch (e) { fallback('first render failed'); return; }
  root.classList.add('has-webgl');
  requestAnimationFrame(animate);
  window.__sceneReady = true;
  window.dispatchEvent(new CustomEvent('scene:ready'));
})();
