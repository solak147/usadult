export type AdultAnime = {
  id?: string;
  slug: string;
  title: string;
  posterUrl: string;
  url: string;
  genres?: { slug: string; name: string; url?: string }[];
  years?: number[];
  episodeCount?: number;
  description?: string;
};
export type AdultAnimeEpisode = { id: string; number: number; title: string; slug: string; thumbnailUrl?: string; releaseDate?: string };
export type AdultAnimeDetails = AdultAnime & {
  backdropUrl?: string;
  studios?: string[];
  totalViews?: number;
  episodeCount: number;
  episodes: AdultAnimeEpisode[];
};

const API = "https://haven.reyamika.eu.cc/api";
const SOURCE_HOSTS = new Set(["hentaihaven.com", "www.hentaihaven.com"]);
const EXCLUDED_TERMS = /(?:shota|shotacon|loli(?:con)?|teen|young|school|student|underage|child|minor|ageplay|incest|rape|bestiality|zoophilia)/i;
const ADULT_TERMS = /(?:milf|housewife|office[-\s]?lady|widow|married|wife|mature|人妻|熟女)/i;

export function isSafeAdultEntry(item: AdultAnime) {
  try {
    const genreText = (item.genres || []).map(genre => `${genre.slug} ${genre.name}`).join(" ");
    const searchable = `${item.title} ${item.description || ""} ${genreText}`;
    const url = new URL(item.url);
    const poster = new URL(item.posterUrl);
    // Only include metadata with an adult-coded signal and exclude known
    // minor/age-ambiguous labels. The upstream API does not expose character ages.
    return ADULT_TERMS.test(searchable)
      && !EXCLUDED_TERMS.test(searchable)
      && SOURCE_HOSTS.has(url.hostname)
      && poster.protocol === "https:";
  } catch {
    return false;
  }
}

export async function getAdultAnime(slug: string): Promise<AdultAnimeDetails | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  try {
    const response = await fetch(`${API}/anime/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const anime = (await response.json()) as AdultAnimeDetails;
    if (!anime.slug || !anime.title || !anime.posterUrl || !anime.url || !isSafeAdultEntry(anime)) return null;
    return anime;
  } catch {
    return null;
  }
}

export async function getFeaturedAdultAnime(): Promise<AdultAnime[]> {
  try {
    const response = await fetch(`${API}/popular?offset=0&limit=48`, {
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { items?: AdultAnime[] };
    return (data.items || []).filter(item => item.slug && item.title && item.posterUrl && item.url && isSafeAdultEntry(item)).slice(0, 8);
  } catch {
    return [];
  }
}
