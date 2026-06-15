'use client';

import { useState, useEffect, useCallback } from 'react';
import { songs } from '../lib/songs';
import SongCard from '../components/SongCard';
import VSBadge from '../components/VSBadge';
import VoteResult from '../components/VoteResult';

/**
 * BattlePage — the main battle arena where two songs face off.
 * Users listen, compare, and vote for their favorite.
 * Matchups are selected in 5-round cycles to ensure all songs are heard once.
 */
export default function BattlePage() {
  const [songsPair, setSongsPair] = useState(null); // [songA, songB]
  const [hasVoted, setHasVoted] = useState(false);
  const [votedWinnerId, setVotedWinnerId] = useState(null);
  const [results, setResults] = useState(null); // { winnerPercent, loserPercent }
  const [isVoting, setIsVoting] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  // Get next pair from the 5-matchup cycle
  const getNextPairFromCycle = useCallback(() => {
    let queue = [];
    try {
      const stored = localStorage.getItem('phonk_battle_queue');
      if (stored) {
        queue = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading localStorage queue:', e);
    }

    // If queue is empty or invalid, generate a new shuffled cycle of 5 matchups
    if (!queue || queue.length === 0) {
      const ids = songs.map(s => s.id);
      
      // Durstenfeld Shuffle
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }

      // Group into 5 unique matches covering all 10 songs
      queue = [
        [ids[0], ids[1]],
        [ids[2], ids[3]],
        [ids[4], ids[5]],
        [ids[6], ids[7]],
        [ids[8], ids[9]],
      ];
    }

    // Pop the next matchup from the cycle
    const nextMatch = queue.shift();
    
    // Save remaining queue back to localStorage
    try {
      localStorage.setItem('phonk_battle_queue', JSON.stringify(queue));
      // Round number is: 5 - remaining queue items
      setRoundNumber(5 - queue.length);
    } catch (e) {
      console.error('Error saving localStorage queue:', e);
    }

    // Find song objects by ID
    const songA = songs.find(s => s.id === nextMatch[0]);
    const songB = songs.find(s => s.id === nextMatch[1]);
    return [songA, songB];
  }, []);

  // Pick initial pair on mount
  useEffect(() => {
    setSongsPair(getNextPairFromCycle());
  }, [getNextPairFromCycle]);

  // Screen shake effect after voting
  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  // Handle vote submission
  const handleVote = useCallback(
    async (winnerId) => {
      if (!songsPair || hasVoted || isVoting) return;

      const [songA, songB] = songsPair;
      const loserId = winnerId === songA.id ? songB.id : songA.id;

      setIsVoting(true);
      setVotedWinnerId(winnerId);

      try {
        const res = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ winnerId, loserId }),
        });

        if (res.ok) {
          const data = await res.json();
          setResults({
            winnerPercent: data.winnerPercent,
            loserPercent: data.loserPercent,
          });
        } else {
          throw new Error('Vote API failed');
        }
      } catch (err) {
        console.warn('Voting API connection error, using mock fallback:', err);
        // Fallback: generate mock percentages (random 30–70 split)
        const winnerPercent = Math.floor(Math.random() * 41) + 30; // 30–70
        setResults({
          winnerPercent,
          loserPercent: 100 - winnerPercent,
        });
      }

      setHasVoted(true);
      setIsVoting(false);
      triggerShake();
    },
    [songsPair, hasVoted, isVoting, triggerShake]
  );

  // Load a new battle
  const handleNextBattle = useCallback(() => {
    setHasVoted(false);
    setVotedWinnerId(null);
    setResults(null);
    setIsVoting(false);
    setSongsPair(getNextPairFromCycle());
  }, [getNextPairFromCycle]);

  // Loading state
  if (!songsPair) {
    return (
      <div className="battle-page">
        <div className="battle-page__loading">
          <span className="battle-page__loading-text">⚡ Loading Battle ⚡</span>
        </div>
      </div>
    );
  }

  const [songA, songB] = songsPair;

  // Derive per-card result info
  const getCardProps = (song) => {
    if (!hasVoted || !results) {
      return { isWinner: null, votePercent: null };
    }
    const isWinner = song.id === votedWinnerId;
    return {
      isWinner,
      votePercent: isWinner ? results.winnerPercent : results.loserPercent,
    };
  };

  // Build result data for VoteResult component
  const voteResultProps = hasVoted && results
    ? {
        songA: {
          title: songA.title,
          percent:
            songA.id === votedWinnerId
              ? results.winnerPercent
              : results.loserPercent,
        },
        songB: {
          title: songB.title,
          percent:
            songB.id === votedWinnerId
              ? results.winnerPercent
              : results.loserPercent,
        },
      }
    : null;

  return (
    <div className={`battle-page ${shaking ? 'battle-page--shake' : ''}`}>
      <div className="battle-page__arena">
        
        {/* Battle Arena Header */}
        <div className="battle-page__header">
          <h1 className="battle-page__title">THE ARENA</h1>
          <p className="battle-page__subtitle">Listen, feel the bass, and vote for the hardest track</p>
          <div className="battle-page__round">Round {roundNumber} of 5</div>
        </div>

        {/* Competitor Cards */}
        <div className="battle-page__cards">
          {/* Song A */}
          <SongCard
            song={songA}
            onVote={handleVote}
            disabled={hasVoted || isVoting}
            {...getCardProps(songA)}
          />

          {/* VS Badge */}
          <div className="battle-page__vs">
            <VSBadge />
          </div>

          {/* Song B */}
          <SongCard
            song={songB}
            onVote={handleVote}
            disabled={hasVoted || isVoting}
            {...getCardProps(songB)}
          />
        </div>

        {/* Vote results overlay */}
        {hasVoted && voteResultProps && (
          <VoteResult
            songA={voteResultProps.songA}
            songB={voteResultProps.songB}
            onNextBattle={handleNextBattle}
          />
        )}
      </div>
    </div>
  );
}
