"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/lib/auth";

interface AuthContextType {
  user: SessionUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: SessionUser }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; pendingApproval?: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<{ success: boolean; error?: string; user?: SessionUser }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthPage) {
      setIsLoading(false);
      return;
    }
    refresh();
  }, [refresh, isAuthPage]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        return { success: true, user: data.data };
      }
      return { success: false, error: data.error?.message || "Invalid credentials" };
    } catch {
      return { success: false, error: "Network error during login" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.pendingApproval) {
          return { success: true, pendingApproval: true, message: data.message };
        }
        setUser(data.data);
        return { success: true };
      }
      return { success: false, error: data.error?.message || "Registration failed" };
    } catch {
      return { success: false, error: "Network error during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  const updateProfile = async (profileData: {
    name?: string;
    avatar?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setUser(data.data);
        return { success: true, user: data.data };
      }
      return { success: false, error: data.error || "Failed to update profile" };
    } catch {
      return { success: false, error: "Network error during profile update" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        isLoading,
        login,
        register,
        logout,
        refresh,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
