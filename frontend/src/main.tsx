import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ThemeProvider} from 'next-themes'
import {AuthProvider} from '@/contexts/auth'
import {AppDataProvider} from '@/contexts/appData'
import {Toaster} from '@/components/ui/sonner'
import './index.css'
import App from './App.tsx'
import {TooltipProvider} from "@/components/ui/tooltip.tsx";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <AppDataProvider>
                    <QueryClientProvider client={queryClient}>
                        <TooltipProvider>
                            <App/>
                            <Toaster position="top-center"/>
                        </TooltipProvider>
                    </QueryClientProvider>
                </AppDataProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
)
