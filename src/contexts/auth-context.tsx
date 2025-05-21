"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isPinSet: boolean;
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  signup: (name: string, email: string) => void;
  setPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isPinSet, setIsPinSet] = useState(false);
  const [appPin, setAppPin] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem('smartHavenAuth');
    const storedPin = localStorage.getItem('smartHavenPin');
    if (storedAuth) {
      const { isAuthenticated: authStatus, user: userData } = JSON.parse(storedAuth);
      setIsAuthenticated(authStatus);
      setUser(userData);
    }
    if (storedPin) {
      setAppPin(storedPin);
      setIsPinSet(true);
    }
  }, []);

  const login = (email: string) => {
    const newUser = { name: 'Demo User', email };
    setIsAuthenticated(true);
    setUser(newUser);
    localStorage.setItem('smartHavenAuth', JSON.stringify({ isAuthenticated: true, user: newUser }));
    if (isPinSet) {
      // Potentially prompt for PIN after login if that's the desired flow
      router.push('/dashboard');
    } else {
      router.push('/set-pin');
    }
  };

  const signup = (name: string, email: string) => {
    const newUser = { name, email };
    setIsAuthenticated(true);
    setUser(newUser);
    localStorage.setItem('smartHavenAuth', JSON.stringify({ isAuthenticated: true, user: newUser }));
    router.push('/set-pin');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('smartHavenAuth');
    // Optionally remove PIN on logout, or keep it
    // localStorage.removeItem('smartHavenPin');
    // setIsPinSet(false);
    // setAppPin(null);
    router.push('/login');
  };

  const setPin = (pin: string) => {
    setAppPin(pin);
    setIsPinSet(true);
    localStorage.setItem('smartHavenPin', pin);
    router.push('/dashboard');
  };

  const verifyPin = (pin: string) => {
    return appPin === pin;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup, isPinSet, setPin, verifyPin }}>
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
