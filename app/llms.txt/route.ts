export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  const content = `# Afterhours (Adult Video & Animation Discovery)

> A curated adult video and anime discovery directory featuring scenes, performer profiles, and episodic animation series.

## Overview
Afterhours is a specialized video index designed for adults (18+). The platform indexes licensed adult scenes, studio releases, performer filmographies, and adult anime series with episode guides. All content is categorized with rich taxonomies, tags, and verified metadata.

## Core Sections
- Discover & Latest Scenes: ${base}/
- Performer Directory: ${base}/performers
- Adult Anime & Series: ${base}/anime
- Sitemap: ${base}/sitemap.xml

## Entity Types
1. **Video Scenes**: Full scene metadata including title, studio, verified performer credits, duration, view count, and streaming embeds.
2. **Performers**: Profiles detailing performer aliases, career timeline, physical attributes, verified social links, and scene listings.
3. **Adult Anime**: Episodic guides with release years, studio credits, episode lists, and player streams.

## Content & Compliance Standards
- Restricted to Adults (RTA-5042-1996-1400-1577-RTA).
- Age-restricted 18+ content only.
- Strict anti-abuse and content boundary verification enforced.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
