import { useEffect, useState } from 'react';
import {
  UserPlus,  ToggleLeft, ToggleRight, Trash2, X
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { User } from '../../types';
import { userApi } from '../../api/services';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ROLES = ['Admin', 'Moderator', 'Agent', 'User'];
const SUPER_ROLES = ['SuperAdmin', ...ROLES];

const roleColors: Record<string, string> = {
  SuperAdmin: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Moderator: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Agent: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  User: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [newUser, setNewUser] = useState({
    fullName: '', email: '', phone: '',
    password: '', role: 'Agent'
  });
  const [saving, setSaving] = useState(false);
  const { isSuperAdmin } = usePermissions();
  const { user: currentUser } = useAuth();

  const load = () => {
    userApi.getAll()
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await userApi.updateRole(userId, newRole);
      toast.success('Role updated');
      load();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await userApi.updateStatus(userId, !isActive);
      toast.success(isActive ? 'User deactivated' : 'User activated');
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await userApi.delete(id);
      toast.success('User deleted');
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleCreate = async () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      toast.error('Fill all required fields');
      return;
    }
    setSaving(true);
    try {
      await userApi.create(newUser);
      toast.success('User created!');
      setShowModal(false);
      setNewUser({
        fullName: '', email: '', phone: '',
        password: '', role: 'Agent'
      });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = filterRole === 'All'
    ? users
    : users.filter(u => u.role === filterRole);

  const availableRoles = isSuperAdmin ? SUPER_ROLES : ROLES;

  return (
    <AdminLayout>
      <div className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              User Management
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              {users.length} total users
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white
              px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <UserPlus size={16} /> Add User
          </button>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['All', ...SUPER_ROLES]).map(role => (
            <button key={role}
              onClick={() => setFilterRole(role)}
              className={`p-3 rounded-xl text-center transition border
                ${filterRole === role
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}>
              <div className="text-xl font-bold text-gray-800
                dark:text-white">
                {role === 'All'
                  ? users.length
                  : users.filter(u => u.role === role).length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {role}
              </div>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
          overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50
                  border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    {['User', 'Email', 'Phone', 'Role',
                      'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h}
                        className="text-left px-4 py-3 text-gray-600
                          dark:text-gray-400 font-medium text-xs
                          uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50
                  dark:divide-gray-700">
                  {filteredUsers.map(u => (
                    <tr key={u.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30
                        transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100
                            dark:bg-blue-900 rounded-full flex items-center
                            justify-center text-blue-600 dark:text-blue-400
                            font-bold text-sm shrink-0">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800
                            dark:text-white whitespace-nowrap">
                            {u.fullName}
                            {u.email === currentUser?.email && (
                              <span className="ml-1 text-xs text-blue-500">
                                (you)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500
                        dark:text-gray-400">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-gray-500
                        dark:text-gray-400">
                        {u.phone || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {u.role === 'SuperAdmin' || u.email === currentUser?.email ? (
                          <span className={`text-xs px-2 py-1 rounded-full
                            font-medium ${roleColors[u.role]}`}>
                            {u.role}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={e =>
                              handleRoleChange(u.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full
                              font-medium border-0 cursor-pointer
                              focus:outline-none focus:ring-2
                              focus:ring-blue-500
                              ${roleColors[u.role]}`}>
                            {availableRoles.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            handleToggleStatus(u.id, u.isActive)}
                          disabled={u.email === currentUser?.email}
                          className={`flex items-center gap-1.5 text-xs
                            font-medium transition disabled:opacity-40
                            ${u.isActive
                              ? 'text-green-600 hover:text-red-500'
                              : 'text-red-500 hover:text-green-600'
                            }`}>
                          {u.isActive ? (
                            <><ToggleRight size={18} /> Active</>
                          ) : (
                            <><ToggleLeft size={18} /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-400
                        dark:text-gray-500 text-xs whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {u.role !== 'SuperAdmin' &&
                          u.email !== currentUser?.email &&
                          isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50
                              dark:hover:bg-red-900/20 rounded-lg
                              transition">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center
          justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full
            max-w-md max-h-[calc(100vh-3rem)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b
              border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Add New User
              </h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100
                  dark:hover:bg-gray-700 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto
              max-h-[calc(100vh-18rem)]">
              {[
                { key: 'fullName', label: 'Full Name *',
                  placeholder: 'Mohammad Rahman' },
                { key: 'email', label: 'Email *', type: 'email',
                  placeholder: 'user@email.com' },
                { key: 'phone', label: 'Phone',
                  placeholder: '01XXXXXXXXX' },
                { key: 'password', label: 'Password *', type: 'password',
                  placeholder: 'Min 6 characters' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-gray-700
                    dark:text-gray-300 mb-1 block">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    value={newUser[field.key as keyof typeof newUser]}
                    onChange={e => setNewUser({
                      ...newUser, [field.key]: e.target.value
                    })}
                    className="w-full border border-gray-200
                      dark:border-gray-600 bg-white dark:bg-gray-700
                      text-gray-800 dark:text-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-gray-700
                  dark:text-gray-300 mb-1 block">Role *</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({
                    ...newUser, role: e.target.value
                  })}
                  className="w-full border border-gray-200
                    dark:border-gray-600 bg-white dark:bg-gray-700
                    text-gray-800 dark:text-gray-200 rounded-lg px-3
                    py-2.5 text-sm focus:outline-none focus:ring-2
                    focus:ring-blue-500">
                  {availableRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Role Description */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl
                p-3 text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <p><strong>Admin:</strong> সব কিছু manage করতে পারবে</p>
                <p><strong>Moderator:</strong> Content manage, delete নেই</p>
                <p><strong>Agent:</strong> Package/Hotel/Inquiry only</p>
                <p><strong>User:</strong> Public site শুধু</p>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700
              bg-white dark:bg-gray-800 p-5">
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200
                    dark:border-gray-600 text-gray-600 dark:text-gray-300
                    py-2.5 rounded-xl text-sm hover:bg-gray-50
                    dark:hover:bg-gray-700 transition">
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5
                    rounded-xl text-sm hover:bg-blue-700 transition
                    disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}