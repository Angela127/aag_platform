import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [role, setRole]     = useState(null);   // 'agent' | 'manager'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Auto-resolve role based on specific hardcoded accounts
        let resolvedRole = localStorage.getItem('aag_role');
        const email = firebaseUser.email?.toLowerCase();
        
        if (email === 'manager@gmail.com') {
          resolvedRole = 'manager';
        } else if (email === 'advisor@gmail.com') {
          resolvedRole = 'agent';
        }
        
        if (!resolvedRole) {
          resolvedRole = 'agent';
        }
        
        localStorage.setItem('aag_role', resolvedRole);
        setRole(resolvedRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('aag_role');
    localStorage.removeItem('aag_briefing_date');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
