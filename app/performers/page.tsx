import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { browsePerformers } from "@/lib/adult-embed";

type Props = { searchParams: Promise<{ q?: string; letter?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  let title = "Performer Directory | Afterhours";
  let description = "Browse performer profiles and discover scenes by performer.";

  if (params.q) {
    title = `“${params.q}” Performers | Afterhours`;
    description = `Search results for adult performers matching “${params.q}”.`;
  } else if (params.letter) {
    title = `Letter ${params.letter.toUpperCase()} Performers | Afterhours`;
    description = `Browse adult performers starting with letter ${params.letter.toUpperCase()}.`;
  }

  const canonical = params.letter
    ? `/performers?letter=${params.letter.toLowerCase()}`
    : "/performers";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}${canonical}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: params.q || params.page ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function PerformersPage({ searchParams }: Props) {
  const params = await searchParams;
  const data = await browsePerformers(params);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const hrefFor = (next: { q?: string; letter?: string; page?: string }) => {
    const query = new URLSearchParams();
    if (next.q) query.set("q", next.q);
    if (next.letter) query.set("letter", next.letter);
    if (next.page) query.set("page", next.page);
    return `/performers?${query.toString()}`;
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afterhours.example";
  const itemListLd = data.results.length ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.letter ? `${params.letter.toUpperCase()} performers` : "Popular performers",
    itemListElement: data.results.slice(0, 24).map((person, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Person",
        name: person.name,
        url: `${siteUrl}/performers/${person.slug}`,
        image: person.image || undefined,
      },
    })),
  } : null;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Performers", item: `${siteUrl}/performers` },
    ],
  };

  return <><header className="site-header"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><nav className="main-nav" aria-label="Main navigation"><Link href="/">Discover</Link><Link href="/performers" aria-current="page">Performers</Link><Link href="/anime">Adult Anime</Link></nav><form action="/performers" className="search-form"><label className="sr-only" htmlFor="performer-q">Search performers</label><input id="performer-q" name="q" placeholder="Search performers…" defaultValue={params.q} /><button aria-label="Search performers">⌕</button></form><span className="age-label">18+</span></header>
    <main id="main" className="performers-page wrap"><div className="directory-intro"><span className="eyebrow">THE PEOPLE ON SCREEN</span><h1>Performer<br /><em>directory.</em></h1><p>Browse profiles and find more scenes by performer.</p></div><nav className="alphabet" aria-label="Filter performers by first letter">{letters.map(letter => <Link key={letter} className={params.letter?.toUpperCase() === letter ? "selected" : ""} href={hrefFor({ letter: params.letter?.toUpperCase() === letter ? undefined : letter, q: params.q, page: undefined })}>{letter}</Link>)}</nav>
      <div className="directory-heading"><h2>{params.q ? `Search results for “${params.q}”` : params.letter ? `${params.letter.toUpperCase()} performers` : "Popular performers"}</h2><span>{data.count.toLocaleString()} profiles</span></div>
      {data.results.length ? <div className="performer-grid">{data.results.map(person => <Link className="performer-card" key={person.slug} href={`/performers/${person.slug}`}><span className="performer-avatar">{person.image ? <Image src={person.image} alt={person.name} fill sizes="80px" unoptimized /> : <span aria-hidden="true">{person.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</span>}</span><span className="performer-card-copy"><strong>{person.name}</strong><small>{person.video_count.toLocaleString()} scenes</small></span><span className="performer-arrow" aria-hidden="true">↗</span></Link>)}</div> : <div className="empty-state"><h3>No performers found</h3><p>Try another name or letter.</p><Link href="/performers" className="text-link">Browse all performers ↗</Link></div>}
      <div className="pagination">{Number(params.page || 1) > 1 && <Link href={hrefFor({ ...params, page: String(Number(params.page || 1) - 1) })}>← Previous</Link>}<span>Page {params.page || 1}</span>{Number(params.page || 1) < data.pages && <Link href={hrefFor({ ...params, page: String(Number(params.page || 1) + 1) })}>Next page →</Link>}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, "\\u003c") }} />}
    </main><footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><p>Adult content. For adults 18 and older.</p><div><span>Privacy and legal information</span><span>© 2026 Afterhours</span></div></footer></>;
}
