import Link from "next/link";

export default function AnimeLoading() {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">A</span> AFTERHOURS
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/">Discover</Link>
          <Link href="/performers">Performers</Link>
          <Link href="/anime">Adult anime</Link>
        </nav>
        <div className="search-form" style={{ pointerEvents: "none", opacity: 0.7 }}>
          <input placeholder="Search scenes, performers…" disabled />
          <button aria-label="Search" tabIndex={-1}>⌕</button>
        </div>
        <span className="age-label">18+</span>
      </header>
      <main id="main" className="anime-detail-page wrap" aria-busy="true" aria-label="Loading anime details">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/anime">Adult anime</Link>
          <span>/</span>
          <span>Loading…</span>
        </div>
        <section className="anime-detail-hero">
          <div className="anime-detail-poster skeleton-shimmer" style={{ background: "#232522" }} />
          <div className="anime-detail-copy">
            <div className="skeleton-line skeleton-shimmer" style={{ width: "160px", height: "14px", marginBottom: "14px" }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: "70%", height: "38px", marginBottom: "16px" }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: "100%", height: "50px", marginBottom: "20px" }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: "200px", height: "16px", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <div className="skeleton-line skeleton-shimmer" style={{ width: "65px", height: "26px" }} />
              <div className="skeleton-line skeleton-shimmer" style={{ width: "85px", height: "26px" }} />
              <div className="skeleton-line skeleton-shimmer" style={{ width: "75px", height: "26px" }} />
            </div>
          </div>
        </section>
        <section className="anime-episodes">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WATCH IN ORDER</span>
              <h2>Episodes</h2>
            </div>
          </div>
          <div className="episode-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="episode-card skeleton-shimmer" style={{ minHeight: "56px", background: "#1c1e1a" }} />
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <Link href="/" className="brand">
          <span className="brand-mark">A</span> AFTERHOURS
        </Link>
        <p>Adult content. For adults 18 and older.</p>
        <div>
          <span>Privacy and legal information</span>
          <span>© 2026 Afterhours</span>
        </div>
      </footer>
    </>
  );
}
