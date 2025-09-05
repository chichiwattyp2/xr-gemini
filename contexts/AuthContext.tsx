import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { api } from '../services/api';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  signIn: (opts: { email: string; password: string; role?: UserRole }) => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: Partial<Pick<User,'name'|'avatarUrl'>>) => Promise<void>;
  library: string[];
  addToLibrary: (experienceId: string) => void;
  removeFromLibrary: (experienceId: string) => void;
  isInLibrary: (experienceId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_KEY = 'volusphere_auth_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(MOCK_USERS[UserRole.Visitor]);
  
  // Hydrate from localStorage on initial load
  useEffect(() => {
    let userToSet = MOCK_USERS[UserRole.Visitor]; // Default value
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) { // Only proceed if there's something in storage
        const saved = JSON.parse(raw);
        // Ensure we have a valid user object with a role before using it
        if (saved && typeof saved === 'object' && saved.role && Object.values(UserRole).includes(saved.role)) {
          userToSet = saved as User;
        } else {
          // If data is invalid (e.g., not an object, missing role), clear it
          localStorage.removeItem(LS_KEY);
        }
      }
    } catch (error) {
      // If JSON.parse fails (e.g., on "undefined" string or malformed JSON), it will be caught here.
      console.error("Failed to parse user from localStorage, clearing invalid data.", error);
      localStorage.removeItem(LS_KEY);
    }
    setUser(userToSet);
  }, []);
  
  const library = useMemo(() => user.library || [], [user]);

  const persist = (u: User) => {
    setUser(u);
    try { 
      localStorage.setItem(LS_KEY, JSON.stringify(u)); 
    } catch (e) {
      console.error("Could not persist user to localStorage", e);
    }
  };

  const isAuthenticated = user.role !== UserRole.Visitor;
  const isCreator = user.role === UserRole.Creator || user.role === UserRole.Admin;
  const isAdmin = user.role === UserRole.Admin;

  const signIn = useCallback(async ({ email, password, role }: { email: string; password: string; role?: UserRole })=>{
    const r = role || (email.toLowerCase().includes('admin') ? UserRole.Admin
                  : email.toLowerCase().includes('creator') ? UserRole.Creator
                  : UserRole.Viewer);
    // On sign-in, create a fresh user object from the mock, but preserve the library from the previous session if any.
    const u = { ...MOCK_USERS[r], name: MOCK_USERS[r].name, avatarUrl: MOCK_USERS[r].avatarUrl, library: [] }; // Start with empty library on new sign-in
    await api.authDelay();
    const fetchedLibrary = await api.getLibrary(u.id);
    u.library = fetchedLibrary;
    persist(u);
  }, []);

  const signOut = useCallback(()=>{
    const v = { ...MOCK_USERS[UserRole.Visitor], library: [] };
    persist(v);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<User,'name'|'avatarUrl'>>)=>{
    const next = { ...user, ...updates };
    await api.authDelay();
    persist(next);
  }, [user]);

  const addToLibrary = useCallback(async (experienceId: string) => {
    if (!isAuthenticated) return;
    await api.addToLibrary(user.id, experienceId);
    const nextLibrary = user.library?.includes(experienceId) ? user.library : [...(user.library || []), experienceId];
    persist({ ...user, library: nextLibrary });
  }, [user, isAuthenticated]);

  const removeFromLibrary = useCallback(async (experienceId: string) => {
    if (!isAuthenticated) return;
    await api.removeFromLibrary(user.id, experienceId);
    const nextLibrary = user.library?.filter(id => id !== experienceId) || [];
    persist({ ...user, library: nextLibrary });
  }, [user, isAuthenticated]);

  const isInLibrary = useCallback((experienceId: string) => library.includes(experienceId), [library]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isCreator,
    isAdmin,
    signIn,
    signOut,
    updateProfile,
    library,
    addToLibrary,
    removeFromLibrary,
    isInLibrary,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};