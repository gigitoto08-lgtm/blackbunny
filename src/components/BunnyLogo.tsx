const BunnyLogo = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M 45 35 C 65 5 80 5 65 25 C 58 40 52 45 48 50 Z" />
    <path d="M 40 40 C 20 15 25 0 40 20 C 48 30 45 40 43 45 Z" />
    <path d="M 48 50 C 65 50 70 65 65 80 C 60 95 45 90 35 85 C 25 80 20 70 25 55 C 30 45 40 50 48 50 Z" />
    <circle cx="45" cy="60" r="4" fill="black" />
    <path d="M 35 85 L 25 90 L 30 100 Z M 55 85 L 65 90 L 60 100 Z M 45 95 L 35 85 L 55 85 Z" />
  </svg>
);

export default BunnyLogo;
