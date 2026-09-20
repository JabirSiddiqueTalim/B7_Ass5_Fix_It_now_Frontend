"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch, setToken } from "@/lib/api-client";
import type { AuthTokens, User } from "@/lib/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  role: User["role"] | null;
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<User["role"] | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [user, setUserState] = useState<User | null | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchUser = useCallback(async () => {
    try {
      const next = await apiFetch<User>("/api/auth/me");
      setUserState(next);
    } catch {
      setUserState((prev) => (prev === undefined ? null : prev));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch<User>("/api/auth/me", { signal: controller.signal })
      .then(setUserState)
      .catch((error) => {
        if ((error as Error)?.name !== "AbortError") {
          setUserState((prev) => (prev === undefined ? null : prev));
        }
      });
    return () => controller.abort();
  }, [pathname, refreshKey]);

  const refresh = useCallback(async () => {
    setRefreshKey((key) => key + 1);
    await fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<User["role"] | null> => {
      const tokens = await apiFetch<AuthTokens>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(tokens.accessToken);
      queryClient.clear();
      let role: User["role"] | null = null;
      try {
        const me = await apiFetch<User>("/api/auth/me");
        setUserState(me);
        role = me.role ?? null;
      } catch {
        setUserState(null);
      }
      return role;
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Token is cleared locally regardless of network result.
    }
    setToken(null);
    setUserState(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    const status: AuthStatus =
      user === undefined
        ? "loading"
        : user === null
          ? "unauthenticated"
          : "authenticated";

    return {
      user: user ?? null,
      status,
      isAuthenticated: status === "authenticated",
      role: user?.role ?? null,
      setUser: setUserState,
      refresh,
      login,
      logout,
    };
  }, [user, setUserState, refresh, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}