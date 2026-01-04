import { createContext, useContext } from "react";
import type { AuthContextValue } from "./AuthContextProvider";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}