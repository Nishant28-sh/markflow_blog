import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import { authService } from "@/services/authService";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("markflow_token");
    const cachedUser = localStorage.getItem("markflow_user");

    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser));
      authService
        .getMe()
        .then((freshUser) => {
          setUser(freshUser);
          localStorage.setItem("markflow_user", JSON.stringify(freshUser));
        })
        .catch(() => {
          localStorage.removeItem("markflow_token");
          localStorage.removeItem("markflow_user");
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  function persist(nextUser: User, token: string) {
    localStorage.setItem("markflow_token", token);
    localStorage.setItem("markflow_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function login(email: string, password: string) {
    const { user: loggedInUser, token } = await authService.login(email, password);
    persist(loggedInUser, token);
  }

  async function register(name: string, email: string, password: string) {
    const { user: newUser, token } = await authService.register(name, email, password);
    persist(newUser, token);
  }

  function logout() {
    localStorage.removeItem("markflow_token");
    localStorage.removeItem("markflow_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
