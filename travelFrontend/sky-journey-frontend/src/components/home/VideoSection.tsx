import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from '../common/VideoModal';
import { GalleryItem } from '../../types';
import { commonApi } from '../../api/services';
import {
  getYouTubeThumbnail,
  isYouTubeUrl
} from '../../utils/youtube';

export default function VideoSection() {
  const [videos, setVideos] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    commonApi.getGallery(undefined, 'video')
      .then(res => setVideos(res.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  if (videos.length === 0) return null;

  const getThumbnail = (item: GalleryItem) => {
    if (isYouTubeUrl(item.mediaUrl)) {
      return getYouTubeThumbnail(item.mediaUrl);
    }
    return '';
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Tour Videos
          </h2>
          <p className="text-gray-400">
            Watch our latest tour highlights and travel stories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
          gap-5">
          {videos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => setSelected(video)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer
                group
                ${index === 0
                  ? 'md:col-span-2 md:row-span-2 h-64 md:h-auto'
                  : 'h-48'}`}
            >
              {/* Thumbnail */}
              {getThumbnail(video) ? (
                <img
                  src={getThumbnail(video)}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105
                    transition-transform duration-500"
                  onError={e => {
                    e.currentTarget.parentElement!.style.background =
                      'linear-gradient(135deg, #1e3a5f, #2d6a4f)';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br
                  from-blue-900 to-gray-900" />
              )}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40
                group-hover:bg-black/50 transition-colors" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center
                justify-center">
                <div className={`bg-red-600 rounded-full flex items-center
                  justify-center shadow-2xl transition
                  group-hover:scale-110 group-hover:bg-red-700
                  ${index === 0 ? 'w-20 h-20' : 'w-14 h-14'}`}>
                  <Play
                    className={`text-white ml-1
                      ${index === 0 ? 'w-8 h-8' : 'w-6 h-6'}`}
                    fill="white"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4
                bg-gradient-to-t from-black/80 to-transparent">
                <p className={`text-white font-semibold
                  ${index === 0 ? 'text-xl' : 'text-sm'}`}>
                  {video.title}
                </p>
                {video.category && (
                  <span className="text-gray-300 text-xs mt-1 block">
                    {video.category}
                  </span>
                )}
              </div>

              {/* Duration badge */}
              <div className="absolute top-3 right-3 bg-black/60
                text-white text-xs px-2 py-1 rounded-lg flex items-center
                gap-1">
                <Play size={10} fill="white" /> Video
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <a href="/gallery?type=Video"
            className="inline-flex items-center gap-2 border border-gray-600
              text-gray-300 hover:border-white hover:text-white px-6 py-3
              rounded-xl transition">
            <Play size={16} /> View All Videos
          </a>
        </div>
      </div>

      {selected && (
        <VideoModal
          url={selected.mediaUrl}
          title={selected.title}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}