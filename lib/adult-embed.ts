export type Video = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration?: string | null;
  duration_seconds?: number;
  view_count?: number;
  categories?: { name: string; slug: string }[];
  tags?: { name: string; slug: string }[];
  performers?: { name: string; slug: string }[];
  studio?: { name: string; slug: string } | null;
  published_at?: string;
};

type BrowseResponse = { count: number; next: string | null; results: Video[] };
export type FilterTerm = { id: number; name: string; slug: string; video_count: number };
export type Performer = FilterTerm & { image?: string | null; verified?: boolean; bio?: string | null };
export type PerformerProfile = {
  name: string; slug: string; image?: string | null; video_count?: number; bio?: string | null;
  aliases?: string[]; age?: number | null; birthday?: string | null; birthplace?: string | null;
  nationality?: string | null; ethnicity?: string | null; hair?: string | null; eyes?: string | null;
  height_cm?: number | null; weight_kg?: number | null; measurements?: string | null;
  career?: { start?: number | null; end?: number | null };
  links?: Record<string, string>;
};

export async function browseVideos(params: { search?: string; sort?: string; page?: string; category?: string; tag?: string; performer?: string } = {}) {
  // Use the live browse endpoint for discovery; v1 search is separately available,
  // but the browse API exposes the categories/tags used by the detail pages.
  const browse = new URL("https://adultembed.com/api/database/browse/");
  browse.searchParams.set("orientation", "all");
  browse.searchParams.set("sort", params.sort || "newest");
  browse.searchParams.set("page", params.page || "1");
  browse.searchParams.set("page_size", "24");
  if (params.search?.trim()) browse.searchParams.set("search", params.search.trim().slice(0, 80));
  if (params.category) browse.searchParams.set("categories", params.category);
  if (params.tag) browse.searchParams.set("tags", params.tag);
  if (params.performer) browse.searchParams.set("performers", params.performer);
  try {
    const response = await fetch(browse, { next: { revalidate: 600 }, headers: { "X-Site-URL": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" } });
    if (!response.ok) return { count: 0, next: null, results: [] } satisfies BrowseResponse;
    return (await response.json()) as BrowseResponse;
  } catch {
    return { count: 0, next: null, results: [] } satisfies BrowseResponse;
  }
}

export async function browseFilterTerms(type: "categories" | "tags"): Promise<FilterTerm[]> {
  try {
    const url = new URL(`https://adultembed.com/api/taxonomy/${type}/`);
    url.searchParams.set("ordering", "popular");
    url.searchParams.set("per_page", "12");
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const data = (await response.json()) as { results?: FilterTerm[] };
    return data.results || [];
  } catch {
    return [];
  }
}

export async function browsePerformers(params: { search?: string; letter?: string; page?: string } = {}) {
  const url = new URL("https://adultembed.com/api/taxonomy/performers/");
  url.searchParams.set("ordering", "popular");
  url.searchParams.set("per_page", "48");
  url.searchParams.set("page", params.page || "1");
  if (params.search?.trim()) url.searchParams.set("search", params.search.trim().slice(0, 80));
  if (params.letter && /^[a-z0-9]$/i.test(params.letter)) url.searchParams.set("starts_with", params.letter.toLowerCase());
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) return { count: 0, pages: 0, results: [] as Performer[] };
    return (await response.json()) as { count: number; pages: number; results: Performer[] };
  } catch {
    return { count: 0, pages: 0, results: [] as Performer[] };
  }
}

export async function getPerformer(slug: string): Promise<PerformerProfile | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  try {
    const response = await fetch(`https://adultembed.com/api/v1/performers/${slug}`, { next: { revalidate: 3600 } });
    return response.ok ? ((await response.json()) as PerformerProfile) : null;
  } catch {
    return null;
  }
}

export async function getVideo(id: string): Promise<Video | null> {
  if (!/^\d+$/.test(id)) return null;
  try {
    // The legacy browse endpoint used by this starter pairs with /api/videos/{id}/.
    const response = await fetch(`https://adultembed.com/api/videos/${id}/`, { next: { revalidate: 600 }, headers: { "X-Site-URL": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" } });
    return response.ok ? ((await response.json()) as Video) : null;
  } catch {
    return null;
  }
}

export async function getRelatedVideos(id: number, limit = 10): Promise<Video[]> {
  try {
    const url = new URL(`https://adultembed.com/api/v1/videos/${id}/related`);
    url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 20)));
    const response = await fetch(url, { next: { revalidate: 600 } });
    if (!response.ok) return [];
    const data = (await response.json()) as { results?: Array<{
      id: number; title: string; description?: string; thumbnail: string;
      duration?: string | null; duration_seconds?: number; published_at?: string;
      performers?: { name: string; slug: string }[];
      studio?: { name: string; slug: string } | null;
      stats?: { views?: number };
    }> };
    return (data.results || []).filter(video => video.id !== id).map(video => ({
      id: video.id,
      slug: String(video.id),
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      duration: video.duration,
      duration_seconds: video.duration_seconds,
      published_at: video.published_at,
      performers: video.performers,
      studio: video.studio,
      view_count: video.stats?.views || 0,
    }));
  } catch {
    return [];
  }
}

export function formatViews(value = 0) {
  return new Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}
