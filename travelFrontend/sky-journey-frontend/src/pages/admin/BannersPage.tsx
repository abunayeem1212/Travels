import { useEffect, useState, useRef, type ChangeEvent } from 'react';
import { Plus, Trash2, Upload, X, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', subtitle: '', linkUrl: '', displayOrder: 0, isActive: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    api.get<Banner[]>('/banners/all')
      .then(res => setBanners(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCreate = async () => {
    if (!form.title || !file) {
      toast.error('Title and image are required');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('subtitle', form.subtitle);
      formData.append('linkUrl', form.linkUrl);
      formData.append('displayOrder', form.displayOrder.toString());
      formData.append('isActive', form.isActive.toString());
      formData.append('image', file);

      await api.post('/banners', formData);
      toast.success('Banner created!');
      setShowModal(false);
      setFile(null);
      setPreview('');
      setForm({ title: '', subtitle: '', linkUrl: '', displayOrder: 0, isActive: true });
      load();
    } catch {
      toast.error('Failed to create banner');
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await api.patch(`/banners/${id}/toggle`);
      load();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Banners / Sliders</h2>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <Plus size={16} /> Add Banner
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            No banners yet.
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map(banner => (
              <div key={banner.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex items-center gap-4 p-3">
                <img src={banner.imageUrl} alt={banner.title}
                  className="w-24 h-16 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{banner.title}</p>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-400 truncate">{banner.subtitle}</p>
                  )}
                  <p className="text-xs text-gray-400">Order: {banner.displayOrder}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggle(banner.id)}
                    className={`p-1.5 rounded-lg transition ${banner.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-50'}`}>
                    {banner.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => handleDelete(banner.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-800">Add Banner</h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                <input value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explore Cox's Bazar" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subtitle</label>
                <input value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Journey, Our Responsibility" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Link URL</label>
                  <input value={form.linkUrl}
                    onChange={e => setForm({ ...form, linkUrl: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/#packages" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Display Order</label>
                  <input type="number" value={form.displayOrder}
                    onChange={e => setForm({ ...form, displayOrder: +e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Banner Image *</label>
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden h-32">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => { setFile(null); setPreview(''); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => inputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition">
                    <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Click to select (1920x600 recommended)</p>
                  </div>
                )}
                <input ref={inputRef} type="file" accept="image/*"
                  className="hidden" onChange={handleFileSelect} />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm">Cancel</button>
                <button onClick={handleCreate} disabled={uploading}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {uploading ? 'Uploading...' : 'Create Banner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
