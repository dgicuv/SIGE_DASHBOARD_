import { useState } from "react"
import { AppSidebar } from "@/components/AppSidebar"
import { CustomChart } from "@custom/CustomChart"
import type { ChartData } from "@custom/CustomChart"
import type { QueryFunctionContext } from "@tanstack/react-query"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function fetchEntidades({ signal }: QueryFunctionContext): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/v1/dashboard/entidades`, { signal })
  return res.json()
}

async function fetchPersonal({ signal }: QueryFunctionContext): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/v1/dashboard/personal`, { signal })
  return res.json()
}

const PAGE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  entidades: "Entidades",
  personal: "Personal",
  reportes: "Reportes",
  configuracion: "Configuración",
}

function DashboardContent() {
  return (
    <div className="flex flex-wrap content-start gap-0 p-2">
      <div className="w-full lg:w-1/2 xl:w-1/3 p-1 min-w-0">
        <CustomChart
          queryKey={["dashboard", "entidades"]}
          queryFn={fetchEntidades}
          colors={["#70AB6D"]}
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-1/3 p-1 min-w-0">
        <CustomChart
          queryKey={["dashboard", "personal"]}
          queryFn={fetchPersonal}
          colors={["#C8796F"]}
          orientation="vertical"
        />
      </div>
    </div>
  )
}

function PlaceholderContent({ page }: { page: string }) {
  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
      Contenido de {PAGE_LABELS[page] ?? page} (próximamente)
    </div>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState("dashboard")

  return (
    <SidebarProvider>
      <AppSidebar activeKey={activePage} onNavigate={setActivePage} />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{PAGE_LABELS[activePage] ?? activePage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col bg-background min-h-0">
          {activePage === "dashboard" ? (
            <DashboardContent />
          ) : (
            <PlaceholderContent page={activePage} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
