import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../constants';

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  // Filter items based on user role (simple check for now)
  // In a real app, you'd check permissions more granularly
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
    <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
      <div className="h-16 flex items-center px-6 font-bold border-b border-slate-800 bg-slate-900">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-600/20">
          <span className="text-white text-lg">T</span>
        </div>
        <span className="text-lg tracking-tight">Portal TRR</span>
      </div>

      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Menu Principal
        </div>
        <ul className="space-y-1 mb-8">
          {accessibleNavItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => handleNavigation(item.view)}
                className={`w-full text-left flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive(item.view)
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon className={`h-5 w-5 mr-3 transition-colors ${isActive(item.view) ? 'text-white' : 'text-slate-500 group-hover:text-white'
                  }`} />
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Configurações
        </div>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => navigate('/settings/company')}
              className={`w-full text-left flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${location.pathname === '/settings/company'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <svg className="h-5 w-5 mr-3 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium">Minha Empresa</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/settings/team')}
              className={`w-full text-left flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${location.pathname === '/settings/team'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <svg className="h-5 w-5 mr-3 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">Equipe</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};
