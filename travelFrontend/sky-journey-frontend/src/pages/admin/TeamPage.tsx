import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { TeamMember } from '../../types';
import { commonApi } from '../../api/services';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '', designation: '', facebookUrl: '',
  linkedInUrl: '', displayOrder: 0, isActive: true
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    commonApi.getTeam()
      .then(res => setMembers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setFile(null);
    setPreview('');
    setShowModal(true);
  };

  const openEdit = (member: TeamMember) => {
    setForm({
      name: member.name,
      designation: member.designation,
      facebookUrl: member.facebookUrl || '',
      linkedInUrl: member.linkedInUrl || '',
      displayOrder: 0,
      isActive: true
    });
    setPreview(member.photoUrl || '');
    setFile(null);
    setEditId(member.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.designation) {
      toast.error('Name and designation are required');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v.toString()));
      if (file) formData.append('photo', file);

      if (editId) {
        await api.put(`/team/${editId}`, formData);
        toast.success('Member updated!');
      } else {
        await api.post('/team', formData);
        toast.success('Member added!');
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
    if (!window.confirm('Delete this team member?')) return;
    try {
      await api.delete(`/team/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Team Members</h2>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <Plus size={16} /> Add Member
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map(member => (
              <div key={member.id} className="bg-white rounded-xl shadow-sm p-4 text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden bg-blue-100">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-500 text-xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                <p className="text-xs text-gray-400 mb-3">{member.designation}</p>
                <div className="flex justify-center gap-2">
                  <button onClick={() => openEdit(member)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(member.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-bold text-gray-800">{editId ? 'Edit Member' : 'Add Member'}</h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => inputRef.current?.click()}>
                  {preview ? (
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Upload size={24} />
                    </div>
                  )}
                </div>
                <button onClick={() => inputRef.current?.click()}
                  className="text-xs text-blue-600 hover:underline">
                  {preview ? 'Change Photo' : 'Upload Photo'}
                </button>
                <input ref={inputRef} type="file" accept="image/*" className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                  }} />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                <input value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mohammad Rahman" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Designation *</label>
                <input value={form.designation}
                  onChange={e => setForm({ ...form, designation: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CEO & Founder" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Facebook URL</label>
                <input value={form.facebookUrl}
                  onChange={e => setForm({ ...form, facebookUrl: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/..." />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">LinkedIn URL</label>
                <input value={form.linkedInUrl}
                  onChange={e => setForm({ ...form, linkedInUrl: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/..." />
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
