import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Star, Image } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Hotel } from '../../types';
import { hotelApi } from '../../api/services';
import toast from 'react-hot-toast';
import HotelImageUploadModal from
  '../../components/admin/HotelImageUploadModal';

const emptyForm = {
  name: '', location: '', starRating: 3,
  pricePerNight: 0, description: '', amenities: '', isActive: true
};

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadHotel, setUploadHotel] = useState<Hotel | null>(null);

  const load = () => {
    hotelApi.getAdminList()
      .then(res => setHotels(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (hotel: Hotel) => {
    setForm({
      name: hotel.name,
      location: hotel.location,
      starRating: hotel.starRating,
      pricePerNight: hotel.pricePerNight,
      description: (hotel as any).description || '',
      amenities: (hotel as any).amenities || '',
      isActive: true
    });
    setEditId(hotel.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.location || !form.pricePerNight) {
      toast.error('Name, location and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, pricePerNight: Number(form.pricePerNight) };
      if (editId) {
        await hotelApi.update(editId, payload);
        toast.success('Hotel updated!');
      } else {
        await hotelApi.create(payload);
        toast.success('Hotel created!');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Failed to save hotel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      await hotelApi.delete(id);
      toast.success('Hotel deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Hotels</h2>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 text-white
              px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <Plus size={16} /> Add Hotel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : hotels.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No hotels yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Location</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Stars</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Price/Night</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {hotels.map(hotel => (
                    <tr key={hotel.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {hotel.coverImage && (
                            <img src={hotel.coverImage} alt=""
                              className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <span className="font-medium text-gray-800">
                            {hotel.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {hotel.location}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex">
                          {Array.from({ length: hotel.starRating }).map(
                            (_, i) => (
                              <Star key={i} size={13}
                                className="fill-yellow-400 text-yellow-400" />
                            )
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        ৳{hotel.pricePerNight.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setUploadHotel(hotel)}
                            className="p-1.5 text-green-600 hover:bg-green-50
                              rounded-lg transition" title="Upload Images">
                            <Image size={15} />
                          </button>
                          <button onClick={() => openEdit(hotel)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50
                              rounded-lg transition">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(hotel.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50
                              rounded-lg transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center
          justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh]
            overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-800">
                {editId ? 'Edit Hotel' : 'Add Hotel'}
              </h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex
                  items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700
                  mb-1 block">Hotel Name *</label>
                <input value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500"
                  placeholder="Hotel Sunset" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Location *</label>
                  <input value={form.location}
                    onChange={e => setForm({
                      ...form, location: e.target.value
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500"
                    placeholder="Cox's Bazar" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Price/Night (৳) *</label>
                  <input type="number" value={form.pricePerNight}
                    onChange={e => setForm({
                      ...form, pricePerNight: +e.target.value
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700
                  mb-1 block">Star Rating</label>
                <select value={form.starRating}
                  onChange={e => setForm({
                    ...form, starRating: +e.target.value
                  })}
                  className="w-full border border-gray-200 rounded-lg px-3
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500">
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} Star</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700
                  mb-1 block">Description</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({
                    ...form, description: e.target.value
                  })}
                  className="w-full border border-gray-200 rounded-lg px-3
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500 resize-none"
                  placeholder="Hotel description..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700
                  mb-1 block">
                  Amenities
                  <span className="text-gray-400 font-normal ml-1">
                    (JSON: ["WiFi", "Pool"])
                  </span>
                </label>
                <input value={form.amenities}
                  onChange={e => setForm({
                    ...form, amenities: e.target.value
                  })}
                  className="w-full border border-gray-200 rounded-lg px-3
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500"
                  placeholder='["WiFi", "Pool", "AC", "Restaurant"]' />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600
                    py-2.5 rounded-lg hover:bg-gray-50 transition text-sm">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg
                    hover:bg-blue-700 transition text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Hotel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadHotel && (
        <HotelImageUploadModal
          hotelId={uploadHotel.id}
          hotelName={uploadHotel.name}
          onClose={() => { setUploadHotel(null); load(); }}
        />
      )}
    </AdminLayout>
  );
}