/* Static narrative content for Beyond the Fort */
window.BTF = {
  /* Heritage ribbon (two rows, opposite directions). [english, hindi] */
  ribbonA: [['Gwalior Fort', 'ग्वालियर किला'], ['Man Mandir', 'मान मंदिर'], ['Teli ka Mandir', 'तेली का मंदिर'], ['Sas-Bahu', 'सास-बहू'], ['Gujari Mahal', 'गूजरी महल'], ['Jai Vilas Palace', 'जय विलास'], ['Gopachal Parvat', 'गोपाचल पर्वत']],
  ribbonB: [['Tansen Samaroh', 'तानसेन समारोह'], ['Gwalior Gharana', 'ग्वालियर घराना'], ['Lashkar Bazaar', 'लश्कर बाज़ार'], ['Stone Carvers', 'पत्थर शिल्प'], ['Bedai & Jalebi', 'बेड़ई-जलेबी'], ['Gajak', 'गजक'], ['Phool Bagh', 'फूल बाग']],

  /* Heritage landmarks — widely documented, kept general on purpose */
  heritage: [
    { hi: 'किला', name: 'Gwalior Fort', era: 'Hilltop fort · c. 8th century onward', text: 'A sandstone fortress running along a plateau above the city — called “the pearl among the fortresses of Hind” in Babur’s memoirs.', icon: 'fa-chess-rook' },
    { hi: 'मान मंदिर', name: 'Man Mandir Palace', era: 'Raja Man Singh Tomar · late 15th c.', text: 'The palace on the fort’s eastern face, famous for its bands of turquoise, yellow and green glazed tiles with ducks, elephants and banana trees.', icon: 'fa-gopuram' },
    { hi: 'तेली का मंदिर', name: 'Teli ka Mandir', era: 'Temple · c. 8th–9th c.', text: 'One of the tallest structures on the fort, with a tall wagon-vault roof that blends northern and southern temple styles.', icon: 'fa-place-of-worship' },
    { hi: 'सहस्रबाहु', name: 'Sas-Bahu Temples', era: 'Twin temples · 11th c.', text: 'The “Sahastrabahu” temples — a larger and smaller pair covered in finely carved pillars and ceilings.', icon: 'fa-vihara' },
    { hi: 'तानसेन', name: 'Tansen’s Tomb', era: 'Hazira · 16th c. musician', text: 'Resting place of Tansen, one of the nine jewels of Akbar’s court, where the Tansen Samaroh music festival is held every winter.', icon: 'fa-music' },
    { hi: 'जय विलास', name: 'Jai Vilas Palace', era: 'Scindia residence · 1874', text: 'A European-style palace in Lashkar, part of which is a museum, known for its giant chandeliers and durbar hall.', icon: 'fa-crown' }
  ],
  flavours: [
    { icon: 'fa-music', hi: 'संगीत', title: 'City of Music', text: 'Home of the Gwalior gharana — among the oldest khayal traditions — and a UNESCO Creative City of Music.' },
    { icon: 'fa-bowl-food', hi: 'स्वाद', title: 'Morning bedai', text: 'Crisp bedai with spicy aloo, hot jalebi, and winter gajak from the old bazaars.' },
    { icon: 'fa-hammer', hi: 'शिल्प', title: 'Stone & craft', text: 'Generations of sandstone carvers, alongside carpet weavers and papier-mâché makers.' },
    { icon: 'fa-hands-praying', hi: 'नमस्ते', title: 'Atithi devo bhava', text: 'Remove shoes at temples, ask before photographing people, dress modestly at shrines.' }
  ],

  /* Natural landscapes in and around Gwalior (approximate distances, kept general) */
  nature: [
    { art: 'tigra', hi: 'तिघरा', name: 'Tigra Lake & Dam', dist: '~20 km', tag: 'Water · Sunset', text: 'A reservoir north-west of the city, ringed by low hills. Boating and quiet sunsets when the water is high after the monsoon.', tip: 'Best Oct–Feb, late afternoon.' },
    { art: 'chambal', hi: 'चंबल', name: 'Chambal ravines', dist: 'Day trip', tag: 'River · Wildlife', text: 'Badlands carved by the Chambal river. The National Chambal Sanctuary protects the gharial, river dolphins and the Indian skimmer.', tip: 'Go with a licensed sanctuary operator.' },
    { art: 'phoolbagh', hi: 'फूल बाग', name: 'Phool Bagh gardens', dist: '~3.5 km', tag: 'Garden · Morning', text: 'Old palace gardens in Lashkar — shaded lawns, morning walkers and peafowl. A calm stop between bazaar and palace.', tip: 'Early morning, before the heat.' },
    { art: 'gopachal', hi: 'गोपाचल', name: 'Gopachal Parvat', dist: '~1.5 km', tag: 'Rock · Sacred', text: 'Rock-cut Jain tirthankara figures on the hillside below the fort, set into the living sandstone cliff.', tip: 'Sacred site — remove footwear where asked.' },
    { art: 'surajkund', hi: 'सूरज कुंड', name: 'Suraj Kund', dist: 'On the fort', tag: 'Legend · Water', text: 'An ancient tank on the plateau, linked by local legend to the healing of Suraj Sen and the founding of Gwalior.', tip: 'Combine with the Teli ka Mandir walk.' },
    { art: 'madhav', hi: 'माधव', name: 'Madhav National Park', dist: '~120 km', tag: 'Forest · Lakes', text: 'Dry deciduous forest and lakes near Shivpuri, home to deer, antelope and a reintroduced tiger population.', tip: 'A full day — check park timings locally.' }
  ],

  evidence: [
    { icon: 'fa-chart-pie', signal: 'Concentration', evidence: 'Simulated visitor counts show 67% of tracked tourist visits concentrated at two major attractions.', unknown: 'Whether concentration is due to preference, discoverability, time, transport or trust.' },
    { icon: 'fa-hourglass-half', signal: 'Stay length', evidence: 'A majority of surveyed day visitors report having 5–8 hours in the city.', unknown: 'How much itinerary complexity is realistic.' },
    { icon: 'fa-magnifying-glass-location', signal: 'Discovery', evidence: 'Small operators report depending heavily on word-of-mouth and social media.', unknown: 'How to verify listings and keep information current.' },
    { icon: 'fa-route', signal: 'Mobility', evidence: 'Several lesser-known sites are 3–8 km from the main visitor corridor.', unknown: 'Whether route, transport, safety or accessibility is the main barrier.' },
    { icon: 'fa-stamp', signal: 'Authenticity', evidence: 'Local stakeholders complain that online descriptions frequently copy outdated or inaccurate facts.', unknown: 'How authoritative local information can be maintained.' },
    { icon: 'fa-hands-praying', signal: 'Sensitivity', evidence: 'Some locations have religious, conservation or community-specific norms.', unknown: 'How recommendations should respect restrictions and local context.' }
  ],

  workflow: [
    { icon: 'fa-book-open', tag: 'Step 01 · Investigate', title: 'Read the case like an investigator', text: 'Separate facts from assumptions in the evidence pack. Note what each signal proves and what it leaves open.', points: ['6 signals mapped to evidence & uncertainty', 'Stakeholders listed with their idea of "good"', 'Boundary rules captured up-front'], out: 'artefact → evidence-map.md' },
    { icon: 'fa-users-viewfinder', tag: 'Step 02 · Stakeholders', title: 'Whose outcome dominates?', text: 'Visitors want a good day; operators want visibility; residents want calm; heritage managers want protection.', points: ['Visitors (domestic & international)', 'Guides, officials, craftspeople, food businesses', 'Residents, transport, heritage managers'], out: 'artefact → stakeholder-matrix' },
    { icon: 'fa-code-compare', tag: 'Step 03 · Frame', title: 'Compare six plausible framings', text: 'Discovery, trust, itinerary, mobility, local inclusion, content quality — scored on evidence, feasibility, inclusion and harm-avoidance.', points: ['Weighted scoring, kept transparent', 'Rejected framings documented with reasons'], out: 'artefact → framing-scorecard' },
    { icon: 'fa-bullseye', tag: 'Step 04 · Select', title: 'Narrow to one problem', text: 'Exposure and availability feed each other: when the headline event is full, there is no plan B, so small events stay invisible.', points: ['Single, testable problem statement', 'Success metric: share of visits outside top-2 sites'], out: 'artefact → problem-statement.md' },
    { icon: 'fa-flask-vial', tag: 'Step 05 · Feasibility', title: 'Test the proposal against reality', text: 'Reason-act loop over live sources. Event board, maps, media and login: buildable. Hidden-number group chat: not rentable. ID copies: legal risk.', points: ['Each feature: go / adjust / stop', 'Alternatives proposed for every "stop"'], out: 'artefact → feasibility-review.pdf' },
    { icon: 'fa-shield-heart', tag: 'Step 06 · Safety', title: 'Verify guides without ID copies', text: 'Two checks: qualified for this site (issuer confirmation) and accountable on the day (masked contact, trip-share, complaints).', points: ['No Aadhaar / PAN / licence storage', 'Site-specific credentials'], out: 'artefact → guide-verification.pdf' },
    { icon: 'fa-diagram-project', tag: 'Step 07 · Specify', title: 'Write the SRS & plan', text: 'Functional + non-functional requirements, phased roadmap, pilot metric, and the AI reasoning trail that shaped each decision.', points: ['7 functional requirements', '4 build phases + pilot', 'Audit-ready reasoning log'], out: 'artefact → srs-v1 + reasoning-trail.log' }
  ],

  framings: [
    { id: 'avail', title: 'Exposure + availability (no plan B)', text: 'Visitors cannot find what else is on when the headline is full; small events stay unseen.', s: { evidence: 5, feasible: 5, inclusion: 5, safety: 4 } },
    { id: 'disc', title: 'Discovery of lesser-known sites', text: 'Sites exist but are not findable in one place.', s: { evidence: 4, feasible: 4, inclusion: 3, safety: 3 } },
    { id: 'trust', title: 'Trust in information', text: 'Copied, outdated facts undermine confidence.', s: { evidence: 4, feasible: 3, inclusion: 2, safety: 4 } },
    { id: 'itin', title: 'Itinerary planning in 5–8 hours', text: 'Visitors cannot fit more into a short day.', s: { evidence: 3, feasible: 3, inclusion: 3, safety: 3 } },
    { id: 'mob', title: 'Mobility to 3–8 km sites', text: 'Transport and route safety block spread.', s: { evidence: 2, feasible: 2, inclusion: 3, safety: 3 } },
    { id: 'over', title: 'Over-tourism at fragile sites', text: 'Promotion could overwhelm sensitive places.', s: { evidence: 2, feasible: 3, inclusion: 2, safety: 5 } }
  ],

  verdicts: [
    { k: 'go', tag: 'Buildable', title: 'Event board', text: 'Today / tomorrow / this week listings with provenance labels and a "full" signal.', fix: '<b>Plan:</b> operator submission form + verification queue.' },
    { k: 'go', tag: 'Buildable', title: 'Map link', text: 'Deep-links to standard map apps with distance from the fort corridor.', fix: '<b>Plan:</b> no custom routing needed for v1.' },
    { k: 'go', tag: 'Buildable', title: 'Media & listings', text: 'Photos and short descriptions from operators, clearly labelled as stakeholder-provided.', fix: '<b>Plan:</b> moderation before publishing.' },
    { k: 'go', tag: 'Buildable', title: 'Phone login, every country code', text: 'E.164 number entry with OTP via an SMS provider works for international visitors.', fix: '<b>Plan:</b> browse-without-login stays available.' },
    { k: 'stop', tag: 'Not rentable', title: 'Group chat with hidden numbers', text: 'Members not seeing each other\'s numbers while the platform can is not a feature you can rent from WhatsApp or Telegram groups.', fix: '<b>Alternative:</b> in-app chat or a masked-number relay owned by the platform.' },
    { k: 'warn', tag: 'Legal risk', title: 'Collecting Aadhaar & licence copies', text: 'Storing guides\' identity documents runs against the 2018 Supreme Court ruling and adds data-protection liability.', fix: '<b>Alternative:</b> confirm credentials with issuing bodies; store only the result.' }
  ],

  trail: [
    ['t-plan', 'PLAN   ', 'Identify why 67% of visits concentrate at two attractions.'],
    ['t-act', 'ACT    ', 'Cross-read evidence: stay length 5–8h, discovery via word-of-mouth, 3–8 km sites.'],
    ['t-obs', 'OBSERVE', 'Visitors with fixed time have no fallback when headline event is full.'],
    ['t-ver', 'VERIFY ', 'Case doc confirms: "no single place to see what\'s on today, tomorrow or next week".'],
    ['t-rank', 'RANK   ', 'Framing #1 "exposure + availability" scores highest → SELECTED.'],
    ['t-plan', 'PLAN   ', 'Check feasibility of hidden-number group chat on WhatsApp/Telegram.'],
    ['t-act', 'ACT    ', 'Review platform features for member-number privacy in groups.'],
    ['t-obs', 'OBSERVE', 'No rentable feature hides numbers from members while platform keeps them.'],
    ['t-ver', 'VERIFY ', 'Decision: replace with platform-owned masked relay.'],
    ['t-plan', 'PLAN   ', 'Can we store guides\' Aadhaar / licence copies?'],
    ['t-obs', 'OBSERVE', '2018 Supreme Court ruling constrains this; storing adds liability.'],
    ['t-rank', 'RANK   ', 'Adopt two-check model: qualified (issuer) + accountable (on the day).'],
    ['t-ver', 'VERIFY ', 'Boundary respected: no invented facts, hours or accessibility claims.']
  ],

  countries: [
    ['India', '+91'], ['United States', '+1'], ['United Kingdom', '+44'], ['Canada', '+1'], ['Australia', '+61'], ['Germany', '+49'], ['France', '+33'],
    ['Japan', '+81'], ['China', '+86'], ['Singapore', '+65'], ['UAE', '+971'], ['Saudi Arabia', '+966'], ['Nepal', '+977'], ['Bangladesh', '+880'],
    ['Sri Lanka', '+94'], ['Italy', '+39'], ['Spain', '+34'], ['Netherlands', '+31'], ['Russia', '+7'], ['Brazil', '+55'], ['South Africa', '+27'],
    ['South Korea', '+82'], ['Malaysia', '+60'], ['Thailand', '+66'], ['Israel', '+972'], ['New Zealand', '+64'], ['Mexico', '+52'], ['Other (enter code)', '+']
  ],

  /* Fallbacks if table API is unavailable.
     last_checked_days: days since a human last confirmed the listing (FR-04).
     daily_cap / booked: visitor caps for fragile sites (FR-06). */
  fallbackEvents: [
    { id: 'ev1', title: 'Tansen Samaroh — Evening Raga Session', category: 'Music', venue: 'Tansen Tomb Complex, Hazira', area: 'Hazira', day_offset: 0, time: '18:30', capacity: 'full', price: 'Free entry (passes)', distance_km: 2.1, source_status: 'verified', last_checked_days: 0, sensitivity: 'Memorial site — silence during performance.', description: 'The headline classical music gathering. At capacity tonight.' },
    { id: 'ev2', title: 'Baithak: Dhrupad in a Haveli Courtyard', category: 'Music', venue: 'Old City Haveli', area: 'Lashkar', day_offset: 0, time: '19:00', capacity: 'open', price: '₹200', distance_km: 3.4, source_status: 'stakeholder', last_checked_days: 2, sensitivity: 'Private residence — photography with consent.', description: 'An intimate baithak by local students.' },
    { id: 'ev3', title: 'Sunset Walk: Teli ka Mandir & Sas-Bahu', category: 'Heritage Walk', venue: 'Gwalior Fort', area: 'Fort', day_offset: 0, time: '16:30', capacity: 'filling', price: '₹350 + ticket', distance_km: 0, source_status: 'verified', last_checked_days: 1, daily_cap: 60, booked: 49, sensitivity: 'Protected monument — no climbing on structures.', description: 'Guide-led temple walk timed for golden hour on the plateau.' },
    { id: 'ev4', title: 'Bedai & Jalebi Breakfast Trail', category: 'Food', venue: 'Sarafa & Naya Bazaar lanes', area: 'Lashkar', day_offset: 0, time: '08:00', capacity: 'open', price: '₹450', distance_km: 3.8, source_status: 'stakeholder', last_checked_days: 11, sensitivity: 'Busy market lanes — keep to the left, mind two-wheelers.', description: 'A slow morning walk through the old market with a local food host.' },
    { id: 'ev5', title: 'Stone Carving Demo with Murar Artisans', category: 'Craft', venue: 'Artisan workshop, Murar', area: 'Murar', day_offset: 0, time: '11:00', capacity: 'open', price: '₹150', distance_km: 6.2, source_status: 'stakeholder', last_checked_days: 3, sensitivity: 'Working studio — ask before photographing.', description: 'Watch sandstone jaali being carved by hand; small pieces available to buy.' },
    { id: 'ev11', title: 'Sunset at Tigra Lake — Boat & Birdwatch', category: 'Nature', venue: 'Tigra Dam', area: 'Tigra', day_offset: 0, time: '17:00', capacity: 'open', price: '₹300', distance_km: 20, source_status: 'stakeholder', last_checked_days: 4, sensitivity: 'Reservoir — life jackets compulsory, no littering.', description: 'A short boat ride and birdwatch as the sun drops behind the hills.' },
    { id: 'ev6', title: 'Light & Sound Show at the Fort', category: 'Theatre', venue: 'Man Mandir courtyard', area: 'Fort', day_offset: 1, time: '19:30', capacity: 'filling', price: '₹250', distance_km: 0, source_status: 'verified', last_checked_days: 1, sensitivity: 'Protected monument.', description: 'Evening narration of the fort\'s history projected on the palace walls.' },
    { id: 'ev7', title: 'Riyaz Morning: Young Khayal Singers', category: 'Music', venue: 'Music college hall', area: 'Lashkar', day_offset: 1, time: '07:00', capacity: 'open', price: 'Free', distance_km: 3.1, source_status: 'inferred', last_checked_days: 9, sensitivity: 'Classroom setting — silence phones.', description: 'Suggested because you liked classical music; timings not yet confirmed.' },
    { id: 'ev8', title: 'Gopachal Jain Rock Sculptures Walk', category: 'Heritage Walk', venue: 'Gopachal Parvat', area: 'Fort hill', day_offset: 1, time: '09:30', capacity: 'open', price: '₹300', distance_km: 1.4, source_status: 'verified', last_checked_days: 2, daily_cap: 40, booked: 40, sensitivity: 'Sacred site — remove footwear where asked.', description: 'Rock-cut Jain tirthankara figures on the hillside below the fort.' },
    { id: 'ev9', title: 'Gajak Making in an Old Halwai Shop', category: 'Food', venue: 'Halwai lane, Daulatganj', area: 'Lashkar', day_offset: 3, time: '15:00', capacity: 'open', price: '₹200', distance_km: 4.0, source_status: 'stakeholder', last_checked_days: 5, sensitivity: 'Hot kitchen — children must be accompanied.', description: 'Watch sesame and jaggery being pounded into the city\'s winter sweet.' },
    { id: 'ev10', title: 'Lok Sangeet Evening in Phool Bagh', category: 'Festival', venue: 'Phool Bagh grounds', area: 'Lashkar', day_offset: 4, time: '18:00', capacity: 'open', price: 'Free', distance_km: 3.6, source_status: 'inferred', last_checked_days: 14, sensitivity: 'Public park — family event.', description: 'Folk music and small food stalls; schedule depends on the organisers.' }
  ],
  fallbackGuides: [
    { id: 'g1', name: 'Meera Tomar', role: 'Heritage guide', specialty: 'Fort palaces & Tomar history', sites: ['Gwalior Fort', 'Man Mandir'], languages: ['Hindi', 'English'], credential: 'State tourism board guide licence (sample)', site_qualified: true, accountable: true, rating: 4.8, tours: 212 },
    { id: 'g2', name: 'Arjun Kushwah', role: 'Temple walk guide', specialty: 'Temple architecture of the plateau', sites: ['Teli ka Mandir', 'Sas-Bahu'], languages: ['Hindi', 'English', 'French'], credential: 'ASI-site guide training (sample)', site_qualified: true, accountable: true, rating: 4.7, tours: 158 },
    { id: 'g3', name: 'Ramesh Shilpkar', role: 'Craftsperson', specialty: 'Sandstone jaali carving', sites: ['Murar workshops'], languages: ['Hindi'], credential: 'Artisan registry card (sample)', site_qualified: true, accountable: false, rating: 4.9, tours: 64 },
    { id: 'g4', name: 'Fatima Qureshi', role: 'Food walk host', specialty: 'Old-bazaar breakfasts & sweets', sites: ['Lashkar', 'Sarafa'], languages: ['Hindi', 'Urdu', 'English'], credential: 'Verification pending', site_qualified: false, accountable: true, rating: 4.6, tours: 41 }
  ]
};
