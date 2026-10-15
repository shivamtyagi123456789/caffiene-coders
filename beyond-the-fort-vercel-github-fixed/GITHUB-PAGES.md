# Put this site on GitHub Pages

## Publish from a repository

1. Create a GitHub repository and upload the **contents of this folder** to its root. Keep `index.html` at the repository root with `css/`, `images/`, and `js/` beside it.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select your default branch and the **/(root)** folder, then save.
5. Wait for GitHub Pages to publish and open the URL shown in the Pages settings.

No build command or framework configuration is needed. `.nojekyll` tells GitHub Pages to serve the static files as-is.

## Repository contents

- `index.html` — the site page
- `css/`, `images/`, `js/` — styles, icon, data, and scripts (including locally bundled animation libraries)
- `README.md` — project overview and API notes
- `DEPLOY.md` — general static-host deployment notes

Google Fonts and Font Awesome use CDNs. The main page and bundled scripts are local, but those external fonts and icons need an internet connection.

The sample listings are illustrative. The submission queue is a prototype: submissions are local to each browser unless a backend is connected, and moderation is not access-controlled. Use server-side authentication before accepting public submissions.
