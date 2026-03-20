import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Eye, ThumbsUp, ThumbsDown, Code, Share2 } from 'lucide-react';
import { useVideo, useVideos } from '@/hooks/useVideos';
import { useRecordView, useToggleLike, useToggleFavorite, useUserLikes } from '@/hooks/useVideoActions';
import { useAuth } from '@/contexts/AuthContext';
import VideoCard from '@/components/VideoCard';
import { Loader, Heart } from 'lucide-react';
import { toast } from 'sonner';

const formatNumber = (num: number | null) => Number(num || 0).toLocaleString();

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading } = useVideo(id || '');
  const { data: allVideos } = useVideos();
  const recordView = useRecordView();
  const toggleLike = useToggleLike();
  const toggleFavorite = useToggleFavorite();
  const { data: userLikes } = useUserLikes();
  const { user } = useAuth();
  const [likeHighlighted, setLikeHighlighted] = useState(false);

  useEffect(() => {
    if (video) {
      document.title = `${video.title} | BlackBunny`;
      window.scrollTo(0, 0);

      // Set meta tags
      const setMeta = (name: string, content: string) => {
        let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
        if (!el) {
          el = document.createElement('meta');
          if (name.startsWith('og:')) {
            el.setAttribute('property', name);
          } else {
            el.setAttribute('name', name);
          }
          document.head.appendChild(el);
        }
        el.content = content;
      };

      setMeta('description', video.description || '');
      setMeta('og:title', `${video.title} | BlackBunny`);
      setMeta('og:description', video.description || '');
      setMeta('og:type', 'video.other');

      // JSON-LD
      let script = document.getElementById('dynamic-seo') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'dynamic-seo';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: [video.thumbnail],
        uploadDate: video.created_at,
        contentUrl: `${window.location.origin}/video/${video.id}`,
      });
    }
  }, [video]);

  useEffect(() => {
    if (id) {
      recordView.mutate(id);
    }
  }, [id]);

  useEffect(() => {
    if (userLikes && id) {
      setLikeHighlighted(userLikes.includes(id));
    }
  }, [userLikes, id]);

  const handleLike = () => {
    if (!user) return;
    toggleLike.mutate(id || '');
  };

  const handleFavorite = () => {
    if (!user) return;
    toggleFavorite.mutate(id || '');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: video?.title || 'BlackBunny', url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleEmbed = async () => {
    const embedCode = `<iframe src="${window.location.href}" width="800" height="450" frameborder="0" allowfullscreen></iframe>`;
    await navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };

  if (isLoading || !video) {
    return (
      <div className="flex justify-center py-32">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const suggestedVideos = (allVideos || []).filter((v) => v.id !== id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 fade-in">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative shadow-2xl shadow-black">
          <div className="absolute inset-0 w-full h-full" dangerouslySetInnerHTML={{ __html: video.embed_code || '' }} />
        </div>

        <div className="flex flex-col gap-5 border-b border-white/10 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{video.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-400 font-medium">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {formatNumber(video.views)} views</span>
              <span>•</span>
              <span>{video.created_at?.split('T')[0]}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-secondary rounded-full border border-white/10 overflow-hidden shadow-inner">
                <button onClick={handleLike} className="flex items-center gap-2 hover:bg-white/10 px-5 py-2.5 text-sm font-bold transition-colors border-r border-white/10 hover:text-white" style={likeHighlighted ? { color: '#facc15' } : {}}>
                  <ThumbsUp className="w-4 h-4" /> {formatNumber(video.likes)}
                </button>
                <button className="flex items-center gap-2 hover:bg-white/10 px-4 py-2.5 text-sm font-bold transition-colors hover:text-white">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              {user && (
                <button onClick={handleFavorite} className="flex items-center gap-2 bg-secondary border border-white/10 hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-bold transition-colors hover:text-white shadow-sm">
                  <Heart className="w-4 h-4" /> Save
                </button>
              )}
              <button onClick={() => alert('Embed code copied to clipboard!')} className="flex items-center gap-2 bg-secondary border border-white/10 hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-bold transition-colors hover:text-white shadow-sm">
                <Code className="w-4 h-4" /> Embed
              </button>
              <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                <Share2 className="w-4 h-4 text-black" /> Share
              </button>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-extrabold text-xl shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {(video.channel || 'B').charAt(0)}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{video.channel}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">Verified Premium Studio</p>
            </div>
            <button className="ml-auto bg-transparent border border-white/20 text-white font-bold px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors text-sm">Subscribe</button>
          </div>
          <p className="mb-6 leading-relaxed text-gray-300">{video.description}</p>
          <div className="flex flex-wrap gap-2">
            {(video.pornstars || []).map((star) => (
              <span key={star} onClick={() => navigate(`/?q=${encodeURIComponent(star)}`)} className="text-white font-bold bg-white/10 px-3 py-1.5 rounded-md hover:bg-white hover:text-black cursor-pointer transition-colors text-sm">
                @{star}
              </span>
            ))}
            {(video.tags || []).map((tag) => (
              <span key={tag} onClick={() => navigate(`/?q=${encodeURIComponent(tag)}`)} className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-md text-sm font-medium text-gray-400 cursor-pointer hover:border-white/40 hover:text-white transition-all">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-xl font-extrabold text-white tracking-tight">Up Next</h3>
        <div className="flex flex-col gap-5">
          {suggestedVideos.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
