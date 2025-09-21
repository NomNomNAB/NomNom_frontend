import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
//import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/index.tsx';
//import { AuthProvider } from './stores/auth/index.tsx';
import { makeServer } from './mirage/index.ts';
import { ThemeProvider } from './contexts/ThemeContext';

makeServer();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
        {/* <AuthProvider>
          <AppRoutes />
        </AuthProvider> */}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
