# Fix for Vercel's root 404

This repository serves the site two ways:

- GitHub Pages reads the static files at the repository root.
- Vercel runs `npm run build`; `build.mjs` copies the site into `public/`, which is the configured Vercel output directory.

## Replace the files in your GitHub repository

1. Download and unzip the accompanying fixed repository ZIP.
2. Upload **all files and folders inside the ZIP** to the root of the existing GitHub repository, replacing the old versions. Confirm that `vercel.json`, `package.json`, `build.mjs`, and `index.html` are directly in the repository root (not nested in another folder).
3. In Vercel, open **Project → Settings → Build and Deployment**. Set **Root Directory** to the repository root. Leave the Framework Preset as **Other**; `vercel.json` also declares this. Clear any dashboard Build Command or Output Directory overrides so the committed config can apply.
4. Go to **Deployments**, open the latest failed deployment, and choose **Redeploy**. Or push a new commit after replacing the files to trigger a fresh deployment.
5. Open the new deployment's `.vercel.app` URL. In the deployment Output view, confirm it contains `index.html`, `css/`, `images/`, and `js/` at the output root.

The image you shared shows a platform-level `404 NOT_FOUND`, so the site's JavaScript did not cause that page. If it still happens after the redeploy, check whether the `.vercel.app` deployment URL works. If the Vercel URL works but a custom domain does not, the remaining issue is domain assignment/DNS; if both fail, check that Vercel imported the intended branch and that its Root Directory points to the directory containing these files.

## Why this version is explicit

A static HTML project needs Vercel to serve the directory containing `index.html`. This repo names that output directory (`public`) and defines the build command in version-controlled config so it doesn't depend on implicit import defaults. GitHub Pages continues to use the root-level copy.
