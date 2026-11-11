import type { Metadata } from "next";
import Link from "next/link";
import { browseFilterTerms, browseVideos } from "@/lib/adult-embed";
import VideoCard from "./ui/video-card";
import HeroImage from "./ui/hero-image";

type SearchParams = { q?: string; sort?: string; page?: string; category?: string; tag?: string };
type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  let title = "Afterhours — Adult Video Discovery";
  let description = "Browse a carefully indexed collection of adult videos. Find scenes by category, performer, studio, and more.";

  if (params.q) {
    title = `“${params.q}” Scenes & Videos | Afterhours`;
    description = `Watch and discover scenes matching “${params.q}” on Afterhours.`;
  } else if (params.category) {
    const formatted = params.category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    title = `${formatted} Videos | Afterhours`;
    description = `Watch popular ${formatted.toLowerCase()} scenes and videos on Afterhours.`;
  } else if (params.tag) {
    const formatted = params.tag.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    title = `${formatted} Videos | Afterhours`;
    description = `Watch high definition ${formatted.toLowerCase()} scenes on Afterhours.`;
  }

  const canonicalPath = params.category
    ? `/?category=${encodeURIComponent(params.category)}`
    : params.tag
    ? `/?tag=${encodeURIComponent(params.tag)}`
    : "/";

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}${canonicalPath}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: params.q || params.page ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const [data, categories, tags] = await Promise.all([
    browseVideos({ search: params.q, sort: params.sort, page: params.page, category: params.category, tag: params.tag }),
    browseFilterTerms("categories"),
    browseFilterTerms("tags"),
  ]);
  const featured = data.results.find(item => Boolean(item.tpdb_background_url?.trim())) || data.results[0];
  const featuredImage = featured?.tpdb_background_url?.trim() || featured?.thumbnail;
  const hrefFor = (patch: Partial<SearchParams>) => {
    const next = { ...params, ...patch };
    const query = new URLSearchParams();
    for (const key of ["q", "sort", "page", "category", "tag"] as const) {
      if (next[key]) query.set(key, next[key]!);
    }
    return `/?${query.toString()}`;
  };
  const categoryLabel = categories.find(item => item.slug === params.category)?.name;
  const tagLabel = tags.find(item => item.slug === params.tag)?.name;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Afterhours",
    url: siteUrl,
    description: "Browse a carefully indexed collection of adult videos. Find scenes by category, performer, studio, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  const itemListLd = data.results.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryLabel || tagLabel || (params.q ? `Scenes for “${params.q}”` : "Recent scenes"),
    itemListElement: data.results.slice(0, 12).map((video, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description || video.title,
        thumbnailUrl: video.tpdb_background_url || video.thumbnail,
        duration: video.duration_seconds
          ? `PT${Math.floor(video.duration_seconds / 3600)}H${Math.floor((video.duration_seconds % 3600) / 60)}M${Math.floor(video.duration_seconds % 60)}S`
          : undefined,
        url: `${siteUrl}/video/${video.id}`,
      },
    })),
  } : null;

  return <><header className="site-header"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><nav className="main-nav" aria-label="Main navigation"><a href="#discover">Discover</a><a href="#discover">Popular</a><a href="#filters">Categories</a><Link href="/performers">Performers</Link><Link href="/anime">Adult Anime</Link></nav><form action="/" className="search-form"><label className="sr-only" htmlFor="q">Search videos</label><input id="q" name="q" placeholder="Search scenes, performers…" defaultValue={params.q} /><button aria-label="Search">⌕</button></form><span className="age-label">18+</span></header>
    <main id="main">
      <section className="hero wrap" data-enter>
        <div className="hero-copy"><span className="eyebrow"><i /> THE ADULT VIDEO INDEX</span><h1>Find your<br /><em>afterhours.</em></h1><p>A sharper way to explore the scenes, studios, and performers you love.</p><a className="button button-accent" href="#discover">Explore the collection <span>↓</span></a><div className="hero-count"><strong>{data.count ? new Intl.NumberFormat("en").format(data.count) : "New"}</strong><span>videos to discover</span></div></div>
        {featured && featuredImage ? <Link href={`/video/${featured.id}`} className="hero-feature" aria-label={`Watch ${featured.title}`}><HeroImage src={featuredImage} fallbackSrc={featured.thumbnail} alt={featured.title} /><span className="feature-shade" /><span className="feature-label">LATEST ADDITION <b>↗</b></span><span className="feature-duration">{featured.duration}</span></Link> : <div className="hero-feature hero-empty"><span className="feature-label">LATEST ADDITION</span><span>New scenes arrive daily.</span></div>}
      </section>
      <section id="discover" className="collection wrap">
        <div className="section-heading"><div><span className="eyebrow">YOUR NEXT WATCH</span><h2>{categoryLabel || tagLabel ? `${categoryLabel || ""}${categoryLabel && tagLabel ? " · " : ""}${tagLabel || ""}` : params.q ? `Results for “${params.q}”` : "Recently added"}</h2></div><div className="sort-links"><a className={!params.sort || params.sort === "newest" ? "active" : ""} href={hrefFor({ sort: "newest", page: undefined })}>Newest</a><a className={params.sort === "popular" ? "active" : ""} href={hrefFor({ sort: "popular", page: undefined })}>Popular</a></div></div>
        <div className="filters" id="filters">
          <div className="filter-row"><span className="filter-label">CATEGORIES</span><div className="filter-options"><Link className={!params.category ? "filter-chip selected" : "filter-chip"} href={hrefFor({ category: undefined, page: undefined })}>All</Link>{categories.map(item => <Link key={item.slug} className={params.category === item.slug ? "filter-chip selected" : "filter-chip"} href={hrefFor({ category: params.category === item.slug ? undefined : item.slug, page: undefined })}>{item.name}</Link>)}</div></div>
          <div className="filter-row"><span className="filter-label">TAGS</span><div className="filter-options">{tags.map(item => <Link key={item.slug} className={params.tag === item.slug ? "filter-chip selected" : "filter-chip"} href={hrefFor({ tag: params.tag === item.slug ? undefined : item.slug, page: undefined })}>{item.name}</Link>)}</div></div>
        </div>
        {data.results.length ? <div className="video-grid">{data.results.map((video, i) => <VideoCard key={video.id} video={video} priority={i < 4} />)}</div> : <div className="empty-state"><span>○</span><h3>No scenes found</h3><p>Try a different search, or check back soon for new additions.</p><Link href="/" className="text-link">Clear filters ↗</Link></div>}
        <div className="pagination">{Number(params.page || 1) > 1 && <Link href={hrefFor({ page: String(Number(params.page || 1) - 1) })}>← Previous</Link>}<span>Page {params.page || 1}</span>{data.next && <Link href={hrefFor({ page: String(Number(params.page || 1) + 1) })}>Next page →</Link>}</div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd).replace(/</g, "\\u003c") }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, "\\u003c") }} />}
    </main>
    <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><p>Adult content. For adults 18 and older.</p><div><span>Privacy and legal information</span><span>© 2026 Afterhours</span></div></footer>
  </>;
}
