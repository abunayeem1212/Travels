import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { commonApi } from '../../api/services';

interface Props {
  packageId?: number;
  hotelId?: number;
  title: string;
  onClose: () => void;
}

export default function InquiryModal({ packageId, hotelId, title, onClose }: Props) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    travelDate: '', adults: 1, children: 0, message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Name and phone are required');
      return;
    }
    setLoading(true);
    try {
      await commonApi.submitInquiry({ ...form, packageId, hotelId });
      toast.success('Inquiry submitted! We will contact you soon.');
      onClose();
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center
      justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg
        max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Book Inquiry</h3>
            <p className="text-sm text-gray-500 mt-0.5">{title}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex
              items-center justify-center transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3
                  py-2.5 text-sm focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phone *
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3
                  py-2.5 text-sm focus:outline-none focus:ring-2
                  focus:ring-blue-500"
                placeholder="01XXXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3
                py-2.5 text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Travel Date
            </label>
            <input
              type="date"
              value={form.travelDate}
              onChange={e => setForm({ ...form, travelDate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3
                py-2.5 text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Adults
              </label>
              <input
                type="number" min={1}
                value={form.adults}
                onChange={e => setForm({
                  ...form, adults: parseInt(e.target.value) || 1
                })}
                className="w-full border border-gray-200 rounded-lg px-3
                  py-2.5 text-sm focus:outline-none focus:ring-2
                  focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Children
              </label>
              <input
                type="number" min={0}
                value={form.children}
                onChange={e => setForm({
                  ...form, children: parseInt(e.target.value) || 0
                })}
                className="w-full border border-gray-200 rounded-lg px-3
                  py-2.5 text-sm focus:outline-none focus:ring-2
                  focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Message
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3
                py-2.5 text-sm focus:outline-none focus:ring-2
                focus:ring-blue-500 resize-none"
              placeholder="Any special requirements..."
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3
              rounded-lg hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}