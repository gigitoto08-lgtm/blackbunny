import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { Video } from '@/hooks/useVideos';

const formatNumber = (num: number | null) => Number(num || 0).toLocaleString();

const VideoCard = ({ video, index = 0 }: { video: Video; index?: number }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/video/${video.id}`)}
      className="group flex flex-col gap-3 cursor-pointer fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden border border-white/5 transition-all duration-300 premium-hover">
        <img
          src={video.thumbnail || ''}
          alt={video.title}
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white/20 p-4 rounded-full backdrop-blur-md shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-white ml-1 fill-current" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2.5 py-1 rounded-md font-bold tracking-wide shadow-md">
          {video.duration}
        </span>
      </div>
      <div className="px-1">
        <h3 className="text-sm font-bold text-gray-200 line-clamp-2 group-hover:text-white transition-colors">{video.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2 font-medium">
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{video.channel}</span>
          <div className="flex items-center gap-1.5">
            <span>{formatNumber(video.views)} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
