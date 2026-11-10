import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { browsePerformers } from "@/lib/adult-embed";

type Props = { searchParams: Promise<{ q?: string; letter?: string; page?: string }> };
export const metadata: Metadata = {
  title: "Performer Directory",
  description: "Browse performer profiles and discover scenes by performer.",
  alternates: { canonical: "/performers" },
};

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

  return <><header className="site-header"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><nav className="main-nav" aria-label="Main navigation"><Link href="/">Discover</Link><Link href="/performers" aria-current="page">Performers</Link><Link href="/anime">Adult Anime</Link></nav><form action="/performers" className="search-form"><label className="sr-only" htmlFor="performer-q">Search performers</label><input id="performer-q" name="q" placeholder="Search performers…" defaultValue={params.q} /><button aria-label="Search performers">⌕</button></form><span className="age-label">18+</span></header>
    <main id="main" className="performers-page wrap"><div className="directory-intro"><span className="eyebrow">THE PEOPLE ON SCREEN</span><h1>Performer<br /><em>directory.</em></h1><p>Browse profiles and find more scenes by performer.</p></div><nav className="alphabet" aria-label="Filter performers by first letter">{letters.map(letter => <Link key={letter} className={params.letter?.toUpperCase() === letter ? "selected" : ""} href={hrefFor({ letter: params.letter?.toUpperCase() === letter ? undefined : letter, q: params.q, page: undefined })}>{letter}</Link>)}</nav>
      <div className="directory-heading"><h2>{params.q ? `Search results for “${params.q}”` : params.letter ? `${params.letter.toUpperCase()} performers` : "Popular performers"}</h2><span>{data.count.toLocaleString()} profiles</span></div>
      {data.results.length ? <div className="performer-grid">{data.results.map(person => <Link className="performer-card" key={person.slug} href={`/performers/${person.slug}`}><span className="performer-avatar">{person.image ? <Image src={person.image} alt={person.name} fill sizes="80px" unoptimized /> : <span aria-hidden="true">{person.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</span>}</span><span className="performer-card-copy"><strong>{person.name}</strong><small>{person.video_count.toLocaleString()} scenes</small></span><span className="performer-arrow" aria-hidden="true">↗</span></Link>)}</div> : <div className="empty-state"><h3>No performers found</h3><p>Try another name or letter.</p><Link href="/performers" className="text-link">Browse all performers ↗</Link></div>}
      <div className="pagination">{Number(params.page || 1) > 1 && <Link href={hrefFor({ ...params, page: String(Number(params.page || 1) - 1) })}>← Previous</Link>}<span>Page {params.page || 1}</span>{Number(params.page || 1) < data.pages && <Link href={hrefFor({ ...params, page: String(Number(params.page || 1) + 1) })}>Next page →</Link>}</div>
    </main><footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">A</span> AFTERHOURS</Link><p>Adult content. For adults 18 and older.</p><div><span>Privacy and legal information</span><span>© 2026 Afterhours</span></div></footer></>;
}
