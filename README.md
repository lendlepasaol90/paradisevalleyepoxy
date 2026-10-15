# Paradise Valley Epoxy

Website for Paradise Valley Epoxy (paradisevalleyepoxy.com), an epoxy flooring contractor in Paradise Valley, AZ.

Static HTML, no build step. Preview locally with `python3 -m http.server` from this folder and open http://localhost:8000 (opening the files directly won't resolve the root paths).

## Pages
- `index.html` (home)
- Nine service pages, each in its own folder so URLs have no `.html` (e.g. `garage-floor-coatings-paradise-valley-az/index.html` is served at `/garage-floor-coatings-paradise-valley-az/`), linked from the Services dropdown
- Shared styles in `assets/css/site.css` and script in `assets/js/site.js`
- Links and assets use root paths (`/assets/...`), so serve the site from the domain root (custom domain on GitHub Pages, Netlify, Cloudflare Pages, etc.)

## Brand files
- **Logo:** `assets/logo-light.png/.webp` (white lettering, transparent) is used in the dark header and footer. `assets/logo.png/.webp` keeps the original black lettering for light backgrounds. `assets/logo-icon.png` is the square badge.
- **Favicon:** `favicon.ico` (16/32/48), `favicon-32.png` and `apple-touch-icon.png` in `assets/` are made from the square badge.

## To update later
- Phone and email are placeholders: (480) 555-0193 and info@paradisevalleyepoxy.com
- Photos in `assets/photos` are licensed from Envato Elements (Lifetime Commercial License, account: Danny)
- The estimate forms open the visitor's email app with the request pre-filled (sent to the email above). Connect them to a form service or Worker endpoint before launch for a true submit.

## SEO
- Photos are keyword-named, served as WebP with JPG fallback at 800px and 1600px (`srcset`), with descriptive alt text, width/height, and lazy loading
- Each page has Open Graph tags and JSON-LD: LocalBusiness and WebSite on home, Service and BreadcrumbList on service pages, plus ImageGallery and FAQPage on every page
- `sitemap.xml` (with image entries) and `robots.txt` are at the root
