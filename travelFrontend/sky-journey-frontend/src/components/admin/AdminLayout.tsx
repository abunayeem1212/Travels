import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


import {
  LayoutDashboard, Package, Hotel, Image,
  MessageSquare, ClipboardList, Menu,
  LogOut, ChevronRight, Layout, Users, Star, Shield
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard',
    icon: LayoutDashboard, roles: ['SuperAdmin','Admin','Moderator','Agent'] },
  { label: 'Packages', path: '/admin/packages',
    icon: Package, roles: ['SuperAdmin','Admin','Moderator','Agent'] },
  { label: 'Hotels', path: '/admin/hotels',
    icon: Hotel, roles: ['SuperAdmin','Admin','Moderator','Agent'] },
  { label: 'Gallery', path: '/admin/gallery',
    icon: Image, roles: ['SuperAdmin','Admin','Moderator'] },
  { label: 'Banners', path: '/admin/banners',
    icon: Layout, roles: ['SuperAdmin','Admin'] },
  { label: 'Team', path: '/admin/team',
    icon: Users, roles: ['SuperAdmin','Admin'] },
  { label: 'Testimonials', path: '/admin/testimonials',
    icon: Star, roles: ['SuperAdmin','Admin','Moderator'] },
  { label: 'Inquiries', path: '/admin/inquiries',
    icon: ClipboardList, roles: ['SuperAdmin','Admin','Moderator','Agent'] },
  { label: 'Messages', path: '/admin/messages',
    icon: MessageSquare, roles: ['SuperAdmin','Admin','Moderator'] },
  { label: 'Users', path: '/admin/users',
    icon: Shield, roles: ['SuperAdmin','Admin'] },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleMenus = menuItems.filter(item =>
  item.roles.includes(user?.role || '')
);

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center
            justify-center text-white font-bold">S</div>
          <div>
            <div className="text-white font-bold text-sm">The Friendship Tours & Travels</div>
            <div className="text-gray-400 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleMenus.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition text-sm font-medium
                ${active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}>
              <Icon size={18} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center
            justify-center text-white text-sm font-bold">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.fullName}
            </p>
            <p className="text-gray-400 text-xs">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 text-gray-400
            hover:text-red-400 transition text-sm py-1.5">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-gray-900 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-gray-900 z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center
          justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600"
              onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <h1 className="font-semibold text-gray-800 text-sm md:text-base">
              {menuItems.find(m => m.path === location.pathname)?.label
                || 'Admin Panel'}
            </h1>
          </div>
          <Link to="/" target="_blank"
            className="text-xs text-blue-600 hover:underline">
            View Site →
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}