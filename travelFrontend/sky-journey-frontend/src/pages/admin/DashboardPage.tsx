import { useEffect, useState } from 'react';
import { Package, Hotel, MessageSquare, ClipboardList } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { DashboardStats } from '../../types';
import { adminApi } from '../../api/services';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Packages', value: stats.totalPackages,
      icon: Package, color: 'bg-blue-500' },
    { label: 'Total Hotels', value: stats.totalHotels,
      icon: Hotel, color: 'bg-purple-500' },
    { label: 'Total Inquiries', value: stats.totalInquiries,
      icon: ClipboardList, color: 'bg-green-500' },
    { label: 'Pending Inquiries', value: stats.pendingInquiries,
      icon: ClipboardList, color: 'bg-orange-500' },
    { label: 'Total Messages', value: stats.totalMessages,
      icon: MessageSquare, color: 'bg-pink-500' },
    { label: 'Unread Messages', value: stats.unreadMessages,
      icon: MessageSquare, color: 'bg-red-500' },
  ] : [];

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}
                className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map(card => {
              const Icon = card.icon;
              return (
                <div key={card.label}
                  className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{card.label}</span>
                    <div className={`w-9 h-9 ${card.color} rounded-lg flex
                      items-center justify-center`}>
                      <Icon size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {card.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Tables */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Inquiries */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  Recent Inquiries
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {stats.recentInquiries.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">
                    No inquiries yet
                  </p>
                ) : stats.recentInquiries.map(inq => (
                  <div key={inq.id} className="p-4 flex items-center
                    justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {inq.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {inq.packageOrHotel || 'General'} •{' '}
                        {inq.phone}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${inq.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : inq.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  Recent Messages
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {stats.recentMessages.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">
                    No messages yet
                  </p>
                ) : stats.recentMessages.map(msg => (
                  <div key={msg.id}
                    className="p-4 flex items-center justify-between">
                    <div>
                      <p className={`font-medium text-sm
                        ${!msg.isRead ? 'text-gray-800' : 'text-gray-500'}`}>
                        {msg.name}
                        {!msg.isRead && (
                          <span className="ml-2 w-2 h-2 bg-blue-500
                            rounded-full inline-block" />
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {msg.subject}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}