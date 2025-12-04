import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  DollarSign,
  CheckCircle,
  ClipboardCheck,
  Truck,
  Users,
  MessageCircle,
  Building2,
  Users2,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

// Tetra Oil Logo Component
const TetraOilLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="url(#paint0_linear)" />
    <path d="M20 8C20 8 12 18 12 23C12 27.4183 15.5817 31 20 31C24.4183 31 28 27.4183 28 23C28 18 20 8 20 8Z" fill="white" />
    <path d="M20 31C24.4183 31 28 27.4183 28 23C28 18 20 8 20 8" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
  </svg>
);

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const MENU_CATEGORIES: NavCategory[] = [
  {
    title: 'Visão Geral',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Financeiro',
    items: [
      { name: 'Central Financeira', path: '/finance', icon: DollarSign },
      { name: 'Aprovação de Pagamentos', path: '/payment-approval', icon: CheckCircle },
    ]
  },
  {
    title: 'Operacional',
    items: [
      { name: 'Auditoria de Entregas', path: '/audit', icon: ClipboardCheck },
      { name: 'Gestão de Frota', path: '/fleet', icon: Truck },
      { name: 'Gestão de Pessoas', path: '/people', icon: Users },
    ]
  },
  {
    title: 'Comunicação',
    items: [
      { name: 'Interação BOTZap', path: '/bot', icon: MessageCircle },
    ]
  },
  {
    title: 'Configurações',
    items: [
      { name: 'Minha Empresa', path: '/settings/company', icon: Building2 },
      { name: 'Equipe', path: '/settings/team', icon: Users2 },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col shadow-2xl z-20 border-r border-slate-800/50 transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-500 transition-colors z-30"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div className={`h-24 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute -inset-1 bg-blue-500 rounded-full blur opacity-25 animate-pulse ${isCollapsed ? 'hidden' : ''}`}></div>
            <TetraOilLogo className={`${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'} relative z-10 shadow-lg transition-all duration-300`} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                Tetra<span className="text-blue-500">Oil</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                Portal Tetra OIL
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {MENU_CATEGORIES.map((category, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <div className="mb-3 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-in fade-in duration-300">
                {category.title}
              </div>
            )}
            <ul className="space-y-1">
              {category.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-xl transition-all duration-200 group relative ${active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        }`}
                    >
                      <item.icon
                        className={`h-5 w-5 transition-colors duration-200 ${!isCollapsed && 'mr-3'} ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}
                      />

                      {!isCollapsed && (
                        <span className="font-medium text-sm tracking-wide animate-in fade-in duration-200">{item.name}</span>
                      )}

                      {/* Tooltip for Collapsed Mode */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-slate-700 shadow-xl">
                          {item.name}
                          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            {isCollapsed && idx < MENU_CATEGORIES.length - 1 && (
              <div className="my-4 border-t border-slate-800/50 mx-2"></div>
            )}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all duration-300`}>
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-blue-500">{user.name.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Logout Tooltip/Menu for Collapsed Mode */}
            {isCollapsed && (
              <button
                onClick={signOut}
                className="absolute left-full ml-4 bottom-0 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in duration-300">
              <p className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {user.name}
              </p>
              <button
                onClick={signOut}
                className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 mt-0.5 transition-colors"
              >
                <LogOut size={12} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
