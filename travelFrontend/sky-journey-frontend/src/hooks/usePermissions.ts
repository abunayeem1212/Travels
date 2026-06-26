import { useAuth } from '../context/AuthContext';
import { RolePermissions } from '../types';

export const usePermissions = (): RolePermissions => {
  const { user } = useAuth();
  const role = user?.role || 'User';

  return {
    isSuperAdmin: role === 'SuperAdmin',
    canDelete: ['SuperAdmin', 'Admin'].includes(role),
    canManageUsers: ['SuperAdmin', 'Admin'].includes(role),
    canManageSettings: role === 'SuperAdmin',
    canManageBanners: ['SuperAdmin', 'Admin'].includes(role),
    canManageTeam: ['SuperAdmin', 'Admin'].includes(role),
  };
};