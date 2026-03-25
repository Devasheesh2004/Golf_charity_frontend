"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  subscription_status?: string;
  subscription_plan?: string;
  subscription_renewal_date?: string;
  total_contribution?: number;
  charity_recipient?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      // Prevents React strictly triggering a "cascading render" lint warning by pushing execution back into the queue
      await new Promise(resolve => setTimeout(resolve, 0));
      if (!mounted) return;

      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
    return () => { mounted = false; };
  }, []);

  const login = useCallback((newToken: string, userData: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    
    if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedUser = await res.json();
        if (updatedUser) {
          console.log("[AUTH] Refreshing user data:", updatedUser.email, "Status:", updatedUser.subscription_status, "Plan:", updatedUser.subscription_plan);
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        console.warn("[AUTH] Refresh failed with status:", res.status);
      }
    } catch (err) {
      console.error("[AUTH] Refresh user network error:", err);
    }
  }, [token]);

  const authContextValue = useMemo(() => ({
    user,
    token,
    login,
    logout,
    refreshUser,
    loading
  }), [user, token, login, logout, refreshUser, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
