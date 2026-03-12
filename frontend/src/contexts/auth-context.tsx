import { createContext, useEffect, useRef, useState, type FC, type ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "@shared/types/user";
import userApi from "../api/user";
import i18n from "@/translates/i18n";
import {
  DEFAULT_LANGUAGE,
  type AppLanguage,
  isSupportedLanguage,
  PREFERRED_LANGUAGE_KEY,
} from "@/constants/language";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  setLanguage: async () => {},
});

const getLngFromPathname = (pathname: string): AppLanguage => {
  const [lng] = pathname.split("/").filter(Boolean);
  return lng && isSupportedLanguage(lng) ? lng : DEFAULT_LANGUAGE;
};

const isWorkspacePath = (pathname: string) => /^\/[^/]+\/workspace(\/|$)/.test(pathname);

const replaceLanguageInPath = (pathname: string, lng: AppLanguage) => {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return `/${lng}`;
  }

  if (isSupportedLanguage(parts[0])) {
    parts[0] = lng;
  } else {
    parts.unshift(lng);
  }

  return `/${parts.join("/")}`;
};

const savePreferredLanguage = (language: AppLanguage) => {
  localStorage.setItem(PREFERRED_LANGUAGE_KEY, language);
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    userApi
      .me()
      .then(async (u) => {
        setUser(u);

        const userLanguage =
          u.language && isSupportedLanguage(u.language) ? u.language : DEFAULT_LANGUAGE;

        savePreferredLanguage(userLanguage);

        if (i18n.language !== userLanguage) {
          await i18n.changeLanguage(userLanguage);
        }

        const { pathname, search, hash } = locationRef.current;
        const currentLanguage = getLngFromPathname(pathname);
        if (currentLanguage !== userLanguage) {
          navigate(
            `${replaceLanguageInPath(pathname, userLanguage)}${search}${hash}`,
            {
              replace: true,
            }
          );
        }
      })
      .catch(() => {
        setUser(null);

        const { pathname } = locationRef.current;
        if (isWorkspacePath(pathname)) {
          navigate(`/${getLngFromPathname(pathname)}/login`, { replace: true });
        }
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = async (language: AppLanguage) => {
    if (user) {
      await userApi.updateLanguage(language);
      setUser({ ...user, language });
    }

    savePreferredLanguage(language);

    if (i18n.language !== language) {
      await i18n.changeLanguage(language);
    }

    navigate(
      `${replaceLanguageInPath(location.pathname, language)}${location.search}${location.hash}`,
      {
        replace: true,
      }
    );
  };

  const login = async (email: string, password: string) => {
    try {
      await userApi.login({ email, password });
      const u = await userApi.me();
      setUser(u);

      const userLanguage =
        u.language && isSupportedLanguage(u.language)
          ? u.language
          : getLngFromPathname(location.pathname);

      savePreferredLanguage(userLanguage);

      if (i18n.language !== userLanguage) {
        await i18n.changeLanguage(userLanguage);
      }

      navigate(`/${userLanguage}/workspace`, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await userApi.logout();
      setUser(null);
      navigate(`/${getLngFromPathname(location.pathname)}/login`, { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setLanguage }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
