import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppRouterWithProvider } from 'app-router';
import './fontawesome';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouterWithProvider />
  </React.StrictMode>
);
