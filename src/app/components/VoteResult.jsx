'use client';

import { useEffect, useState } from 'react';

/**
 * VoteResult — Shows animated percentage bars for the two battling songs,
 * plus a "NEXT BATTLE" button, styled inside a modern modal.
 */
export default function VoteResult({ songA, songB, onNextBattle }) {
  const [animated, setAnimated] = useState(false);

  // Trigger the bar animation after mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setAnimated(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const aIsWinner = songA.percent >= songB.percent;

  return (
    <div className="vote-result">
      <div className="vote-result__card">
        <h3 className="vote-result__title">⚡ BATTLE RESULTS ⚡</h3>

        <div className="vote-result__matchup">
          {/* Song A Entry */}
          <div className={`vote-result__entry ${aIsWinner ? 'vote-result__entry--winner' : ''}`}>
            <div className="vote-result__label">
              <span className="vote-result__song-name">
                {songA.title}
                {aIsWinner && <span className="vote-result__winner-badge">🔥 WINNER</span>}
              </span>
              <span className="vote-result__percent">{Math.round(songA.percent)}%</span>
            </div>
            <div className="vote-result__bar">
              <div
                className="vote-result__bar-fill"
                style={{
                  width: animated ? `${songA.percent}%` : '0%',
                }}
              />
            </div>
          </div>

          {/* Song B Entry */}
          <div className={`vote-result__entry ${!aIsWinner ? 'vote-result__entry--winner' : ''}`}>
            <div className="vote-result__label">
              <span className="vote-result__song-name">
                {songB.title}
                {!aIsWinner && <span className="vote-result__winner-badge">🔥 WINNER</span>}
              </span>
              <span className="vote-result__percent">{Math.round(songB.percent)}%</span>
            </div>
            <div className="vote-result__bar">
              <div
                className="vote-result__bar-fill"
                style={{
                  width: animated ? `${songB.percent}%` : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Next battle button */}
        <button className="vote-result__next-btn" onClick={onNextBattle}>
          ⚔️ NEXT BATTLE
        </button>
      </div>
    </div>
  );
}
