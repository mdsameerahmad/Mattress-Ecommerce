import { ReactNode, createContext, useContext, useState } from 'react';
import { User, mockUser } from '../lib/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock authentication - starts as not logged in
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - accept any email/password
    // Check if admin login
    if (email === 'admin@CustomMattres.com') {
      setUser({ ...mockUser, role: 'admin', email: 'admin@CustomMattres.com' });
      setIsAuthenticated(true);
      return true;
    }
    
    setUser(mockUser);
    setIsAuthenticated(true);
    return true;
  };

  const signup = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    // Mock signup
    const newUser: User = {
      id: 'newuser',
      name,
      email,
      phone,
      role: 'user',
      addresses: [],
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
