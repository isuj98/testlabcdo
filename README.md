# TestLab CDO website (Astro rebuild)

Rebuild of testlabcdo.com from the Wayback Machine capture of 2025-03-21 (`reference/`).

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

## Needs from the client

- Real copy and photos for the 9 subpages (never archived).
- Real testimonials (the live site showed Lorem ipsum).
- The estimate form they wanted, and a form backend (now `mailto:`).
- Hosting choice. `dist/` works on any static host (Netlify, Vercel, Cloudflare Pages, cPanel).
