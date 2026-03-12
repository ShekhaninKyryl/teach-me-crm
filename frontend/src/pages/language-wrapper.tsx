import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  PREFERRED_LANGUAGE_KEY,
} from "@/constants/language";

const LanguageWrapper = () => {
  const { i18n } = useTranslation();
  const { lng } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigateToLanguage = (nextLng: string) => {
    const currentPath = location.pathname.split("/").slice(2).join("/");
    const normalizedPath = currentPath ? `/${currentPath}` : "";
    navigate(`/${nextLng}${normalizedPath}${location.search}${location.hash}`, {
      replace: true,
    });
  };

  useEffect(() => {
    if (!i18n.options.supportedLngs) {
      throw new Error("supportedLngs is not defined in i18n options");
    }

    if (user?.language && isSupportedLanguage(user.language)) {
      if (lng !== user.language) {
        navigateToLanguage(user.language);
        return;
      }

      if (i18n.language !== user.language) {
        void i18n.changeLanguage(user.language);
      }
      return;
    }

    const storedLanguage = localStorage.getItem(PREFERRED_LANGUAGE_KEY);
    const fallbackLanguage =
      storedLanguage && isSupportedLanguage(storedLanguage)
        ? storedLanguage
        : DEFAULT_LANGUAGE;

    const targetLanguage = lng && isSupportedLanguage(lng) ? lng : fallbackLanguage;

    if (lng !== targetLanguage) {
      navigateToLanguage(targetLanguage);
      return;
    }

    localStorage.setItem(PREFERRED_LANGUAGE_KEY, targetLanguage);

    if (i18n.language !== targetLanguage) {
      void i18n.changeLanguage(targetLanguage);
    }
  }, [
    lng,
    i18n,
    location.pathname,
    location.search,
    location.hash,
    navigate,
    user?.language,
  ]);

  return <Outlet />;
};

export default LanguageWrapper;
