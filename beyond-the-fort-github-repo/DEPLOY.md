# Beyond the Fort — deployment package

## Quick deploy

This is a static website. There is no compile/build step and no server runtime requirement.

1. Upload the **contents of this folder** to a static web host (for example, Netlify Drop, Cloudflare Pages, GitHub Pages, or any web server that serves `index.html`).
2. Set the site root to this folder if the host asks for a publish directory.
3. Open the published URL and check the page on desktop and mobile.

`index.html` must stay beside the `css/`, `images/`, and `js/` folders. The Three.js, GSAP, ScrollTrigger, and Lenis scripts are bundled locally. Google Fonts and Font Awesome load from CDNs, so those visual resources need an internet connection.

## What works as a static deployment

The heritage and nature content, animations, English/Hindi toggle, sample event board, and guide directory run in the browser. If the app's hosted tables API is unavailable, sample data is used and host submissions are stored in that visitor's browser (`localStorage`). Those local submissions are not shared with other visitors and may be cleared by the browser.

## Before using the submission queue publicly

The included moderator queue is a prototype and has no authentication. Do not use it to accept real public submissions until writes are protected by server-side authentication and moderation rules. Real SMS/OTP, masked calls, and chat also require a backend. See `README.md` for the API table shape and project limitations.

All sample listings are illustrative. Verify event details, distances, capacities, and safety information before presenting them as current facts.
