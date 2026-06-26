import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Testimonial } from '../../types';
import { commonApi } from '../../api/services';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const emptyForm = {
  customerName: '', location: '', reviewText: '',
  rating: 5, isActive: true
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    commonApi.getTestimonials()
      .then(res => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: Testimonial) => {
    setForm({
      customerName: item.customerName,
      location: item.location || '',
      reviewText: item.reviewText,
      rating: item.rating,
      isActive: true
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.customerName || !form.reviewText) {
      toast.error('Name and review are required');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/testimonials/${editId}`, form);
        toast.success('Updated!');
      } else {
        await api.post('/testimonials', form);
        toast.success('Added!');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Testimonials</h2>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <Plus size={16} /> Add Review
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            No testimonials yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.customerName}</p>
                    {item.location && (
                      <p className="text-xs text-gray-400">{item.location}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex mb-2">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-500 text-sm line-clamp-2">{item.reviewText}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-800">{editId ? 'Edit Review' : 'Add Review'}</h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Customer Name *</label>
                  <input value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rahim Ahmed" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                  <input value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dhaka" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}
                      className="transition">
                      <Star size={24}
                        className={n <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Review *</label>
                <textarea rows={4} value={form.reviewText}
                  onChange={e => setForm({ ...form, reviewText: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Amazing experience..." />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
