# Afterhours

Next.js App Router starter for an adult video discovery site. Home and video detail pages render on the server and fetch listing metadata from AdultEmbed; the player is embedded on each detail page.

## Local setup

```sh
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before deployment. It supplies canonical metadata, sitemap URLs, and the `X-Site-URL` sent on server-side AdultEmbed requests. The built-in `.example` origin is a placeholder and must be replaced for production.

## Content and SEO

- The homepage supports server-rendered `q`, `sort`, and `page` query parameters.
- `/video/[id]` renders title and description metadata, Open Graph metadata, `VideoObject` JSON-LD, and a scrollable sidebar of related videos.
- `/performers` provides searchable and A–Z performer listings; `/performers/[slug]` shows the available profile data and matching scenes.
- `robots.txt` allows public pages and points crawlers to the generated sitemap.
- The sitemap currently lists the first 24 latest scenes and the first 48 popular performer profiles. A production catalogue should store/sync the AdultEmbed feed and generate paginated sitemap shards so the full catalogue is discoverable without making a large API crawl during each sitemap request.
- No site ad placements are included yet. Connect an adult-content-compatible ad provider after domain, geography, and policy requirements are known.
- The age confirmation is a front-end self-attestation, not jurisdiction-specific age verification. Replace it with the age assurance flow required in the launch markets.
- Publish real privacy, terms, and required legal disclosures before launch.
