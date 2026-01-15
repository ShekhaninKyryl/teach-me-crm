import { LandingPage } from './LandingPage';
import { Navigate } from 'react-router-dom';
import { FindTutor } from 'pages/landing-pagel/find-tutor';
import BecomeATutor from 'pages/landing-pagel/become-a-tutor';
import LanguageWrapper from 'pages/language-wrapper';

export const routes = [
  {
    path: '/:lng',
    element: <LanguageWrapper />,
    children: [
      {
        path: '',
        element: <LandingPage />,
        children: [
          { index: true, element: <Navigate to="find-tutor" replace /> },
          { path: 'find-tutor', element: <FindTutor /> },
          { path: 'become-tutor', element: <BecomeATutor /> },
          { path: 'about', element: <div>About us</div> },
          { path: '*', element: <Navigate to="/en/find-tutor" /> },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/ua/find-tutor" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/ua/find-tutor" replace />,
  },
];
