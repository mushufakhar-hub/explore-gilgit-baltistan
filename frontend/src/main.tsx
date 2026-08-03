import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import AppRouter from './app/routes/AppRouter'
import MotionProvider from './app/shared/lib/MotionProvider'
import ClerkAppProvider from './app/auth/ClerkAppProvider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './app/shared/lib/query-client'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkAppProvider>
        <QueryClientProvider client={queryClient}>
          <MotionProvider>
            <AppRouter />
          </MotionProvider>
        </QueryClientProvider>
      </ClerkAppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
