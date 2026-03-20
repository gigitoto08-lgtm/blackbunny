import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUserFavorites, useWatchHistory } from '@/hooks/useVideoActions';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import VideoCard from '@/components/VideoCard';
import { Loader, User, Heart, Clock } from 'lucide-react';
import type { Video } from '@/hooks/useVideos';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: favorites, isLoading: favsLoading } = useUserFavorites();
  const { data: history, isLoading: histLoading } = useWatchHistory();

  useEffect(() => {
    document.title = 'My Profile | BlackBunny';
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const favoriteVideos = (favorites || []).map((f: any) => f.videos).filter(Boolean) as Video[];
  const historyVideos = (history || []).map((h: any) => h.videos).filter(Boolean) as Video[];

  return (
    <div className="fade-in flex flex-col gap-10">
      {/* Profile Header */}
      <div className="glass-panel p-8 rounded-2xl flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center font-extrabold text-3xl shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-10 h-10" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{profile.username || 'User'}</h1>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          <p className="text-gray-500 text-xs mt-1">Member since {profile.created_at?.split('T')[0]}</p>
        </div>
      </div>

      {/* Favorites */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5" /> Favorites
        </h2>
        {favsLoading ? (
          <Loader className="w-6 h-6 text-white animate-spin" />
        ) : favoriteVideos.length === 0 ? (
          <p className="text-gray-500">No favorites yet. Save videos you love!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
            {favoriteVideos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Watch History */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5" /> Watch History
        </h2>
        {histLoading ? (
          <Loader className="w-6 h-6 text-white animate-spin" />
        ) : historyVideos.length === 0 ? (
          <p className="text-gray-500">No watch history yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
            {historyVideos.map((v, i) => (
              <VideoCard key={`${v.id}-${i}`} video={v} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
