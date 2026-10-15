/* =========================================================
   Beyond the Fort — Hindi / English toggle
   Elements marked data-i18n="key" are swapped. English text is
   captured from the page itself the first time, so the HTML stays
   the single source for English. Choice persists in localStorage.
   ========================================================= */
(function () {
  'use strict';
  var HI = {
    'nav.heritage': 'ग्वालियर', 'nav.nature': 'प्रकृति', 'nav.problem': 'समस्या', 'nav.workflow': 'कार्यप्रवाह',
    'nav.framing': 'दृष्टिकोण', 'nav.events': 'आज क्या है', 'nav.guides': 'मार्गदर्शक', 'nav.submit': 'कार्यक्रम जोड़ें', 'nav.srs': 'योजना',
    'hero.sub': 'ग्वालियर में धरोहर भी बहुत है और कार्यक्रम भी। कमी है तो <strong>ध्यान के फैलाव</strong> और <strong>दूसरे विकल्प</strong> की। जब एक बड़ा कार्यक्रम भर जाता है, पर्यटक के पास कहीं और जाने की जगह नहीं होती — हम वही "कहीं और" बना रहे हैं।',
    'hero.cta1': '<i class="fa-solid fa-calendar-days"></i> आज क्या चल रहा है',
    'hero.cta2': 'पूरा कार्यप्रवाह <i class="fa-solid fa-arrow-down"></i>',
    'heritage.title': 'एक पहाड़ी पर <span class="accent">हज़ार साल</span>',
    'heritage.lede': 'मंच से पहले, जगह। कुछ प्रसिद्ध स्मारक जो ग्वालियर को एक किले से कहीं अधिक बनाते हैं — हर एक, पर्यटक के लिए थोड़ा और रुकने का कारण।',
    'nature.title': 'झीलें, बीहड़ <span class="accent">और चट्टानी पहाड़ियाँ</span>',
    'nature.lede': 'ग्वालियर वहाँ बसा है जहाँ चंबल के बीहड़ विंध्य के पठार से मिलते हैं। खाली दोपहर हो तो भीड़ छोड़कर पानी, पक्षी और खुला आसमान चुनिए — बस याद रहे, ये जीवित परिदृश्य हैं, सिर्फ़ पृष्ठभूमि नहीं।',
    'problem.title': 'दो कमियाँ जो <span class="accent">एक-दूसरे को बढ़ाती हैं</span>',
    'events.title': 'ग्वालियर में आज क्या है <span class="accent">— और आपका प्लान B</span>',
    'guides.title': '<em>इस</em> स्थल के लिए योग्य। <span class="accent">उस दिन</span> जवाबदेह।',
    'submit.title': 'अपना कार्यक्रम जोड़ें। <span class="accent">पहले हम जाँचते हैं।</span>',
    'submit.lede': 'छोटी बैठकें, शिल्प प्रदर्शन और खान-पान की सैर उनके आयोजक स्वयं जोड़ सकते हैं। हर प्रविष्टि सत्यापन कतार में जाती है और पुष्टि होने तक <b>हितधारक-प्रदत्त</b> के रूप में चिह्नित रहती है।',
    'day.today': 'आज', 'day.tomorrow': 'कल', 'day.week': 'इस सप्ताह',
    'cap.open': 'उपलब्ध', 'cap.filling': 'भर रहा है', 'cap.full': 'भरा हुआ',
    'cap.left': 'स्थान आज शेष', 'cap.reached': 'दैनिक सीमा पूरी — स्थल की सुरक्षा हेतु',
    'stale.flag': 'पिछले', 'stale.days': 'दिनों से जाँचा नहीं गया — जाने से पहले पुष्टि करें',
    'planb.full': 'भरा हुआ है — यह रहा आपका प्लान B',
    'events.empty': 'इस फ़िल्टर के लिए अभी कुछ नहीं — कोई और दिन या श्रेणी आज़माएँ।'
  };

  var KEY = 'btf_lang';
  var lang = 'en';
  try { lang = localStorage.getItem(KEY) === 'hi' ? 'hi' : 'en'; } catch (e) { }
  window.BTF_LANG = lang;

  /* used by main.js for text it builds at runtime */
  window.BTF_T = function (k, en) { return window.BTF_LANG === 'hi' && HI[k] ? HI[k] : en; };

  var EN = {}; // captured English markup per element
  function apply(l) {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], k = el.getAttribute('data-i18n');
      var orig = EN[k + '#' + i];
      if (orig === undefined) orig = EN[k + '#' + i] = el.innerHTML;
      if (l === 'hi' && HI[k]) { el.innerHTML = HI[k]; el.setAttribute('lang', 'hi'); }
      else if (l === 'en') { el.innerHTML = orig; el.removeAttribute('lang'); }
    }
    document.documentElement.setAttribute('lang', l === 'hi' ? 'hi' : 'en');
    document.documentElement.classList.toggle('lang-hi', l === 'hi');
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(l === 'hi'));
      btn.setAttribute('aria-label', l === 'hi' ? 'Switch language to English' : 'Switch language to Hindi');
    }
  }

  // capture English before anything changes, then apply saved choice
  (function capture() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) EN[els[i].getAttribute('data-i18n') + '#' + i] = els[i].innerHTML;
  })();
  if (lang === 'hi') apply('hi');

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#lang-toggle'); if (!b) return;
    lang = window.BTF_LANG = lang === 'hi' ? 'en' : 'hi';
    try { localStorage.setItem(KEY, lang); } catch (err) { }
    apply(lang);
    window.dispatchEvent(new CustomEvent('btf:lang', { detail: lang }));
  });
})();
