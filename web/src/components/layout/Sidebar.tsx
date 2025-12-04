import React from 'react';
import { useUser } from '../../context/UserContext';
import { NAV_ITEMS, View } from '../../constants';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const { user } = useUser();
  const accessibleNavItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-xl font-bold border-b border-gray-700">
        Portal do Cliente
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {accessibleNavItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => setView(item.view)}
                className={`w-full text-left flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
         <p className="text-sm text-gray-400">&copy; 2023 Tetra OIL</p>
      </div>
    </aside>
  );
};
