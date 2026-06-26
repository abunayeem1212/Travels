import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Image } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Package } from '../../types';
import { packageApi } from '../../api/services';
import toast from 'react-hot-toast';
import ImageUploadModal from '../../components/admin/ImageUploadModal';

const emptyForm = {
  title: '', description: '', price: 0, discountPrice: '',
  duration: '', location: '', includes: '', itinerary: '',
  isPopular: false, isActive: true
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

const [includesList, setIncludesList] = useState('');


  const [uploadPkg, setUploadPkg] = useState<Package | null>(null);

  const load = () => {
    packageApi.getAdminList()
      .then(res => setPackages(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
  setForm(emptyForm);
  setIncludesList('');
  setEditId(null);
  setShowModal(true);
};

  const openEdit = (pkg: Package) => {
  let includesText = '';

  try {
    const parsed = JSON.parse((pkg as any).includes || '[]');

    includesText = Array.isArray(parsed)
      ? parsed.join(', ')
      : '';
  } catch {
    includesText = (pkg as any).includes || '';
  }

  // Includes input এ value show করবে
  setIncludesList(includesText);

  setForm({
    title: pkg.title,
    description: (pkg as any).description || '',
    price: pkg.price,
    discountPrice: pkg.discountPrice?.toString() || '',
    duration: pkg.duration,
    location: pkg.location,
    includes: includesText,
    itinerary: (pkg as any).itinerary || '',
    isPopular: pkg.isPopular,
    isActive: true
  });

  setEditId(pkg.id);
  setShowModal(true);
};

  const handleSave = async () => {
    if (!form.title || !form.price || !form.location) {
      toast.error('Title, price and location are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
  ...form,
  price: Number(form.price),
  discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
  // Comma separated text কে JSON array তে convert করো
  includes: includesList
    ? JSON.stringify(
        includesList.split(',').map(s => s.trim()).filter(Boolean)
      )
    : null,
};
      if (editId) {
        await packageApi.update(editId, payload);
        toast.success('Package updated!');
      } else {
        await packageApi.create(payload);
        toast.success('Package created!');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await packageApi.delete(id);
      toast.success('Package deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Tour Packages</h2>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 text-white
              px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <Plus size={16} /> Add Package
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : packages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No packages yet. Add your first package!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Title</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Location</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Price</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Duration</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Popular</th>
                    <th className="text-left px-4 py-3 text-gray-600
                      font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {packages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {pkg.coverImage && (
                            <img src={pkg.coverImage} alt=""
                              className="w-10 h-10 rounded-lg object-cover" />
                          )}
                          <span className="font-medium text-gray-800">
                            {pkg.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {pkg.location}
                      </td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        ৳{pkg.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {pkg.duration}
                      </td>
                      <td className="px-4 py-3">
                        {pkg.isPopular ? (
                          <span className="bg-orange-100 text-orange-600
                            text-xs px-2 py-1 rounded-full">Popular</span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
  <div className="flex items-center gap-2">
    <button onClick={() => setUploadPkg(pkg)}
      className="p-1.5 text-green-600 hover:bg-green-50
        rounded-lg transition" title="Upload Images">
      <Image size={15} />
    </button>
    <button onClick={() => openEdit(pkg)}
      className="p-1.5 text-blue-600 hover:bg-blue-50
        rounded-lg transition">
      <Pencil size={15} />
    </button>
    <button onClick={() => handleDelete(pkg.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center
          justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh]
            overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-800">
                {editId ? 'Edit Package' : 'Add Package'}
              </h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex
                  items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500"
                    placeholder="Cox's Bazar 3 Days Tour"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Price (৳) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: +e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Discount Price (৳)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={e => setForm({
                      ...form, discountPrice: e.target.value
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Duration *</label>
                  <input
                    value={form.duration}
                    onChange={e => setForm({
                      ...form, duration: e.target.value
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500"
                    placeholder="3 Days 2 Nights"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Location *</label>
                  <input
                    value={form.location}
                    onChange={e => setForm({
                      ...form, location: e.target.value
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500"
                    placeholder="Cox's Bazar"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700
                    mb-1 block">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({
                      ...form, description: e.target.value
                    })}
                    className="w-full border border-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500 resize-none"
                    placeholder="Package description..."
                  />
                </div>

                                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Includes
                            <span className="text-gray-400 font-normal ml-1">
                              (comma separated: Hotel, Breakfast, Transport)
                            </span>
                          </label>
                          <input
                            value={includesList}
                            onChange={e => setIncludesList(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3
                              py-2.5 text-sm focus:outline-none focus:ring-2
                              focus:ring-blue-500"
                            placeholder="Hotel, Breakfast, Transport, Guide"
                          />
                        </div>

                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPopular}
                      onChange={e => setForm({
                        ...form, isPopular: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">
                      Mark as Popular
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm({
                        ...form, isActive: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
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
                  {saving ? 'Saving...' : 'Save Package'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadPkg && (
        <ImageUploadModal
          packageId={uploadPkg.id}
          packageTitle={uploadPkg.title}
          onClose={() => { setUploadPkg(null); load(); }}
        />
      )}
    </AdminLayout>
  );
}