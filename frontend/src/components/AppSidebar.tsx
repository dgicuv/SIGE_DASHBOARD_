import type { ComponentType } from "react";
import { ChevronUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export type NavItem = {
  title: string;
  icon: ComponentType;
  key: string;
};

type Props = {
  navMain: NavItem[];
  navBottom?: NavItem[];
};

function itemPath(key: string) {
  return key === "general" ? "/" : `/${key}`;
}

export function AppSidebar({ navMain, navBottom }: Props) {
  const location = useLocation();
  const currentKey = location.pathname === "/" ? "general" : location.pathname.slice(1);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold shrink-0">
                 UV
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-semibold text-sm">SIGE</span>
                <span className="text-xs text-muted-foreground">Gerencial</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    render={<Link to={itemPath(item.key)} />}
                    isActive={currentKey === item.key}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navBottom && navBottom.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navBottom.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        render={<Link to={itemPath(item.key)} />}
                        isActive={currentKey === item.key}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar className="size-8 rounded-lg shrink-0">
                  <AvatarFallback className="rounded-lg text-xs">
                    RP
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col leading-none text-left overflow-hidden">
                  <span className="truncate text-sm font-medium">
                    Rulo Pimentel
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    rulopimentel@gmail.com
                  </span>
                </div>
                <ChevronUp className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuItem render={<Link to="/logout" />}>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
