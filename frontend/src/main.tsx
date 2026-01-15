import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouterWithProvider } from 'app-router';
import './index.css';
import './fontawesome';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouterWithProvider />
  </React.StrictMode>
);
