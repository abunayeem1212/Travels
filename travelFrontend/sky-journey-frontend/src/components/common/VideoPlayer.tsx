import { useState } from 'react';
import { Play, X } from 'lucide-react';
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isYouTubeUrl,
  getYouTubeId
} from '../../utils/youtube';

interface Props {
  url: string;
  title: string;
  className?: string;
  showInline?: boolean;
}

export default function VideoPlayer(
  { url, title, className = '', showInline = false }: Props
) {
  const [playing, setPlaying] = useState(false);

  const isYT = isYouTubeUrl(url);
  const thumbnail = isYT ? getYouTubeThumbnail(url) : '';
  const embedUrl = isYT ? getYouTubeEmbedUrl(url) : url;

  if (showInline && playing) {
    return (
      <div className={`relative bg-black rounded-xl overflow-hidden
        ${className}`}>
        {isYT ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write;
              encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <video
            src={url}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        )}
        <button
          onClick={() => setPlaying(false)}
          className="absolute top-2 right-2 w-8 h-8 bg-black/60
            hover:bg-black text-white rounded-full flex items-center
            justify-center">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gray-900 rounded-xl overflow-hidden
        cursor-pointer group ${className}`}
      onClick={() => setPlaying(true)}
    >
      {/* Thumbnail */}
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105
            transition-transform duration-500"
          onError={e => {
            e.currentTarget.src =
              `https://img.youtube.com/vi/${getYouTubeId(url)}/hqdefault.jpg`;
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-700
          to-gray-900 flex items-center justify-center">
          <Play size={40} className="text-gray-500" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30
        group-hover:bg-black/50 transition-colors flex items-center
        justify-center">
        <div className="w-16 h-16 bg-red-600 hover:bg-red-700
          rounded-full flex items-center justify-center shadow-2xl
          transition transform group-hover:scale-110">
          <Play size={28} className="text-white ml-1" fill="white" />
        </div>
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t
        from-black/80 to-transparent p-3">
        <p className="text-white text-sm font-medium truncate">{title}</p>
      </div>
    </div>
  );
}