import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes as landingRoutes } from 'pages/landing-pagel/routes';
import { LoginPage } from 'pages/login/LoginPage';

export const AppRouter = () => {
  return useRoutes([...landingRoutes, { path: 'login', element: <LoginPage /> }]);
};

export const AppRouterWithProvider = () => (
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);
