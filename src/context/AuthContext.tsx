import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/index.ts';

interface AuthContextType {
  user: UserProfile;
  switchRole: (role: UserRole) => Promise<void>;
  login: (role: UserRole, name?: string, email?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
  loading: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'user-student-1',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@institution.edu.in',
  role: 'student',
  department: 'Computer Science & Engineering',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  studentOrEmployeeId: '22BCSE104',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/auth/current-user')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error('Error fetching current user:', err))
      .finally(() => setLoading(false));
  }, []);

  const switchRole = async (newRole: UserRole) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error switching role:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (role: UserRole, name?: string, email?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, name, email }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Return to default student
    switchRole('student');
  };

  const isAdmin = user.role === 'admin';
  const isFaculty = user.role === 'faculty' || user.role === 'admin';
  const isStudent = user.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        switchRole,
        login,
        logout,
        isAdmin,
        isFaculty,
        isStudent,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
