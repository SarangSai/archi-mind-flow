import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'manager' | 'technician';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  buildings: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('architech_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, _password: string, role: UserRole) => {
    const newUser: User = {
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role,
      buildings: ['Building A', 'Building B', 'Building C'],
    };
    setUser(newUser);
    localStorage.setItem('architech_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('architech_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
