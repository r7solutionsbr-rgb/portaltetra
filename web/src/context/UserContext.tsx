import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface UserContextType {
  user: User;
  setUserRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: 'Gestor da Frota',
    company: 'Transportadora Veloz S.A.',
    role: UserRole.GESTOR,
  });

  const setUserRole = (role: UserRole) => {
    let name = 'Usuário';
    let company = 'Transportadora Veloz S.A.';
    switch(role) {
        case UserRole.GESTOR: name = 'Gestor da Frota'; break;
        case UserRole.FINANCEIRO: name = 'Analista Financeiro'; break;
        case UserRole.AUDITOR: name = 'Auditor Interno'; break;
        case UserRole.OPERACIONAL: name = 'Chefe de Operações'; break;
        case UserRole.COMERCIAL: 
            name = 'Executivo de Contas';
            company = 'Tetra OIL'; // A equipe comercial é da própria TRR
            break;
    }
    setUser(prevUser => ({ ...prevUser, role, name, company }));
  };
  
  return (
    <UserContext.Provider value={{ user, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
