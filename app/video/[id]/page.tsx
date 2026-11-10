import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedVideos, getVideo } from "@/lib/adult-embed";
import RelatedVideos from "../../ui/related-videos";
import PlayerFrame from "../../ui/player-frame";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) return { title: "Video unavailable" };
  const description = video.description?.slice(0, 155) || `Watch ${video.title} on Afterhours.`;
  return {
    title: video.title,
    description,
    openGraph: { title: video.title, description, type: "video.other", images: [video.thumbnail] },
    alternates: { canonical: `/video/${video.id}` },
  };
}

export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) notFound();
  const relatedVideos = await getRelatedVideos(video.id, 12);
  // autoplay=1 disables AdultEmbed's click-through mode, which forwards the
  // poster tap straight into a third-party source. Playback still starts on
  // the visitor's tap via the embedded player's own play control.
  const playerUrl = `https://adultembed.com/player/embed/${video.id}/?autoplay=1`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  const duration = video.duration_seconds
    ? `PT${Math.floor(video.duration_seconds / 3600)}H${Math.floor((video.duration_seconds % 3600) / 60)}M${Math.floor(video.duration_seconds % 60)}S`
    : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description || video.title,
    thumbnailUrl: video.thumbnail,
    duration,
    uploadDate: video.published_at,
    embedUrl: playerUrl,
    url: `${siteUrl}/video/${video.id}`,
  };

  return <>
    <header className="site-header">
      <Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link>
      <nav className="main-nav" aria-label="Main navigation"><Link href="/">Discover</Link><Link href="/performers">Performers</Link><Link href="/#adult-anime">Adult Anime</Link></nav>
      <form action="/" className="search-form"><label className="sr-only" htmlFor="q">Search videos</label><input id="q" name="q" placeholder="Search scenes, performers…" /><button aria-label="Search">⌕</button></form>
      <span className="age-label">18+</span>
    </header>
    <main id="main" className="detail-page wrap">
      <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Watch</span></div>
      <div className="watch-layout">
        <div className="watch-main">
          <PlayerFrame src={playerUrl} title={video.title} thumbnail={video.thumbnail} />
          <div className="detail-layout">
            <article className="detail-main">
              <span className="eyebrow">{video.studio?.name || "FEATURED SCENE"}</span>
              <h1>{video.title}</h1>
              <div className="detail-meta"><span>{video.duration || "Duration unavailable"}</span><span>{video.view_count?.toLocaleString() || "—"} views</span></div>
              {video.description && <p className="description">{video.description}</p>}
              <div className="tag-list">{video.tags?.slice(0, 12).map(tag => <Link key={tag.slug} href={`/?tag=${encodeURIComponent(tag.slug)}#filters`}>{tag.name}</Link>)}</div>
              <section className="scene-performers"><h2>In this scene</h2>{video.performers?.map(person => <Link className="person" key={person.slug} href={`/performers/${encodeURIComponent(person.slug)}`}>{person.name}<span>Performer profile ↗</span></Link>)}</section>
            </article>
          </div>
        </div>
        <aside className="detail-aside related-aside"><h2>Recommendations</h2><RelatedVideos videos={relatedVideos} /></aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
    <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><p>Adult content. For adults 18 and older.</p><div><span>Privacy and legal information</span><span>© 2026 Afterhours</span></div></footer>
  </>;
}
