/*
  📚 HOW NEXT.JS PAGES WORK:
  
  This file (page.js) in the root of src/app/ becomes the HOMEPAGE (/).
  Every folder in src/app/ with a page.js becomes a route:
    src/app/page.js          → /
    src/app/battle/page.js   → /battle
    src/app/leaderboard/page.js → /leaderboard
  
  This page is a Server Component (no "use client") because it 
  doesn't need any interactivity — it just renders HTML.
  The interactive parts (particles, header) are Client Components 
  that get embedded inside this server-rendered page.
*/

import Link from "next/link";

export default function Home() {
  // Equalizer bar config for the decorative animation
  const eqBars = [
    { duration: "0.5s", maxHeight: "25px" },
    { duration: "0.7s", maxHeight: "35px" },
    { duration: "0.4s", maxHeight: "20px" },
    { duration: "0.6s", maxHeight: "40px" },
    { duration: "0.8s", maxHeight: "30px" },
    { duration: "0.45s", maxHeight: "22px" },
    { duration: "0.65s", maxHeight: "38px" },
    { duration: "0.55s", maxHeight: "28px" },
    { duration: "0.75s", maxHeight: "33px" },
    { duration: "0.5s", maxHeight: "18px" },
    { duration: "0.7s", maxHeight: "36px" },
    { duration: "0.4s", maxHeight: "24px" },
  ];

  return (
    <>
      <main className="hero" id="hero-section">
        {/* Badge */}
        <div className="hero__badge">🔊 The Ultimate Phonk Showdown</div>

        {/* Equalizer decoration */}
        <div className="hero__equalizer">
          {eqBars.map((bar, i) => (
            <div
              key={i}
              className="hero__eq-bar"
              style={{
                "--duration": bar.duration,
                "--max-height": bar.maxHeight,
              }}
            />
          ))}
        </div>

        {/* Main Title */}
        <h1 className="hero__title">
          <span className="hero__title-main">PHONK BATTLE</span>
          <span className="hero__title-sub">Choose Your Champion</span>
        </h1>

        {/* Description */}
        <p className="hero__description">
          Two tracks enter the arena. Only one survives. Listen to both phonk
          songs, feel the bass, and vote for the hardest track. See how your
          taste stacks up against the community.
        </p>

        {/* CTA Button */}
        <Link href="/battle" className="hero__cta" id="start-battle-btn">
          <span className="hero__cta-ring" />
          <span className="hero__cta-icon">⚔️</span>
          <span>Enter The Arena</span>
        </Link>

        {/* Stats */}
        <div className="hero__stats">
          <div className="hero__stat">
            <div className="hero__stat-value">10</div>
            <div className="hero__stat-label">Tracks</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">45</div>
            <div className="hero__stat-label">Matchups</div>
          </div>
          <div className="hero__stat">
            <div className="hero__stat-value">∞</div>
            <div className="hero__stat-label">Battles</div>
          </div>
        </div>
      </main>
    </>
  );
}