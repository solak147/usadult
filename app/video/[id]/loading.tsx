import Link from "next/link";

export default function VideoLoading() {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">A</span> AFTERHOURS
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/">Discover</Link>
          <Link href="/performers">Performers</Link>
          <Link href="/anime">Adult Anime</Link>
        </nav>
        <div className="search-form" style={{ pointerEvents: "none", opacity: 0.7 }}>
          <input placeholder="Search scenes, performers…" disabled />
          <button aria-label="Search" tabIndex={-1}>⌕</button>
        </div>
        <span className="age-label">18+</span>
      </header>
      <main id="main" className="detail-page wrap" aria-busy="true" aria-label="Loading video details">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Watch</span>
        </div>
        <div className="watch-layout">
          <div className="watch-main">
            <div className="skeleton-player skeleton-shimmer" />
            <div className="detail-layout">
              <article className="detail-main">
                <div className="skeleton-line skeleton-shimmer" style={{ width: "120px", height: "14px", marginBottom: "14px" }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: "75%", height: "36px", marginBottom: "16px" }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: "240px", height: "16px", marginBottom: "24px" }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: "100%", height: "50px", marginBottom: "24px" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <div className="skeleton-line skeleton-shimmer" style={{ width: "70px", height: "28px" }} />
                  <div className="skeleton-line skeleton-shimmer" style={{ width: "90px", height: "28px" }} />
                  <div className="skeleton-line skeleton-shimmer" style={{ width: "80px", height: "28px" }} />
                </div>
              </article>
            </div>
          </div>
          <aside className="detail-aside related-aside">
            <h2>Recommendations</h2>
            <div className="related-scroll">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="related-card-skeleton">
                  <div className="skeleton-thumb skeleton-shimmer" />
                  <div className="skeleton-related-info">
                    <div className="skeleton-line skeleton-shimmer" style={{ width: "90%", height: "13px", marginBottom: "8px" }} />
                    <div className="skeleton-line skeleton-shimmer" style={{ width: "55%", height: "11px" }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
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
