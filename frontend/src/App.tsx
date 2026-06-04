import { lazy, Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BookOpen, Building2, ContactRound, LayoutDashboard, Moon, PencilLine, Server, SquareUserRound, Sun } from "lucide-react";
import { MemoryRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppSidebar, type NavItem } from "@/components/AppSidebar";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/contexts/auth";
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

const GeneralPage              = lazy(() => import("@/pages/GeneralPage"));
const EntidadesDependenciasPage = lazy(() => import("@/pages/EntidadesDependenciasPage"));
const PersonalPage             = lazy(() => import("@/pages/PersonalPage"));
const ProgramasEducativosPage  = lazy(() => import("@/pages/ProgramasEducativosPage"));
const MatriculaFormalPage      = lazy(() => import("@/pages/MatriculaFormalPage"));
const InfraestructuraPage      = lazy(() => import("@/pages/InfraestructuraPage"));
const ReleaseNotesPage         = lazy(() => import("@/pages/ReleaseNotesPage"));

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

function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function LogoutRoute() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout().then(() => navigate("/login", { replace: true }));
  }, [logout, navigate]);
  return null;
}

function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch {
      setError("Credenciales inválidas");
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleSubmit} error={error} />
      </div>
    </div>
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
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route index element={<GeneralPage />} />
            <Route path="entidades-dependencias" element={<EntidadesDependenciasPage />} />
            <Route path="personal" element={<PersonalPage />} />
            <Route path="programas-educativos" element={<ProgramasEducativosPage />} />
            <Route path="matricula-formal" element={<MatriculaFormalPage />} />
            <Route path="infraestructura" element={<InfraestructuraPage />} />
            <Route path="release-notes" element={<ReleaseNotesPage />} />
            <Route path="logout" element={<LogoutRoute />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
