import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes as landingRoutes } from 'pages/routes';
import { LoginPage } from 'pages/login/LoginPage';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from '@/contexts/auth-context';

export const AppRouter = () => {
  return useRoutes([...landingRoutes, { path: 'login', element: <LoginPage /> }]);
};

export const AppRouterWithProvider = () => {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter key={i18n.language} />
      </AuthProvider>
    </BrowserRouter>
  );
};
