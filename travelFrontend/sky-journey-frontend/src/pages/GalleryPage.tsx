import { useEffect, useState, useCallback } from 'react';
import { X, Search, Grid3X3, Grid2X2, Play } from 'lucide-react';
import Layout from '../components/common/Layout';
import VideoModal from '../components/common/VideoModal';
import { GalleryItem } from '../types';
import { commonApi } from '../api/services';
import api from '../api/axios';
import { usePageTitle } from '../hooks/usePageTitle';
import { isYouTubeUrl, getYouTubeThumbnail } from '../utils/youtube';

export default function GalleryPage() {
  usePageTitle('Gallery');

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filtered, setFiltered] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [search, setSearch] = useState('');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [videoModal, setVideoModal] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState<'sm' | 'lg'>('sm');

  useEffect(() => {
    Promise.all([
      commonApi.getGallery(),
      api.get<string[]>('/gallery/categories'),
    ]).then(([galleryRes, catRes]) => {
      setItems(galleryRes.data);
      setFiltered(galleryRes.data);
      setCategories(['All', ...catRes.data]);
    }).finally(() => setLoading(false));
  }, []);

  // Filter logic
  const applyFilters = useCallback(() => {
    let result = items;

    if (activeCategory !== 'All')
      result = result.filter(i => i.category === activeCategory);

    if (activeType !== 'All')
      result = result.filter(i =>
        i.mediaType.toLowerCase() === activeType.toLowerCase());

    if (search.trim())
      result = result.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        (i.category || '').toLowerCase().includes(search.toLowerCase()));

    setFiltered(result);
  }, [items, activeCategory, activeType, search]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleItemClick = (item: GalleryItem) => {
    if (item.mediaType === 'Video') {
      setVideoModal(item);
    } else {
      setLightbox(item);
    }
  };

  // Lightbox navigation
  const photoItems = filtered.filter(i => i.mediaType !== 'Video');
  const lightboxIndex = lightbox
    ? photoItems.findIndex(i => i.id === lightbox.id)
    : -1;

const prevPhoto = useCallback(() => {
  if (lightboxIndex > 0) {
    setLightbox(photoItems[lightboxIndex - 1]);
  }
}, [lightboxIndex, photoItems]);

