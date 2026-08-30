"use client";

import { login as apiLogin, logout as apiLogout, me as apiMe } from "@/lib/api";
import type { User } from "@/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const TOKEN_KEY = "bloom_admin_token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    apiMe(stored)
      .then((fetchedUser) => {
        if (fetchedUser.role !== "admin") {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
          return;
        }
        setToken(stored);
        setUser(fetchedUser);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, token: newToken } = await apiLogin(email, password);

    if (loggedInUser.role !== "admin") {
      throw new Error("This account does not have admin access.");
    }

    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(loggedInUser);
  };

  const logout = async () => {
    if (token) {
      await apiLogout(token).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
