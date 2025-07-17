import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdminApp from './AdminApp';

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
); 