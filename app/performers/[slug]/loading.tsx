import Link from "next/link";

export default function PerformerLoading() {
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
      <main id="main" className="performer-profile wrap" aria-busy="true" aria-label="Loading performer profile">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/performers">Performers</Link>
          <span>/</span>
          <span>Loading…</span>
        </div>
        <section className="profile-hero">
          <div className="profile-portrait skeleton-shimmer" style={{ background: "#232522" }} />
          <div className="profile-heading">
            <div className="skeleton-line skeleton-shimmer" style={{ width: "140px", height: "14px", marginBottom: "14px" }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: "240px", height: "36px", marginBottom: "16px" }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: "160px", height: "16px" }} />
          </div>
        </section>
        <div className="profile-columns">
          <section className="profile-bio">
            <h2>About</h2>
            <div className="skeleton-line skeleton-shimmer" style={{ width: "100%", height: "60px", marginBottom: "14px" }} />
          </section>
          <section className="profile-details">
            <h2>Profile details</h2>
            <div className="skeleton-line skeleton-shimmer" style={{ width: "100%", height: "100px" }} />
          </section>
        </div>
        <section className="profile-videos">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ON AFTERHOURS</span>
              <h2>Scenes</h2>
            </div>
          </div>
          <div className="video-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="video-card">
                <div className="thumb skeleton-shimmer" style={{ background: "#232522" }} />
                <div className="card-copy">
                  <div className="skeleton-line skeleton-shimmer" style={{ width: "90%", height: "16px", margin: "10px 0 6px" }} />
                  <div className="skeleton-line skeleton-shimmer" style={{ width: "50%", height: "12px" }} />
                </div>
              </div>
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
