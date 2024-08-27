import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App.tsx'
import { AuthProvider } from './contexts/Auth/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MantineProvider>
        <App />
      </MantineProvider>
    </AuthProvider>

  </StrictMode>,
)
