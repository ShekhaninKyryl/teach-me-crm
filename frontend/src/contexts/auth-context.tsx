import { createContext, useEffect, useState, type FC, type ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "@shared/types/user";
import userApi from "../api/user";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

const getLngFromPathname = (pathname: string) => {
  const [lng] = pathname.split("/").filter(Boolean);
  return lng || "ua";
};

const isWorkspacePath = (pathname: string) => /^\/[^/]+\/workspace(\/|$)/.test(pathname);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .me()
      .then((u) => setUser(u))
      .catch(() => {
        setUser(null);

        // Keep users on public pages (login/forgot/reset), redirect only from protected workspace.
        if (isWorkspacePath(location.pathname)) {
          navigate(`/${getLngFromPathname(location.pathname)}/login`, { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await userApi.login({ email, password });
      const u = await userApi.me();
      setUser(u);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await userApi.logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
