'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import AudioVisualizer from './AudioVisualizer';

/*
  📚 HOW REFS WORK:
  
  useRef() creates a "reference" — a way to grab the actual DOM element.
  We need this for the <audio> tag because we need to call .play(), 
  .pause(), and read .currentTime directly on it.
  
  React normally controls the DOM for you, but audio playback requires 
  direct DOM access. That's what refs are for.
*/

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SongCard({ song, onVote, disabled, isWinner, votePercent }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Attach audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleDurationChange = () => setDuration(audio.duration);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
    };
  }, []);

  // Pause and reset when song changes (new battle round)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [song.id]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback failed:', err);
      }
    }
  }, [isPlaying]);

  const handleProgressClick = useCallback((e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = ratio * duration;
  }, [duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Build card CSS classes
  let cardClass = 'song-card';
  if (isWinner === true) cardClass += ' song-card--winner';
  if (isWinner === false) cardClass += ' song-card--loser';
  if (disabled) cardClass += ' song-card--disabled';

  return (
    <div className={cardClass}>
      {/* Cover image */}
      <div className="song-card__image-wrap">
        <img
          className="song-card__image"
          src={song.imageSrc}
          alt={song.title}
          loading="lazy"
        />
        <div className="song-card__overlay" />
      </div>

      {/* Card content */}
      <div className="song-card__content">
        <h2 className="song-card__title">{song.title}</h2>
        <p className="song-card__artist">{song.artist}</p>

        {/* Audio player controls */}
        <div className="song-card__player">
          <button
            className={`song-card__play-btn ${isPlaying ? 'song-card__play-btn--playing' : ''}`}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="7,4 21,12 7,20" />
              </svg>
            )}
          </button>

          {/* Progress bar */}
          <div
            className="song-card__progress-wrap"
            ref={progressRef}
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="song-card__progress"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time display */}
          <div className="song-card__time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Audio visualizer */}
        <div className="song-card__visualizer">
          <AudioVisualizer
            audioRef={audioRef}
            isPlaying={isPlaying}
            color={song.coverColor}
          />
        </div>

        {/* Vote button OR result display */}
        {votePercent !== null && votePercent !== undefined ? (
          <div className="song-card__result">
            <div className="song-card__result-percent">
              {Math.round(votePercent)}%
            </div>
            <div className="song-card__result-label">
              {isWinner ? '🔥 WINNER' : 'DEFEATED'}
            </div>
          </div>
        ) : (
          <button
            className="song-card__vote-btn"
            onClick={() => onVote && onVote(song.id)}
            disabled={disabled}
          >
            <span>🔥 VOTE</span>
          </button>
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={song.audioSrc} preload="metadata" />
    </div>
  );
}