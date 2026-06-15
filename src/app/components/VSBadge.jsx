'use client';

/**
 * VSBadge — A circular "VS" badge with glitch animation and pulsing glow.
 * The glitch effect uses pseudo-elements (via CSS) with clip-path and color offsets.
 */
export default function VSBadge() {
  return (
    <div className="vs-badge">
      <div className="vs-badge__circle" />
      <span className="vs-badge__text" data-text="VS">
        VS
      </span>
    </div>
  );
}
