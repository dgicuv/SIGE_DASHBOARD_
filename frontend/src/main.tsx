import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/auth'
import { AppDataProvider } from '@/contexts/appData'
import { Toaster } from '@/components/ui/sonner'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppDataProvider>
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster position="top-center" />
          </QueryClientProvider>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
