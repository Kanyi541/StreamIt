// src/index.tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AuthWrapper from './AuthWrapper.js';

createRoot(document.getElementById('root')!).render(
  <AuthWrapper>
    <App />
  </AuthWrapper>
);
