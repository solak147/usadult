import Image from "next/image";
import Link from "next/link";
import type { AdultAnime } from "@/lib/reya-h";

export default function AdultAnimeSection({ titles, heading = "Recently added" }: { titles: AdultAnime[]; heading?: string }) {
  return <section id="anime-catalog" className="adult-anime wrap" aria-labelledby="adult-anime-title">
    <div className="section-heading"><div><span className="eyebrow">BROWSE THE COLLECTION</span><h2 id="adult-anime-title">{heading}</h2></div><span className="adult-anime-source">From HentaiHaven</span></div>
    {titles.length ? <div className="anime-grid">{titles.map(title => <article className="anime-card" key={title.slug}>
      <Link className="anime-poster" href={`/anime/${encodeURIComponent(title.slug)}`} aria-label={`View ${title.title} details`}>
        <Image src={title.posterUrl} alt={title.title} fill sizes="(max-width: 700px) 50vw, 20vw" unoptimized />
        <span>{title.episodeCount ? `${title.episodeCount} episodes` : "Series"}</span>
      </Link>
      <h3><Link href={`/anime/${encodeURIComponent(title.slug)}`}>{title.title}</Link></h3>
      <div className="anime-meta"><span>{title.years?.[0] || ""}</span><span>{title.genres?.slice(0, 2).map(genre => genre.name).join(" · ")}</span></div>
    </article>)}</div> : <div className="empty-state"><span>○</span><h3>No series available</h3><p>The anime catalog could not be loaded. Please check back soon.</p></div>}
  </section>;
}
