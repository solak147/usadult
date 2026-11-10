import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdultAnime } from "@/lib/reya-h";
import AdultAnimePlayer from "../../ui/adult-anime-player";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ episode?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const anime = await getAdultAnime(slug);
  if (!anime) return { title: "Anime not found" };
  const description = anime.description?.slice(0, 155) || `Episodes and details for ${anime.title}.`;
  return {
    title: anime.title,
    description,
    alternates: { canonical: `/anime/${anime.slug}` },
    openGraph: { title: anime.title, description, type: "video.tv_show", images: [anime.posterUrl] },
  };
}

export default async function AdultAnimePage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const anime = await getAdultAnime(slug);
  if (!anime) notFound();
  const episodeNumber = Number(query.episode);
  const selectedEpisode = Number.isInteger(episodeNumber) && anime.episodes.some(item => item.number === episodeNumber)
    ? episodeNumber
    : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: anime.title,
    description: anime.description || undefined,
    image: anime.posterUrl,
    numberOfEpisodes: anime.episodeCount,
    datePublished: anime.years?.[0] ? String(anime.years[0]) : undefined,
    url: `${siteUrl}/anime/${anime.slug}`,
  };

  return <>
    <header className="site-header">
      <Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link>
      <nav className="main-nav" aria-label="Main navigation"><Link href="/">Discover</Link><Link href="/performers">Performers</Link><Link href="/#adult-anime">Adult anime</Link></nav>
      <form action="/" className="search-form"><label className="sr-only" htmlFor="q">Search videos</label><input id="q" name="q" placeholder="Search scenes, performers…" /><button aria-label="Search">⌕</button></form>
      <span className="age-label">18+</span>
    </header>
    <main id="main" className="anime-detail-page wrap">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/#adult-anime">Adult anime</Link><span>/</span><span>{anime.title}</span></div>
      {selectedEpisode && <section id="player" className="anime-watch"><div className="anime-watch-heading"><div><span className="eyebrow">NOW PLAYING</span><h1>{anime.title} — Episode {selectedEpisode}</h1></div><Link href={`/anime/${anime.slug}`} className="text-link">Back to episodes ↑</Link></div><AdultAnimePlayer slug={anime.slug} episode={selectedEpisode} poster={anime.posterUrl} /></section>}
      <section className="anime-detail-hero">
        <div className="anime-detail-poster"><Image src={anime.posterUrl} alt={anime.title} fill sizes="(max-width: 700px) 42vw, 300px" unoptimized priority /></div>
        <div className="anime-detail-copy"><span className="eyebrow">18+ ANIMATION · {anime.years?.[0] || "SERIES"}</span><h1>{anime.title}</h1><p className="anime-detail-summary">{anime.description || `Watch episodes of ${anime.title}.`}</p><div className="anime-detail-meta"><span>{anime.episodeCount} episodes</span>{anime.totalViews !== undefined && <span>{new Intl.NumberFormat("en", { notation: "compact" }).format(anime.totalViews)} views</span>}{anime.studios?.map(studio => <span key={studio}>{studio}</span>)}</div><div className="anime-genres">{anime.genres?.map(genre => <span key={genre.slug}>{genre.name}</span>)}</div></div>
      </section>
      <section className="anime-episodes" aria-labelledby="episodes-title"><div className="section-heading"><div><span className="eyebrow">WATCH IN ORDER</span><h2 id="episodes-title">Episodes</h2></div><span>{anime.episodes.length} available</span></div><div className="episode-grid">{anime.episodes.map(episode => <Link key={episode.id} className={selectedEpisode === episode.number ? "episode-card selected" : "episode-card"} href={`/anime/${anime.slug}?episode=${episode.number}#player`}><span className="episode-number">{String(episode.number).padStart(2, "0")}</span><span className="episode-title">{episode.title || `Episode ${episode.number}`}</span><span className="episode-arrow" aria-hidden="true">↗</span></Link>)}</div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
    <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><p>Adult content. For adults 18 and older.</p><div><span>Privacy and legal information</span><span>© 2026 Afterhours</span></div></footer>
  </>;
}
