import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes as landingRoutes } from 'pages/routes';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from '@/contexts/auth-context';
import { Theme } from '@radix-ui/themes';

export const AppRouter = () => {
  return useRoutes([...landingRoutes]);
};

export const AppRouterWithProvider = () => {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <AuthProvider>
        <Theme appearance="dark">
          <AppRouter key={i18n.language} />
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  );
};
