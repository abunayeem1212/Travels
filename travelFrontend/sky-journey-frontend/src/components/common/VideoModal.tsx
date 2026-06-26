import { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  getYouTubeEmbedUrl,
  isYouTubeUrl
} from '../../utils/youtube';

interface Props {
  url: string;
  title: string;
  onClose: () => void;
}

export default function VideoModal({ url, title, onClose }: Props) {
  // ESC key দিয়ে close করো
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isYT = isYouTubeUrl(url);
  const embedUrl = isYT ? getYouTubeEmbedUrl(url) : url;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center
        justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-medium truncate pr-4">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/20 hover:bg-white/40 text-white
              rounded-full flex items-center justify-center shrink-0
              transition">
            <X size={18} />
          </button>
        </div>

        {/* Video */}
        <div className="relative rounded-2xl overflow-hidden bg-black"
          style={{ paddingTop: '56.25%' }}>
          {isYT ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write;
                encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <video
              src={url}
              controls
              autoPlay
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}