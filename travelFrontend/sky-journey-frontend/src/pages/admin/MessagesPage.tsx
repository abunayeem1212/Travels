import { useEffect, useState } from 'react';
import { Mail, MailOpen, Send, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ContactMessage } from '../../types';
import { adminApi } from '../../api/services';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => {
    adminApi.getMessages()
      .then(res => setMessages(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    setReply('');
    if (!msg.isRead) {
      await adminApi.markMessageRead(msg.id);
      load();
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await adminApi.replyMessage(selected.id, reply);
      toast.success('Reply sent!');
      setReply('');
      load();
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Contact Messages</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Message List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No messages yet
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {messages.map(msg => (
                  <button key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left p-4 hover:bg-gray-50
                      transition flex items-start gap-3
                      ${selected?.id === msg.id ? 'bg-blue-50' : ''}`}>
                    <div className={`mt-0.5 shrink-0
                      ${!msg.isRead ? 'text-blue-500' : 'text-gray-300'}`}>
                      {msg.isRead
                        ? <MailOpen size={18} />
                        : <Mail size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium
                          ${!msg.isRead ? 'text-gray-800' : 'text-gray-500'}`}>
                          {msg.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {msg.message}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          {selected ? (
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{selected.subject}</h3>
                <button onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm space-y-1 text-gray-500">
                <p><span className="font-medium text-gray-700">From:</span>{' '}
                  {selected.name}</p>
                <p><span className="font-medium text-gray-700">Phone:</span>{' '}
                  {selected.phone}</p>
                <p><span className="font-medium text-gray-700">Email:</span>{' '}
                  {selected.email}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                {selected.message}
              </div>

              {selected.adminReply && (
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">Your Reply:</p>
                  {selected.adminReply}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700
                  mb-1 block">Reply</label>
                <textarea rows={4} value={reply}
                  onChange={e => setReply(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500 resize-none"
                  placeholder="Type your reply..." />
                <button onClick={handleReply} disabled={sending || !reply.trim()}
                  className="mt-2 flex items-center gap-2 bg-blue-600
                    text-white px-4 py-2 rounded-lg hover:bg-blue-700
                    transition text-sm disabled:opacity-60">
                  <Send size={14} />
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm flex items-center
              justify-center text-gray-400 text-sm h-64">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}