import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { browseVideos, getPerformer } from "@/lib/adult-embed";
import VideoCard from "../../ui/video-card";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const performer = await getPerformer(slug);
  if (!performer) return { title: "Performer not found" };
  const description = performer.bio?.slice(0, 155) || `Explore ${performer.name}'s profile and videos.`;
  return { title: performer.name, description, alternates: { canonical: `/performers/${performer.slug}` }, openGraph: { title: performer.name, description, type: "profile", ...(performer.image ? { images: [performer.image] } : {}) } };
}

function Detail({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return <div className="profile-fact"><dt>{label}</dt><dd>{value}</dd></div>;
}

export default async function PerformerPage({ params }: Props) {
  const { slug } = await params;
  const [performer, videos] = await Promise.all([getPerformer(slug), browseVideos({ performer: slug, sort: "popular" })]);
  if (!performer) notFound();
  const career = [performer.career?.start, performer.career?.end].filter(Boolean).join("–");
  const jsonLd = { "@context": "https://schema.org", "@type": "Person", name: performer.name, description: performer.bio || undefined, image: performer.image || undefined, url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example"}/performers/${performer.slug}`, sameAs: Object.values(performer.links || {}) };

  return <><header className="site-header"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><nav className="main-nav" aria-label="Main navigation"><Link href="/">Discover</Link><Link href="/performers">Performers</Link></nav><form action="/" className="search-form"><label className="sr-only" htmlFor="q">Search videos</label><input id="q" name="q" placeholder="Search scenes, performers…" /><button aria-label="Search">⌕</button></form><span className="age-label">18+</span></header>
    <main id="main" className="performer-profile wrap"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/performers">Performers</Link><span>/</span><span>{performer.name}</span></div><section className="profile-hero"><div className="profile-portrait">{performer.image ? <Image src={performer.image} alt={performer.name} fill sizes="(max-width: 700px) 40vw, 320px" unoptimized priority /> : <span aria-hidden="true">{performer.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</span>}</div><div className="profile-heading"><span className="eyebrow">PERFORMER PROFILE</span><h1>{performer.name}</h1><p>{performer.video_count || videos.count} scenes in the archive</p>{performer.aliases && performer.aliases.length > 0 && <div className="aliases"><span>Also known as</span>{performer.aliases.join(" · ")}</div>}</div></section>
      <div className="profile-columns"><section className="profile-bio"><h2>About</h2>{performer.bio ? <p>{performer.bio}</p> : <p>Browse available credits and scenes featuring {performer.name}.</p>}{Object.keys(performer.links || {}).length > 0 && <div className="profile-links">{Object.entries(performer.links || {}).map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer nofollow">{label.replace(/_/g, " ")} ↗</a>)}</div>}</section><section className="profile-details"><h2>Profile details</h2><dl><Detail label="Age" value={performer.age} /><Detail label="Birthday" value={performer.birthday} /><Detail label="Birthplace" value={performer.birthplace} /><Detail label="Nationality" value={performer.nationality} /><Detail label="Ethnicity" value={performer.ethnicity} /><Detail label="Hair" value={performer.hair} /><Detail label="Eyes" value={performer.eyes} /><Detail label="Height" value={performer.height_cm ? `${performer.height_cm} cm` : null} /><Detail label="Career" value={career} /></dl></section></div>
      <section className="profile-videos"><div className="section-heading"><div><span className="eyebrow">ON AFTERHOURS</span><h2>Scenes with {performer.name}</h2></div><span>{videos.count.toLocaleString()} videos</span></div>{videos.results.length ? <div className="video-grid">{videos.results.map((video, i) => <VideoCard key={video.id} video={video} priority={i < 4} />)}</div> : <div className="empty-state"><h3>No scenes currently listed</h3></div>}</section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main><footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><p>Adult content. For adults 18 and older.</p><div><span>Privacy and legal information</span><span>© 2026 Afterhours</span></div></footer></>;
}
