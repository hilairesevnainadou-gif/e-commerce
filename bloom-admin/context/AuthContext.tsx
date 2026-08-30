"use client";

import {
  ApiError,
  UNAUTHORIZED_EVENT,
  login as apiLogin,
  logout as apiLogout,
  me as apiMe,
} from "@/lib/api";
import type { User } from "@/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const TOKEN_KEY = "bloom_admin_token";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  // Central handler for any API call that comes back unauthenticated
  // (expired/revoked token) while the admin is mid-session, so they get
  // dropped back to /login instead of staring at a page whose data
  // silently failed to load.
  useEffect(() => {
    const handleUnauthorized = () => {
      setSessionExpired(true);
      clearSession();
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    apiMe(stored)
      .then((fetchedUser) => {
        if (fetchedUser.role !== "admin") {
          clearSession();
          return;
        }
        setToken(stored);
        setUser(fetchedUser);
      })
      .catch((err) => {
        // Only wipe the stored token when the server explicitly rejected
        // it (invalid/expired/forbidden). A network hiccup or transient
        // 5xx shouldn't force a re-login — leave the token in place so a
        // reload can retry.
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          clearSession();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, token: newToken } = await apiLogin(email, password);

    if (loggedInUser.role !== "admin") {
      // This token can never be used from the admin panel — revoke it
      // immediately instead of leaving it dangling server-side.
      await apiLogout(newToken).catch(() => {});
      throw new Error("Ce compte n'a pas accès à l'administration.");
    }

    setSessionExpired(false);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(loggedInUser);
  };

  const logout = async () => {
    if (token) {
      await apiLogout(token).catch(() => {});
    }
    setSessionExpired(false);
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, sessionExpired, login, logout }}
    >
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
