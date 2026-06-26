import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Inquiry } from '../../types';
import { adminApi } from '../../api/services';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = () => {
    adminApi.getInquiries()
      .then(res => setInquiries(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: number) => {
    try {
      await adminApi.updateInquiryStatus(id, status);
      toast.success('Status updated');
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'All'
    ? inquiries
    : inquiries.filter(i => i.status === filter);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-bold text-gray-800">
            Booking Inquiries
          </h2>
          <div className="flex gap-2">
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium
                  transition
                  ${filter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                  }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No inquiries found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Name', 'Phone', 'Package/Hotel', 'Travel Date',
                      'Adults', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-gray-600
                        font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(inq => (
                    <tr key={inq.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{inq.name}</p>
                        <p className="text-xs text-gray-400">{inq.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{inq.phone}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {inq.packageTitle || inq.hotelName || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {inq.travelDate
                          ? new Date(inq.travelDate).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {inq.adults} + {inq.children}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full
                          font-medium ${statusColors[inq.status] || ''}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={
                            inq.status === 'Pending' ? 0
                            : inq.status === 'Confirmed' ? 1 : 2
                          }
                          onChange={e => updateStatus(inq.id, +e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg
                            px-2 py-1.5 focus:outline-none focus:ring-1
                            focus:ring-blue-500">
                          <option value={0}>Pending</option>
                          <option value={1}>Confirmed</option>
                          <option value={2}>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}