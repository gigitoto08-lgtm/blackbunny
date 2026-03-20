import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import BunnyLogo from './BunnyLogo';
import AuthModal from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/');
    }
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass-panel border-b-0 border-white/10 shadow-lg shadow-black/50">
        <div className="max-w-screen-2xl mx-auto px-4 h-20 flex items-center justify-between">
          <a onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-black p-2 rounded-full text-white group-hover:bg-[#111] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <BunnyLogo />
            </div>
            <span className="text-2xl font-extrabold tracking-tight uppercase">
              <span className="text-[#555] drop-shadow-[0_1px_1px_rgba(255,255,255,0.1)]">BLACK</span>
              <span className="text-white">BUNNY</span>
            </span>
          </a>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8 relative group">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search swallow, facial, deepthroat..."
              className="w-full bg-secondary border border-white/10 rounded-full py-3 pl-6 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-black transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-2 top-1.5 p-2 bg-white/5 rounded-full hover:bg-white hover:text-black transition-colors text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button onClick={() => navigate('/profile')} className="hidden sm:flex items-center gap-2 hover:text-white text-gray-400 font-medium px-4 transition-colors">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button onClick={signOut} className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openAuth('login')} className="hidden sm:block hover:text-white text-gray-400 font-medium px-4 transition-colors">Log In</button>
                <button onClick={() => openAuth('register')} className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  <User className="w-4 h-4" /> Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </>
  );
};

export default Navbar;
