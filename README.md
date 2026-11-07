# TestLab CDO website (Astro rebuild)

Rebuild of testlabcdo.com from the Wayback Machine capture of 2025-03-21 (`reference/`), the newest public copy.

The homepage, header, footer and contact block are the original Divi markup and CSS, converted by
`scripts/convert-archive.mjs` into `src/divi/` and `public/divi/site.css`. To refresh from a newer capture:

```bash
node scripts/convert-archive.mjs <archived.html> <folder with the et-cache css files>
```

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Pages (same URLs as the old WordPress site)

| URL | Source |
|---|---|
| `/` | Archived homepage, full copy |
| `/about-testlab/` | Homepage text (about, eco, DPWH) |
| `/our-services/` + 4 service pages | Homepage service blurbs; On-Site Testing has none |
| `/our-projects/`, `/drilling-machines/`, `/material-testing-equipment/` | No archived content: placeholder line + CTA |
| `/contact-us/` | Homepage contact block |

## Sources searched (2026-11-07)

- Wayback Machine: 16 captures, all of the homepage only. No subpage was ever captured.
- archive.today and web search: no subpage copies.
- Common Crawl: index server returned 504 for every query on 2026-11-07 (even example.com). Not checked; retry later with `https://index.commoncrawl.org/CC-MAIN-2025-13-index?url=*.testlabcdo.com&output=json`.
- Facebook (APBTestLab) needs a login; JobStreet has a short company profile only.
- The old host was GoDaddy Managed WordPress (Divi + WooCommerce). GoDaddy backups are the only likely source for the 9 subpages and any products.

## Needs from the client

- Real copy and photos for the 9 subpages (never archived).
- Real testimonials (the live site showed Lorem ipsum).
- The estimate form they wanted, and a form backend (now `mailto:`).
- Hosting choice. `dist/` works on any static host (Netlify, Vercel, Cloudflare Pages, cPanel).
