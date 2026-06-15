"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLeaderboard(data.leaderboard);
        
        // Trigger animation after data is loaded and rendered
        requestAnimationFrame(() => {
          setAnimated(true);
        });
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        setError("Failed to load leaderboard. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-page__container">
          <h1 className="leaderboard-page__title">🏆 Leaderboard</h1>
          <p className="leaderboard-page__subtitle">Rankings based on community vote win rates</p>
          <div className="leaderboard-page__loading">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="skeleton-item" key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <div className="leaderboard-page__container">
          <h1 className="leaderboard-page__title">🏆 Leaderboard</h1>
          <p className="leaderboard-page__error" style={{ textAlign: "center", color: "var(--clr-red)", marginTop: "2rem" }}>
            {error}
          </p>
          <Link href="/battle" className="leaderboard-page__back">
            ← Back to Battle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-page__container">
        <h1 className="leaderboard-page__title">🏆 Leaderboard</h1>
        <p className="leaderboard-page__subtitle">Rankings based on community vote win rates</p>

        {leaderboard.length === 0 ? (
          <div className="leaderboard-page__empty">
            <div className="leaderboard-page__empty-icon">🎧</div>
            <div className="leaderboard-page__empty-text">No battles recorded yet</div>
          </div>
        ) : (
          <div className="leaderboard-page__list">
            {leaderboard.map((song) => {
              const percent = Math.round(song.winRate * 100);
              const medalClass =
                song.rank === 1
                  ? "leaderboard-item--gold"
                  : song.rank === 2
                  ? "leaderboard-item--silver"
                  : song.rank === 3
                  ? "leaderboard-item--bronze"
                  : "";

              return (
                <div
                  className={`leaderboard-item ${medalClass}`}
                  key={song.id}
                >
                  <div className="leaderboard-item__rank">
                    {song.rank === 1
                      ? "🥇"
                      : song.rank === 2
                      ? "🥈"
                      : song.rank === 3
                      ? "🥉"
                      : `#${song.rank}`}
                  </div>

                  <img
                    className="leaderboard-item__image"
                    src={song.image}
                    alt={song.title}
                    width={50}
                    height={50}
                  />

                  <div className="leaderboard-item__info">
                    <div className="leaderboard-item__title">{song.title}</div>
                    <div className="leaderboard-item__artist">{song.artist}</div>
                  </div>

                  <div className="leaderboard-item__stats">
                    <div className="leaderboard-item__stats-row">
                      <span className="leaderboard-item__percent">
                        {percent}%
                      </span>
                      <span className="leaderboard-item__battles">
                        {song.totalBattles} {song.totalBattles === 1 ? "battle" : "battles"}
                      </span>
                    </div>
                    <div className="leaderboard-item__bar">
                      <div
                        className="leaderboard-item__bar-fill"
                        style={{ width: animated ? `${percent}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Link href="/battle" className="leaderboard-page__back">
          ← Back to Battle
        </Link>
      </div>
    </div>
  );
}
