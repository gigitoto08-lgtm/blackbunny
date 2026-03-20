import { useState, useEffect } from 'react';
import BunnyLogo from './BunnyLogo';

const AgeGate = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('blackbunny_18_verified')) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const accept = () => {
    localStorage.setItem('blackbunny_18_verified', 'true');
    setVisible(false);
    document.body.style.overflow = 'auto';
  };

  const decline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center">
      <div className="glass-panel p-8 md:p-12 rounded-2xl max-w-lg w-[90%] text-center fade-in">
        <div className="flex justify-center mb-6">
          <BunnyLogo className="w-24 h-24 text-white drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">WARNING: 18+ ONLY</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          This website contains explicit adult material. By entering, you confirm that you are at least 18 years of age (or the legal age of majority in your jurisdiction), and you consent to viewing sexually explicit content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={accept} className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto">
            I am 18 or older - Enter
          </button>
          <button onClick={decline} className="bg-transparent border border-white/20 text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto">
            Leave Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
