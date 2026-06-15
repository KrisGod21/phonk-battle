"use client";

/*
  📚 HOW CLIENT COMPONENTS WORK:
  
  "use client" at the top tells Next.js: "This component runs in 
  the browser, not on the server."
  
  We need this because:
  - The particles use useEffect (runs after the page loads in the browser)
  - We generate random positions using Math.random()
  - The canvas/DOM manipulation needs browser APIs
  
  Server Components can't do these things because they run before 
  the page even reaches the browser.
*/

import { useEffect, useState } from "react";

export default function ParticlesBg() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles on mount
    const generated = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 15,
      color:
        i % 3 === 0
          ? "var(--clr-primary)"
          : i % 3 === 1
          ? "var(--clr-accent)"
          : "var(--clr-red)",
    }));
    setParticles(generated);
  }, []);

  return (
    <>
      <div className="particles-bg">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        ))}
      </div>
      {/* Large blurred gradient orbs for ambient lighting */}
      <div className="ambient-orb ambient-orb--purple" />
      <div className="ambient-orb ambient-orb--pink" />
    </>
  );
}
