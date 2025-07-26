import { LandingPage } from './LandingPage';
import { Navigate } from 'react-router-dom';

export const routes = [
  {
    path: '/',
    element: <LandingPage />,
    children: [
      { index: true, element: <div>Tutorials and resources will be here</div> },
      { path: 'find-tutor', element: <div>Find tutor</div> },
      { path: 'become-tutor', element: <div>Become a tutor</div> },
      { path: 'about', element: <div>About us</div> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
];
