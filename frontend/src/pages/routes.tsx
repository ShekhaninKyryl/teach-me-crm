import i18n from 'i18next';
import { Navigate } from 'react-router-dom';
import { LandingPage } from './landing-pagel/LandingPage';
import LanguageWrapper from './language-wrapper';
import { FindTutor } from './landing-pagel/find-tutor';
import BecomeATutor from './landing-pagel/become-a-tutor';
import { LoginPage } from './login/LoginPage';
import Workspace from 'pages/workspace';

export const routes = [
  {
    path: '/:lng',
    element: <LanguageWrapper />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '',
        element: <LandingPage />,
        children: [
          { index: true, element: <Navigate to="find-tutor" replace /> },
          { path: 'find-tutor', element: <FindTutor /> },
          { path: 'become-tutor', element: <BecomeATutor /> },
          { path: 'workspace', element: <Workspace /> },
          { path: 'about', element: <div>About us</div> },
          { path: '*', element: <Navigate to={`/${i18n.language}/find-tutor`} /> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to={`/${i18n.language}/find-tutor`} replace />,
  },
  {
    path: '*',
    element: <Navigate to={`/${i18n.language}/find-tutor`} replace />,
  },
];
