import type { MetadataRoute } from "next";
import { browsePerformers, browseVideos } from "@/lib/adult-embed";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  const [{ results: videos }, { results: performers }] = await Promise.all([
    browseVideos({ sort: "newest" }),
    browsePerformers(),
  ]);
  return [
    { url: base, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/performers`, changeFrequency: "daily", priority: 0.8 },
    ...performers.map(person => ({ url: `${base}/performers/${person.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...videos.map(video => ({ url: `${base}/video/${video.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
