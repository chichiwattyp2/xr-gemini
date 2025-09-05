
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isCreator: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.Visitor);

  const user = useMemo(() => {
    return MOCK_USERS[currentUserRole];
  }, [currentUserRole]);
  
  const setUserRole = (role: UserRole) => {
    setCurrentUserRole(role);
  };

  const isAuthenticated = useMemo(() => currentUserRole !== UserRole.Visitor, [currentUserRole]);
  const isCreator = useMemo(() => currentUserRole === UserRole.Creator || currentUserRole === UserRole.Admin, [currentUserRole]);
  const isAdmin = useMemo(() => currentUserRole === UserRole.Admin, [currentUserRole]);

  const value = { user, setUserRole, isAuthenticated, isCreator, isAdmin };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
