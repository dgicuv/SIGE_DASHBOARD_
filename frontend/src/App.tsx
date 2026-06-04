import { useTheme } from "next-themes";
import { BookOpen, Building2, ContactRound, LayoutDashboard, Moon, PencilLine, Server, SquareUserRound, Sun } from "lucide-react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AppSidebar, type NavItem } from "@/components/AppSidebar";
import { CustomChart } from "@custom/CustomChart";
import type { ChartData } from "@custom/CustomChart";
import type { QueryFunctionContext } from "@tanstack/react-query";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function fetchEntidades({ signal }: QueryFunctionContext): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/v1/entidadesdependencias/entidades`, { signal });
  return res.json();
}

async function fetchPersonal({ signal }: QueryFunctionContext): Promise<ChartData> {
  const res = await fetch(`${API_BASE}/api/v1/entidadesdependencias/personal`, { signal });
  return res.json();
}

function DashboardContent() {
  return (
    <div className="flex flex-wrap content-start gap-0 p-2">
      <div className="w-full lg:w-1/2 xl:w-1/2 p-1 min-w-0">
        <CustomChart
          queryKey={["dashboard", "entidades"]}
          queryFn={fetchEntidades}
          colors={["#70AB6D"]}
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-1/2 p-1 min-w-0">
        <CustomChart
          queryKey={["dashboard", "personal"]}
          queryFn={fetchPersonal}
          colors={["#C8796F"]}
          orientation="vertical"
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-1/2 p-1 min-w-0">
        <CustomChart
          queryKey={["dashboard", "personal"]}
          queryFn={fetchPersonal}
          colors={["#C8796F"]}
          orientation="vertical"
        />
      </div>
    </div>
  );
}

function PlaceholderContent({ page }: { page: string }) {
  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
      Contenido de {page} (próximamente)
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
      Página no encontrada
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="cursor-pointer"
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}

const navMain: NavItem[] = [
  { title: "General", icon: LayoutDashboard, key: "general" },
  { title: "Entidades / Dependencias", icon: Building2, key: "entidades-dependencias" },
  { title: "Personal", icon: ContactRound, key: "personal" },
  { title: "Programas Educativos", icon: BookOpen, key: "programas-educativos" },
  { title: "Matrícula Formal", icon: SquareUserRound, key: "matricula-formal" },
  { title: "Infraestructura", icon: Server, key: "infraestructura" },
];

const navBottom: NavItem[] = [
  { title: "Release Notes", icon: PencilLine, key: "release-notes" },
];

const allNavItems = [...navMain, ...navBottom];

function Layout() {
  const location = useLocation();
  const currentKey = location.pathname === "/" ? "general" : location.pathname.slice(1);
  const pageTitle = allNavItems.find((i) => i.key === currentKey)?.title ?? "Página no encontrada";

  return (
    <SidebarProvider>
      <AppSidebar navMain={navMain} navBottom={navBottom} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-full" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col bg-background min-h-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardContent />} />
          <Route path="entidades-dependencias" element={<PlaceholderContent page="Entidades / Dependencias" />} />
          <Route path="personal" element={<PlaceholderContent page="Personal" />} />
          <Route path="programas-educativos" element={<PlaceholderContent page="Programas Educativos" />} />
          <Route path="matricula-formal" element={<PlaceholderContent page="Matrícula Formal" />} />
          <Route path="infraestructura" element={<PlaceholderContent page="Infraestructura" />} />
          <Route path="release-notes" element={<PlaceholderContent page="Release Notes" />} />
          <Route path="logout" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
