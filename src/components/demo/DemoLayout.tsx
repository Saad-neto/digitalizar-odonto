import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Home,
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/demo' },
  { icon: Users, label: 'Pacientes', path: '/demo/pacientes' },
  { icon: Calendar, label: 'Agendamentos', path: '/demo/agendamentos' },
  { icon: DollarSign, label: 'Financeiro', path: '/demo/financeiro' },
  { icon: FileText, label: 'Blog', path: '/demo/blog' },
];

const DemoLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/demo') return location.pathname === '/demo';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-medical-600 to-medical-700 text-white flex flex-col shadow-2xl flex-shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-medical-500">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-xl">🦷</span>
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Clínica Sorriso Perfeito</h1>
              <p className="text-xs text-medical-200">Painel da Clínica</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-medical-500 border-2 border-medical-300 flex items-center justify-center">
              <span className="text-xs">DS</span>
            </div>
            <div>
              <p className="text-xs font-medium">Dra. Silva</p>
              <p className="text-xs text-medical-300">Administradora</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
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
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-medical-500">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-medical-100 hover:bg-medical-700/50 hover:text-white transition-all"
          >
            <Home size={20} />
            <span className="text-sm">Voltar ao site</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <span className="text-xs font-semibold text-medical-600 bg-medical-50 px-2 py-0.5 rounded">
              MODO DEMO
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">Dados de exemplo — sem dados reais</span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DemoLayout;
