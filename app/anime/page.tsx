import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAdultAnimeByGenre, getAdultAnimeGenres, getFeaturedAdultAnime } from "@/lib/reya-h";
import AdultAnimeSection from "../ui/adult-anime-section";

type SearchParams = { genre?: string; page?: string };

export const metadata: Metadata = {
  title: "Adult Anime",
  description: "Browse adult anime series, explore episode guides, and find your next watch.",
  alternates: { canonical: "/anime" },
  openGraph: {
    title: "Adult Anime | Afterhours",
    description: "Browse adult anime series and episode guides.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adult Anime | Afterhours",
    description: "Browse adult anime series and episode guides.",
  },
};

export default async function AdultAnimeIndexPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const requestedPage = Number(params.page || 1);
  const pageNumber = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const genresPromise = getAdultAnimeGenres();
  const [genres, popularTitles, genreResults] = await Promise.all([
    genresPromise,
    params.genre ? Promise.resolve([]) : getFeaturedAdultAnime(),
    params.genre ? getAdultAnimeByGenre(params.genre, pageNumber, genresPromise) : Promise.resolve(null),
  ]);
  const selectedGenre = genres.find(genre => genre.slug === params.genre);
  const titles = selectedGenre ? genreResults?.items || [] : params.genre ? [] : popularTitles;
  const activePage = genreResults?.page || pageNumber;
  const quickGenres = genres.slice(0, 12);
  const moreGenres = genres.slice(12);
  const featured = titles[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: selectedGenre ? `${selectedGenre.name} anime` : "Adult anime series",
    itemListElement: titles.map((title, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@type": "TVSeries", name: title.title, url: `${siteUrl}/anime/${title.slug}`, image: title.posterUrl },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Adult Anime", item: `${siteUrl}/anime` },
    ],
  };
  const genreHref = (slug?: string, page?: number) => {
    const query = new URLSearchParams();
    if (slug) query.set("genre", slug);
    if (page && page > 1) query.set("page", String(page));
    const search = query.toString();
    return search ? `/anime?${search}` : "/anime";
  };

  return <>
    <header className="site-header">
      <Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/">Discover</Link><Link href="/performers">Performers</Link><Link href="/anime" aria-current="page">Adult Anime</Link>
      </nav>
      <form action="/" className="search-form"><label className="sr-only" htmlFor="q">Search videos</label><input id="q" name="q" placeholder="Search scenes, performers…" /><button aria-label="Search">⌕</button></form>
      <span className="age-label">18+</span>
    </header>
    <main id="main">
      <section className="anime-index-hero wrap" data-enter>
        <div className="anime-index-copy">
          <span className="eyebrow"><i /> 18+ ANIMATION INDEX</span>
          <h1>Adult anime,<br /><em>all in one place.</em></h1>
          <p>{selectedGenre ? `Browse ${selectedGenre.name} series and explore their episode guides.` : "Browse series, explore episode guides, and pick up where you want to watch."}</p>
          <a className="button button-accent" href="#anime-catalog">Browse the collection <span>↓</span></a>
          <div className="hero-count"><strong>{titles.length}</strong><span>series to explore</span></div>
        </div>
        {featured ? <Link href={`/anime/${encodeURIComponent(featured.slug)}`} className="anime-index-feature" aria-label={`View ${featured.title}`}>
          <Image src={featured.posterUrl} alt={featured.title} fill priority sizes="(max-width: 700px) 100vw, 55vw" unoptimized />
          <span className="anime-index-shade" /><span className="feature-label">FEATURED SERIES <b>↗</b></span>
        </Link> : <div className="anime-index-feature anime-index-empty"><span className="feature-label">18+ ANIMATION</span><span>New series arrive regularly.</span></div>}
      </section>
      <nav className="anime-genre-filters wrap" aria-label="Filter anime by genre">
        <div className="anime-genre-heading"><span className="filter-label">FILTER BY GENRE</span>{selectedGenre && <span>Showing {selectedGenre.name}</span>}</div>
        <div className="anime-genre-options">
          <Link href={genreHref()} className={`anime-genre-chip${!selectedGenre ? " selected" : ""}`} aria-current={!selectedGenre ? "page" : undefined}>All</Link>
          {quickGenres.map(genre => <Link key={genre.slug} href={genreHref(genre.slug)} className={`anime-genre-chip${selectedGenre?.slug === genre.slug ? " selected" : ""}`} aria-current={selectedGenre?.slug === genre.slug ? "page" : undefined}>{genre.name}</Link>)}
          {moreGenres.length > 0 && <details className="anime-more-genres" open={Boolean(selectedGenre && moreGenres.some(genre => genre.slug === selectedGenre.slug))}>
            <summary className="anime-genre-chip">More genres <span aria-hidden="true">⌄</span></summary>
            <div className="anime-more-menu">{moreGenres.map(genre => <Link key={genre.slug} href={genreHref(genre.slug)} className={`anime-genre-chip${selectedGenre?.slug === genre.slug ? " selected" : ""}`} aria-current={selectedGenre?.slug === genre.slug ? "page" : undefined}>{genre.name}</Link>)}</div>
          </details>}
        </div>
      </nav>
      <AdultAnimeSection titles={titles} heading={selectedGenre?.name || "Recently added"} />
      {selectedGenre && <div className="anime-pagination wrap" aria-label="Anime results pages">
        {activePage > 1 ? <Link href={genreHref(selectedGenre.slug, activePage - 1)}>← Previous</Link> : <span />}
        <span>Page {activePage}</span>
        {genreResults?.hasNextPage ? <Link href={genreHref(selectedGenre.slug, activePage + 1)}>Next page →</Link> : <span />}
      </div>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
      {titles.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />}
    </main>
    <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><p>Adult content. For adults 18 and older.</p><div><span>Privacy and legal information</span><span>© 2026 Afterhours</span></div></footer>
  </>;
}
