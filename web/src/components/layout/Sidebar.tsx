import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../constants';

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

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const accessibleNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role as any));

  const isActive = (path: string) => {
    if (path === 'dashboard' && location.pathname === '/') return true;
    return location.pathname.includes(path);
  };

  const handleNavigation = (view: string) => {
    if (view === 'dashboard') navigate('/');
    else navigate(`/${view}`);
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col shadow-2xl z-20 border-r border-slate-800/50">
      {/* Brand Header */}
      <div className="h-24 flex items-center px-6 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-25 animate-pulse"></div>
            <TetraOilLogo className="w-10 h-10 relative z-10 shadow-lg" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Tetra<span className="text-blue-500">Oil</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
              Portal Tetra OIL
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="mb-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Menu Principal
        </div>
        <ul className="space-y-1.5 mb-10">
          {accessibleNavItems.map((item) => {
            const active = isActive(item.view);
            return (
              <li key={item.view}>
                <button
                  onClick={() => handleNavigation(item.view)}
                  className={`w-full text-left flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                    }`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-l-xl"></div>
                  )}
                  <item.icon
                    className={`h-5 w-5 mr-3.5 transition-colors duration-300 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
                      }`}
                  />
                  <span className="font-medium text-sm tracking-wide">{item.name}</span>

                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mb-3 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Administração
        </div>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => navigate('/settings/company')}
              className={`w-full text-left flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${location.pathname === '/settings/company'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                }`}
            >
              <svg className="h-5 w-5 mr-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium text-sm tracking-wide">Minha Empresa</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/settings/team')}
              className={`w-full text-left flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${location.pathname === '/settings/team'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                }`}
            >
              <svg className="h-5 w-5 mr-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium text-sm tracking-wide">Equipe</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 mb-3 hover:border-slate-600 transition-colors group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-blue-500">{user.name.charAt(0)}</span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-lg transition-all duration-200 group"
        >
          <svg className="w-4 h-4 mr-2 text-slate-500 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="group-hover:text-red-400 transition-colors">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};
