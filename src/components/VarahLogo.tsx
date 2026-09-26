import React from 'react';

export const VarahLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  darkText?: boolean;
  showTagline?: boolean;
}> = ({ size = 'md', darkText = false, showTagline = false }) => {
  const dimensions =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
  const titleSize =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  const subSize =
    size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className="inline-flex flex-col items-center select-none">
      {/* V-Eye Shield Emblem */}
      <svg
        viewBox="0 0 120 105"
        className={dimensions}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="varahBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="varahDarkWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        {/* Left Wing of V */}
        <path
          d="M12 12 H42 L60 58 L46 86 L12 12 Z"
          fill="url(#varahBlueGrad)"
        />
        {/* Right Wing of V */}
        <path
          d="M108 12 H78 L46 86 L60 98 L108 12 Z"
          fill="url(#varahDarkWing)"
        />
        {/* Center Cyber Eye Arc */}
        <path
          d="M32 42 Q60 22 88 42 Q60 62 32 42 Z"
          fill="#FFFFFF"
          stroke="#0284C7"
          strokeWidth="3"
        />
        {/* Outer Iris */}
        <circle cx="60" cy="42" r="11" fill="#0284C7" />
        {/* Inner Pupil */}
        <circle cx="60" cy="42" r="5.5" fill="#091E3A" />
        {/* Lens Glint */}
        <circle cx="56.5" cy="39" r="2.2" fill="#FFFFFF" />
      </svg>

      <div className="text-center leading-none mt-1">
        <div
          className={`font-extrabold tracking-wider ${titleSize} ${
            darkText ? 'text-[#091E3A]' : 'text-white'
          }`}
        >
          VARAH
        </div>
        <div
          className={`font-bold tracking-widest text-[#1DA1F2] ${subSize} mt-0.5`}
        >
          MANAGEMENT
        </div>
        {showTagline && (
          <div
            className={`text-[10px] mt-1 ${
              darkText ? 'text-slate-500' : 'text-blue-200'
            }`}
          >
            Smart Management for a Safer Tomorrow
          </div>
        )}
      </div>
    </div>
  );
};

export const SplashCctvIllustration: React.FC = () => (
  <svg
    viewBox="0 0 260 150"
    className="w-44 h-28 drop-shadow-2xl"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wall Mount Plate */}
    <rect x="218" y="62" width="24" height="58" rx="6" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
    {/* Arm Bracket */}
    <path
      d="M218 90 L165 90 L150 72"
      stroke="#94A3B8"
      strokeWidth="12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="165" cy="90" r="8" fill="#334155" />
    {/* Bullet Camera Body (Angled Left) */}
    <g transform="rotate(-12 120 58)">
      {/* Main Housing */}
      <rect x="42" y="34" width="128" height="48" rx="14" fill="#F8FAFC" stroke="#64748B" strokeWidth="2.5" />
      {/* Top Sunshield Hood */}
      <path d="M32 34 H172 L162 24 H46 L32 34 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
      {/* Front Dark Lens Bezel */}
      <ellipse cx="44" cy="58" rx="14" ry="24" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
      {/* Camera Glass Lens */}
      <ellipse cx="44" cy="58" rx="8" ry="14" fill="#1E3A8A" />
      <circle cx="42" cy="54" r="3" fill="#38BDF8" />
      {/* IR LED Ring Dots */}
      <circle cx="44" cy="40" r="1.8" fill="#EF4444" />
      <circle cx="44" cy="76" r="1.8" fill="#EF4444" />
      {/* Side Branding Stripe */}
      <rect x="76" y="52" width="62" height="5" rx="2.5" fill="#0284C7" />
    </g>
  </svg>
);
