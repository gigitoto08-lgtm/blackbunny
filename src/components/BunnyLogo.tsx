const BunnyLogo = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="currentColor">
    {/* Right ear */}
    <path d="M120 10 C125 10 135 15 138 30 C142 50 140 70 130 90 C125 100 118 105 115 100 C110 90 112 70 115 50 C117 35 118 15 120 10 Z" />
    {/* Left ear */}
    <path d="M85 5 C80 5 68 12 65 30 C60 55 62 80 75 95 C80 102 88 100 90 95 C95 85 90 65 88 45 C86 30 86 10 85 5 Z" />
    {/* Head */}
    <path d="M65 95 C55 105 48 120 50 140 C52 155 60 165 70 170 C80 175 90 178 100 178 C110 178 125 175 135 168 C145 160 152 148 152 135 C152 120 145 105 135 95 C125 85 110 82 100 82 C88 82 75 85 65 95 Z" />
    {/* Eye */}
    <circle cx="90" cy="125" r="7" fill="black" />
    {/* Nose hint */}
    <ellipse cx="115" cy="145" rx="4" ry="3" fill="black" opacity="0.3" />
    {/* Bowtie left */}
    <path d="M75 178 L55 188 L58 200 L78 190 Z" />
    {/* Bowtie right */}
    <path d="M105 178 L125 188 L122 200 L102 190 Z" />
    {/* Bowtie center */}
    <path d="M78 190 L90 182 L102 190 L90 198 Z" />
  </svg>
);

export default BunnyLogo;
