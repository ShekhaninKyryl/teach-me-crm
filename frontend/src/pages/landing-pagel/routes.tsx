import { LandingPage } from './LandingPage';
import { Navigate } from 'react-router-dom';
import { FindTutor } from 'pages/landing-pagel/find-tutor';
import BecomeATutor from 'pages/landing-pagel/become-a-tutor';

export const routes = [
  {
    path: '/',
    element: <LandingPage />,
    children: [
      { index: true, element: <Navigate to="find-tutor" replace /> },
      { path: 'find-tutor', index: true, element: <FindTutor /> },
      { path: 'become-tutor', element: <BecomeATutor /> },
      { path: 'about', element: <div>About us</div> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];
