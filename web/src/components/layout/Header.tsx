import React from 'react';
import { useUser } from '../../context/UserContext';
import { ROLES } from '../../constants';
import { UserRole } from '../../types';

const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const Header: React.FC = () => {
  const { user, setUserRole } = useUser();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserRole(e.target.value as UserRole);
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
        <div>
            {/* Can be used for breadcrumbs or page title */}
        </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.company}</p>
        </div>
        <UserCircleIcon className="h-10 w-10 text-gray-400" />
        <div className="pl-4 border-l border-gray-200">
            <label htmlFor="role-switcher" className="text-sm font-medium text-gray-500 mr-2">Simular Perfil:</label>
            <select
                id="role-switcher"
                value={user.role}
                onChange={handleRoleChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
            >
                {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
        </div>
      </div>
    </header>
  );
};