const nextPhoto = useCallback(() => {
  if (lightboxIndex < photoItems.length - 1) {
    setLightbox(photoItems[lightboxIndex + 1]);
  }
}, [lightboxIndex, photoItems]);

  // Keyboard navigation
  useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (lightbox) {
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') setLightbox(null);
    }
    if (videoModal && e.key === 'Escape') setVideoModal(null);
  };

  window.addEventListener('keydown', handleKey);

  return () => {
    window.removeEventListener('keydown', handleKey);
  };
}, [lightbox, videoModal, lightboxIndex, prevPhoto, nextPhoto]);

  const getImageSrc = (item: GalleryItem) => {
    if (item.mediaType === 'Video' && isYouTubeUrl(item.mediaUrl)) {
      return getYouTubeThumbnail(item.mediaUrl);
    }
    return item.mediaUrl;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900
        transition-colors">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500
          text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Photo & Video Gallery
            </h1>
            <p className="text-blue-100 text-lg max-w-xl mx-auto">
              Explore our collection of stunning travel memories
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Search + Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm
            p-4 mb-6 flex flex-wrap gap-3 items-center">

            {/* Search */}
            <div className="flex-1 min-w-48 relative">
              <Search size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2
                  text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search photos & videos..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200
                  dark:border-gray-700 bg-gray-50 dark:bg-gray-900
                  text-gray-800 dark:text-gray-200 rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grid Size Toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700
              rounded-xl p-1">
              <button
                onClick={() => setGridSize('sm')}
                className={`p-2 rounded-lg transition
                  ${gridSize === 'sm'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-400'}`}>
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridSize('lg')}
                className={`p-2 rounded-lg transition
                  ${gridSize === 'lg'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'text-gray-400'}`}>
                <Grid2X2 size={16} />
              </button>
            </div>

            {/* Stats */}
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {filtered.length} items
            </span>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {['All', 'Photo', 'Video'].map(type => (
              <button key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium
                  transition whitespace-nowrap border
                  ${activeType === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}>
                {type === 'Video' ? '🎬 Videos' :
                  type === 'Photo' ? '📷 Photos' : '🌐 All'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium
                  transition whitespace-nowrap border
                  ${activeCategory === cat
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700'
                  }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className={`grid gap-4 ${gridSize === 'sm'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}
                  className={`bg-gray-200 dark:bg-gray-700 rounded-xl
                    animate-pulse
                    ${gridSize === 'sm' ? 'h-44' : 'h-64'}`}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-gray-600
                dark:text-gray-400 mb-2">No items found</h2>
              <p className="text-gray-400 dark:text-gray-500">
                Try different filters or search terms
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setActiveType('All');
                  setSearch('');
                }}
                className="mt-4 text-blue-500 hover:underline text-sm">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 ${gridSize === 'sm'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {filtered.map(item => (
                <div
                  key={item.id}
                  className={`relative group cursor-pointer rounded-xl
                    overflow-hidden bg-gray-100 dark:bg-gray-800
                    ${gridSize === 'sm' ? 'h-44' : 'h-64'}`}
                  onClick={() => handleItemClick(item)}
                >
                  {/* Thumbnail */}
                  <img
                    src={getImageSrc(item)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110
                      transition-transform duration-500"
                    onError={e => {
                      e.currentTarget.src =
                        'data:image/svg+xml;base64,' + btoa(`
                          <svg width="400" height="300"
                            xmlns="http://www.w3.org/2000/svg">
                            <rect width="400" height="300" fill="#1e293b"/>
                            <text x="200" y="150" text-anchor="middle"
                              font-size="60" fill="#475569">🎬</text>
                          </svg>`);
                    }}
                  />

                  {/* Video Play Icon */}
                  {item.mediaType === 'Video' && (
                    <div className="absolute inset-0 flex items-center
                      justify-center">
                      <div className="w-12 h-12 bg-red-600/90
                        hover:bg-red-600 rounded-full flex items-center
                        justify-center shadow-xl transition
                        group-hover:scale-110">
                        <Play size={22} className="text-white ml-1"
                          fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0
                    group-hover:bg-black/30 transition-colors" />

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0
                    bg-gradient-to-t from-black/70 to-transparent
                    p-3 translate-y-2 group-hover:translate-y-0
                    transition-transform">
                    <p className="text-white text-sm font-medium truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.category && (
                        <span className="text-gray-300 text-xs">
                          {item.category}
                        </span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full
                        ${item.mediaType === 'Video'
                          ? 'bg-red-500/80 text-white'
                          : 'bg-blue-500/80 text-white'}`}>
                        {item.mediaType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">

          {/* Top Bar */}
          <div className="flex items-center justify-between p-4
            text-white shrink-0">
            <div>
              <p className="font-medium">{lightbox.title}</p>
              {lightbox.category && (
                <p className="text-gray-400 text-sm">{lightbox.category}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                {lightboxIndex + 1} / {photoItems.length}
              </span>
              <button onClick={() => setLightbox(null)}
                className="w-9 h-9 bg-white/20 hover:bg-white/40
                  rounded-full flex items-center justify-center transition">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center
            relative px-4 pb-4">
            <img
              src={lightbox.mediaUrl}
              alt={lightbox.title}
              className="max-h-full max-w-full object-contain rounded-xl"
            />

            {/* Prev/Next */}
            {lightboxIndex > 0 && (
              <button onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2
                  w-11 h-11 bg-white/20 hover:bg-white/40 text-white
                  rounded-full flex items-center justify-center
                  transition text-xl font-bold">
                ‹
              </button>
            )}
            {lightboxIndex < photoItems.length - 1 && (
              <button onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2
                  w-11 h-11 bg-white/20 hover:bg-white/40 text-white
                  rounded-full flex items-center justify-center
                  transition text-xl font-bold">
                ›
              </button>
            )}
          </div>

          {/* Thumbnail Strip */}
          {photoItems.length > 1 && (
            <div className="flex gap-2 justify-center p-4 overflow-x-auto
              shrink-0">
              {photoItems.map((item, i) => (
                <button key={item.id} onClick={() => setLightbox(item)}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden
                    transition ring-2
                    ${i === lightboxIndex
                      ? 'ring-blue-500 opacity-100'
                      : 'ring-transparent opacity-50 hover:opacity-80'}`}>
                  <img src={item.mediaUrl} alt=""
                    className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video Modal */}
      {videoModal && (
        <VideoModal
          url={videoModal.mediaUrl}
          title={videoModal.title}
          onClose={() => setVideoModal(null)}
        />
      )}
    </Layout>
  );
}