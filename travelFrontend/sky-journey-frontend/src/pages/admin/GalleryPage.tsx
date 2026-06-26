import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Plus, Trash2, Upload, X, Play } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { GalleryItem } from '../../types';
import { commonApi } from '../../api/services';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { isYouTubeUrl, getYouTubeThumbnail } from '../../utils/youtube';



export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', category: '', mediaType: 0, displayOrder: 0, isActive: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    commonApi.getGallery()
      .then(res => setItems(res.data))
      .finally(() => setLoading(false));
  };

  const getImageSrc = (item: GalleryItem) => {
    if (item.mediaType === 'Video' && isYouTubeUrl(item.mediaUrl)) {
      return getYouTubeThumbnail(item.mediaUrl);
    }
    return item.mediaUrl;
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!form.title || (form.mediaType === 0 && !file) || (form.mediaType === 1 && !file && !videoUrl)) {
      toast.error('Title and file or video URL are required');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('mediaType', form.mediaType.toString());
      formData.append('displayOrder', form.displayOrder.toString());
      formData.append('isActive', form.isActive.toString());

      if (file) formData.append('file', file);
      if (form.mediaType === 1 && videoUrl) formData.append('videoUrl', videoUrl);

      await api.post('/gallery', formData);

      toast.success('Media uploaded!');
      setShowModal(false);
      setFile(null);
      setPreview('');
      setVideoUrl('');
      setForm({ title: '', category: '', mediaType: 0, displayOrder: 0, isActive: true });

      load();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Gallery</h2>

          <button
            onClick={() => {
              setShowModal(true);
              setFile(null);
              setPreview('');
              setVideoUrl('');
              setForm({ title: '', category: '', mediaType: 0, displayOrder: 0, isActive: true });
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} /> Add Media
          </button>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            No gallery items yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden h-36 bg-gray-100">
                <img src={getImageSrc(item)} alt={item.title} className="w-full h-full object-cover" />

                {item.mediaType === 'Video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/60 text-white flex items-center justify-center shadow-xl">
                      <Play size={18} />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                  <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-xs font-medium truncate">{item.title}</p>
                    {item.category && <p className="text-gray-300 text-xs">{item.category}</p>}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FIXED */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          
          {/* MAIN MODAL BOX */}
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
              <h3 className="font-bold text-gray-800">Add Gallery Item</h3>

              <button
                onClick={() => {
                  setShowModal(false);
                  setFile(null);
                  setPreview('');
                  setVideoUrl('');
                }}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY (SCROLLABLE) */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">

              {/* TITLE */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cox's Bazar Beach"
                />
              </div>

              {/* CATEGORY + TYPE */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <input
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                  <select
                    value={form.mediaType}
                    onChange={e => {
                      const mediaType = +e.target.value;
                      setForm({ ...form, mediaType });
                      if (mediaType === 0) setVideoUrl('');
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                  >
                    <option value={0}>Photo</option>
                    <option value={1}>Video</option>
                  </select>
                </div>
              </div>

              {/* VIDEO */}
              {form.mediaType === 1 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    YouTube URL
                  </label> 


                  
                  <input
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />

                  {videoUrl && isYouTubeUrl(videoUrl) && (
  <div className="mt-2 rounded-xl overflow-hidden h-32">
    <img
      src={getYouTubeThumbnail(videoUrl)}
      alt="YouTube Video Thumbnail"
      className="w-full h-full object-cover"
    />
  </div>
)}
                </div>
              )}

              {/* IMAGE */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Image *</label>

                {preview ? (
                  <div className="relative rounded-xl overflow-hidden h-40">
<img
  src={preview}
  alt="Preview"
  className="w-full h-full object-cover"
/>                    <button
                      onClick={() => { setFile(null); setPreview(''); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer"
                  >
                    <Upload size={24} className="mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Click to select</p>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>


            {/* FOOTER (FIXED BUTTON AREA) */}
            <div className="p-5 border-t flex gap-3 flex-shrink-0 bg-white">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Upload
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}