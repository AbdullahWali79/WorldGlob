import React from 'react';

const stars = Array.from({ length: 80 }, (_, index) => ({
  id: index,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 8
}));

export default function SpaceBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.22),transparent_20%),radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.12),transparent_18%),radial-gradient(circle_at_80%_15%,rgba(34,211,238,0.09),transparent_18%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.72),rgba(2,6,23,0.94),rgba(1,3,13,0.99))]" />
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white/70 blur-[0.2px] animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            opacity: 0.2 + Math.random() * 0.7
          }}
        />
      ))}
      <div className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-cyan-400/8 blur-3xl animate-drift" />
      <div className="absolute right-1/4 top-[18%] h-72 w-72 rounded-full bg-emerald-400/8 blur-3xl animate-floatSlow" />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-drift" />
      <div className="absolute bottom-8 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-floatSlow" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,rgba(59,130,246,0.06),rgba(2,6,23,0.14))]" />
    </div>
  );
}
