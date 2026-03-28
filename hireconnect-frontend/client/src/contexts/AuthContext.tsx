import React, { createContext, useContext, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/_core/hooks/useAuth";
import type { User } from "../../../drizzle/schema";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: unknown;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isApplicant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, error, isAuthenticated, logout } = useAuthHook();

  const value: AuthContextType = {
    user: user || null,
    loading,
    error,
    isAuthenticated,
    logout,
    isAdmin: user?.role === "admin",
    isApplicant: user?.role === "applicant",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
