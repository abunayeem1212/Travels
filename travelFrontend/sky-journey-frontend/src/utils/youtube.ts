// YouTube URL থেকে video ID বের করো
export const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// YouTube thumbnail পাও
export const getYouTubeThumbnail = (url: string): string => {
  const id = getYouTubeId(url);
  if (!id) return '';
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};

// YouTube embed URL তৈরি করো
export const getYouTubeEmbedUrl = (url: string): string => {
  const id = getYouTubeId(url);
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
};

// Cloudinary video check
export const isCloudinaryVideo = (url: string): boolean => {
  return url.includes('cloudinary.com');
};

// YouTube URL check
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};