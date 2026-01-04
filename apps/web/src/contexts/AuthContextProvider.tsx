import { useState, useCallback, useEffect, type ReactNode } from "react";
import api from "@/lib/api";
import { AuthContext } from "./AuthContextHook";

const USER_STORAGE_KEY = "arctic_user";

export type User = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; imageUrl?: string }) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
};

function getStoredUser(): User | null {
  try {
    const s = sessionStorage.getItem(USER_STORAGE_KEY);
    return s ? (JSON.parse(s) as User) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null) {
  if (user) {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    setStoredUser(u);
  }, []);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    const stored = getStoredUser();
    if (!stored) {
      setIsLoading(false);
      return;
    }
    try {
      await api.get("/users/profile");
      setUserState(stored);
    } catch {
      setUserState(null);
      setStoredUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ data: User }>("/auth/login", { email, password });
      setUser(res.data.data);
    },
    [setUser]
  );

  const signup = useCallback(
    async (signupData: {
      name: string;
      email: string;
      password: string;
      imageUrl?: string;
    }) => {
      const res = await api.post<{ data: User }>("/auth/signup", signupData);
      setUser(res.data.data);
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      setUser(null);
    }
  }, [setUser]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    login,
    signup,
    logout,
    restoreSession,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}