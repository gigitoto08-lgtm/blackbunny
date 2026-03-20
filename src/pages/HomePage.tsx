import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback, useState } from 'react';
import { Loader } from 'lucide-react';
import { useVideos, Video } from '@/hooks/useVideos';
import VideoCard from '@/components/VideoCard';

const categories = ['All', 'Swallow', 'Deepthroat', 'Facial', 'POV', 'Creampie', 'Amateur'];

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  const { data: videos, isLoading } = useVideos(searchQuery || undefined);
  const [displayVideos, setDisplayVideos] = useState<Video[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'BlackBunny | Premium HD Streaming';
    window.scrollTo(0, 0);
  }, [searchQuery]);

  useEffect(() => {
    if (videos) {
      setDisplayVideos([...videos, ...videos]);
    }
  }, [videos]);

  const loadMore = useCallback(() => {
    if (videos && videos.length > 0) {
      const shuffled = [...videos].sort(() => 0.5 - Math.random()).slice(0, 5);
      setDisplayVideos((prev) => [...prev, ...shuffled]);
    }
  }, [videos]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(loadMore, 600);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      navigate('/');
    } else {
      navigate(`/?q=${encodeURIComponent(cat)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center text-gray-400 py-32 text-xl font-medium">
        No videos found for "{searchQuery}".
        <br />
        <button onClick={() => navigate('/')} className="mt-4 text-white underline">Clear Search</button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar">
        {categories.map((f) => (
          <button
            key={f}
            onClick={() => handleCategoryClick(f)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
              (searchQuery || 'All').toLowerCase() === f.toLowerCase()
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-secondary text-gray-400 border-white/10 hover:border-white/40 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
        {displayVideos.map((v, i) => (
          <VideoCard key={`${v.id}-${i}`} video={v} index={i} />
        ))}
      </div>

      <div ref={anchorRef} className="w-full flex justify-center py-16">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    </div>
  );
};

export default HomePage;
