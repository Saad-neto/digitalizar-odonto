import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Home,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: Users,
      label: 'Leads',
      path: '/admin/leads',
    },
    {
      icon: Calendar,
      label: 'Agendamentos',
      path: '/admin/agendamentos',
    },
    {
      icon: BookOpen,
      label: 'Blog',
      path: '/admin/blog',
    },
    {
      icon: BarChart3,
      label: 'Relatórios',
      path: '/admin/reports',
    },
    {
      icon: Settings,
      label: 'Configurações',
      path: '/admin/configuracoes',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin/blog') {
      return location.pathname.startsWith('/admin/blog');
    }
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gradient-to-b from-medical-600 to-medical-700 text-white min-h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-medical-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl">🦷</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Sites Odonto</h1>
            <p className="text-xs text-medical-200">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-white text-medical-600 shadow-lg font-semibold'
                  : 'text-medical-100 hover:bg-medical-700/50 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-medical-500 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-medical-100 hover:bg-medical-700/50 hover:text-white transition-all"
        >
          <Home size={20} />
          <span>Ver Site</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
