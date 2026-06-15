'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * AudioVisualizer — draws animated frequency bars on a canvas,
 * driven by the Web Audio API AnalyserNode connected to an <audio> element.
 *
 * IMPORTANT: We store the AudioContext and MediaElementSource on the audio
 * element itself (`el.__audioCtx`, `el.__audioSrc`) so that re-renders
 * and React strict-mode double-mounts don't try to create duplicate
 * contexts (which the Web Audio API forbids).
 */
export default function AudioVisualizer({ audioRef, isPlaying, color = '#bf5af2' }) {
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const idlePhaseRef = useRef(0);

  // Parse hex color into RGB for per-bar opacity manipulation
  const parseColor = useCallback((hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  // Connect (or reuse) the Web Audio API graph
  const ensureAnalyser = useCallback(() => {
    const el = audioRef?.current;
    if (!el) return null;

    // Reuse existing context stored on the element
    if (el.__audioCtx && el.__audioSrc) {
      analyserRef.current = el.__analyser;
      return el.__analyser;
    }

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaElementSource(el);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128; // gives us 64 frequency bins
      analyser.smoothingTimeConstant = 0.8;

      source.connect(analyser);
      analyser.connect(ctx.destination);

      // Persist on the element to prevent duplicate creation
      el.__audioCtx = ctx;
      el.__audioSrc = source;
      el.__analyser = analyser;

      analyserRef.current = analyser;
      return analyser;
    } catch (err) {
      // If the element was already connected to another context, try to
      // recover by just grabbing the existing analyser.
      console.warn('AudioVisualizer: could not create audio graph', err);
      if (el.__analyser) {
        analyserRef.current = el.__analyser;
        return el.__analyser;
      }
      return null;
    }
  }, [audioRef]);

  // Main draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const BAR_COUNT = 32;
    const { r, g, b } = parseColor(color);

    let analyser = analyserRef.current;

    const draw = () => {
      // Ensure canvas size matches layout
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / BAR_COUNT - 2;
      const gap = 2;

      if (isPlaying && analyser) {
        // Resume AudioContext if suspended (browsers require user gesture)
        const audioCtx = audioRef?.current?.__audioCtx;
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < BAR_COUNT; i++) {
          // Map bar index to analyser bin (we have 64 bins, pick spread)
          const dataIndex = Math.floor((i / BAR_COUNT) * bufferLength);
          const value = dataArray[dataIndex] / 255;
          const barHeight = Math.max(value * height, 2);
          const opacity = 0.4 + value * 0.6;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          const x = i * (barWidth + gap);
          const y = height - barHeight;

          // Rounded top
          ctx.beginPath();
          const radius = Math.min(barWidth / 2, 3);
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + barWidth - radius, y);
          ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
          ctx.lineTo(x + barWidth, height);
          ctx.lineTo(x, height);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.fill();
        }
      } else {
        // Idle animation — gentle pulsing bars
        idlePhaseRef.current += 0.02;
        for (let i = 0; i < BAR_COUNT; i++) {
          const wave = Math.sin(idlePhaseRef.current + i * 0.3) * 0.5 + 0.5;
          const barHeight = 4 + wave * 12;
          const opacity = 0.15 + wave * 0.2;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          const x = i * (barWidth + gap);
          const y = height - barHeight;
          ctx.beginPath();
          const radius = Math.min(barWidth / 2, 3);
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + barWidth - radius, y);
          ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
          ctx.lineTo(x + barWidth, height);
          ctx.lineTo(x, height);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    // Try to connect analyser when playing starts
    if (isPlaying && !analyser) {
      analyser = ensureAnalyser();
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, color, parseColor, ensureAnalyser, audioRef]);

  return (
    <canvas
      ref={canvasRef}
      className="audio-visualizer"
      style={{
        width: '100%',
        height: '80px',
        display: 'block',
      }}
    />
  );
}
