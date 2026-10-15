# Beyond the Fort · Gwalior — Heritage Tourism Platform

Case 04 (Tourism) for AI Synergy Hackathon 2026, Round 1. This is a one-page site with 3D animation. It covers the full case workflow (evidence → stakeholders → framings → problem statement → feasibility → guide safety → SRS → AI reasoning trail) and includes a working prototype: an event board, a guide directory, a page where hosts submit events, and a moderator queue.

## What changed in this round
1. **The toran (marigold garland, or "mala") is gone** from the hero and the footer, along with its markup, CSS and JS.
2. **The spinning mandala wheel is replaced by a heritage and nature showcase** (`js/showcase.js`). It's a jharokha-arch window that cycles through **11 line drawings made in code**: Gwalior Fort / Man Mandir (tiled façade), Teli ka Mandir, Sas-Bahu, Tansen's Tomb (with the tamarind tree), Jai Vilas Palace, Gopachal rock sculptures, Suraj Kund, **Tigra Lake, the Chambal ravines with a gharial, a peacock in Phool Bagh, and Madhav National Park**. Each drawing traces itself onto a faint pencil sketch. There are clickable dots and a caption that changes each slide (type tag, English, Hindi). It pauses when you hover, and the drawing moves slightly with the mouse.
3. **Unfinished work is now done:**
   - **Nature section** (`#nature-section`): 6 landscape cards with line art, approximate distances and visiting tips.
   - **Stale-data flag (FR-04):** listings not checked for more than 7 days get a grey "Not re-checked" notice, a dashed border and lower opacity. They are moved down the list and never suggested as plan B.
   - **Visitor caps for fragile sites (FR-06):** a cap progress bar shows how many places are left. When the cap is reached, the listing counts as *full* and is no longer promoted.
   - **Host submission form and verification queue (FR-08)** (`#submit-section`): submissions start as `pending`. Approve or reject them in the queue. Approved items go straight onto the board, labelled *Stakeholder-provided*.
   - **Hindi/English toggle** (`EN / हिं` in the header, `js/i18n.js`): it switches the nav, key headings, the hero text, day tabs, capacity labels, stale/cap notices and plan-B text. The choice is saved in localStorage.
   - **Footer skyline**: drawn monuments replace the old garland.
   - Fixed missing files: the favicon and logo now use the uploaded diya-arch icon (`images/app-icon.jpg`), Font Awesome loads from a jsDelivr CDN, and the no-WebGL fallback is a CSS dusk gradient (it no longer needs a missing SVG).

## Design
- **3D scene (Three.js, `js/scene.js`)**: a fort on a hill, built in code: ramparts, towers with chhatris, a palace like Man Mandir, shikharas, a lake, the city, stars, lanterns, kites, birds and fireworks. The camera moves along a path as you scroll.
- **Motion**: Lenis smooth scroll, GSAP + ScrollTrigger reveals, a pinned sideways workflow section, cards that tilt in 3D, a custom cursor and the loader.
- **Palette**: night indigo, sandstone, saffron gold, terracotta, peacock teal, plus a soft leaf green for nature.

## Sections and entry points (`index.html`)
| Anchor | Content |
|---|---|
| `#hero-section` | Title, stats, **heritage and nature showcase** |
| `#heritage-section` | Landmark cards + flavours |
| `#nature-section` | **New**: Tigra, Chambal, Phool Bagh, Gopachal, Suraj Kund, Madhav NP |
| `#problem-section` / `#evidence-section` | The problem loop and the evidence flip cards |
| `#workflow-section` / `#userflow-section` | 7-step workflow and the visitor's journey |
| `#framing-section` / `#statement-section` | Weighted framings and the problem statement |
| `#events-section` | Event board with filters, plan B, **stale flags and visitor caps** |
| `#guides-section` | Two-check guide verification |
| `#submit-section` | **New**: host form and moderator queue |
| `#feasibility-section` / `#login-section` / `#srs-section` / `#trail-section` | Verdicts, phone login demo, SRS (FR-01–08), reasoning trail |

## Data (RESTful Table API)
- `events`: title, category (now includes Nature), venue, area, day_offset, time, capacity, price, distance_km, source_status, **last_checked_days**, **daily_cap**, **booked**, sensitivity, description
- `guides`: name, role, specialty, sites[], languages[], credential, site_qualified, accountable, rating, tours
- `event_submissions` (**new**): title, category, venue, area, date, time, price, distance_km, sensitivity, description, fragile, daily_cap, status (`pending` / `approved` / `rejected`)

The site reads data with `GET tables/{name}?limit=100`. Submitting uses `POST tables/event_submissions`, and moderating uses `PATCH tables/event_submissions/{id}` plus `POST tables/events` on approval. If the API can't be reached (or the page is opened from `file://`), the site uses `js/data.js` and keeps submissions in `localStorage` (`btf_submissions`). All sample data is for illustration only.

## Important limitations
- The **moderator queue isn't secure**. Anyone can approve items, because a browser-only check can't protect it. For real use, put the queue behind server-side sign-in (for example, Hosted access rules that limit writes to admin emails).
- Real OTP/SMS, a masked-call relay and in-app chat need a backend.
- The Hindi translation covers the main interface and headings, not every paragraph in the long sections.

## Next steps
1. Lock moderator writes with Hosted access rules (public GET, admin-only PATCH/POST).
2. Translate the rest of the long content into Hindi.
3. Let hosts upload photos (through moderation).
4. Publish from the **Publish tab**.
