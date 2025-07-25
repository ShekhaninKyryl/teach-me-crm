import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/login/LoginPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Далі інші сторінки */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
