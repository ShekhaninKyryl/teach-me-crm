import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes as landingRoutes } from "pages/routes";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "@/contexts/auth-context";
import { AppearanceProvider } from "@/contexts/appearance-context";
import ThemeWrapper from "@/theme-wrapper";

export const AppRouter = () => {
  return useRoutes([...landingRoutes]);
};

export const AppRouterWithProvider = () => {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppearanceProvider>
          <ThemeWrapper>
            <AppRouter key={i18n.language} />
          </ThemeWrapper>
        </AppearanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
