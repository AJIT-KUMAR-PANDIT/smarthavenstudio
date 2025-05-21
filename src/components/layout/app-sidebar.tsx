"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/nav";
import { mainNavItems, secondaryNavItems, userNavItems } from "@/config/nav";
import { Logo } from "@/components/ui/logo";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth-context";
import { LogOut } from "lucide-react";

interface AppSidebarProps {
  className?: string;
}

export function AppSidebar({ className }: AppSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const renderNavItems = (items: NavItem[], isSubMenu = false) => {
    return items.map((item) => {
      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
      const MenuButtonComponent = isSubMenu ? SidebarMenuSubButton : SidebarMenuButton;
      
      if (item.items && item.items.length > 0) {
        return (
          <SidebarMenuItem key={item.href}>
            <MenuButtonComponent
              asChild={!isSubMenu}
              // @ts-ignore // TODO: Fix type for asChild compatibility
              href={isSubMenu ? item.href : undefined}
              isActive={isActive}
              // @ts-ignore
              onClick={isSubMenu ? undefined : (e: React.MouseEvent<HTMLButtonElement>) => {
                // Basic toggle for sub-menu, a more robust solution might be needed
                const subMenu = e.currentTarget.nextElementSibling;
                if (subMenu) {
                  subMenu.classList.toggle('hidden'); // Or use state for controlled component
                }
              }}
              tooltip={item.title}
            >
              {isSubMenu ? (
                <Link href={item.href} className="flex w-full items-center gap-2">
                  <item.icon /> <span>{item.title}</span>
                </Link>
              ) : (
                <>
                  <item.icon /> <span>{item.title}</span>
                </>
              )}
            </MenuButtonComponent>
            <SidebarMenuSub className={isActive ? "" : "hidden"}> {/* Initial state based on active */}
              {item.items.map(subItem => (
                <SidebarMenuSubItem key={subItem.href}>
                  <SidebarMenuSubButton 
                    asChild 
                    href={subItem.href} 
                    isActive={pathname === subItem.href || pathname.startsWith(subItem.href)}
                    tooltip={subItem.title}
                  >
                    <Link href={subItem.href}>
                      <subItem.icon /> <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
        );
      }

      return (
        <SidebarMenuItem key={item.href}>
          <MenuButtonComponent
            asChild
            href={item.href}
            isActive={isActive}
            tooltip={item.title}
          >
            <Link href={item.href}>
              <item.icon /> <span>{item.title}</span>
              {item.label && (
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                  {item.label}
                </span>
              )}
            </Link>
          </MenuButtonComponent>
        </SidebarMenuItem>
      );
    });
  };


  return (
    <Sidebar
      side="left"
      variant="sidebar" 
      collapsible="icon"
      className={cn("border-r", className)}
    >
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarMenu>{renderNavItems(mainNavItems)}</SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarMenu>{renderNavItems(secondaryNavItems)}</SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
           <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu>{renderNavItems(userNavItems)}</SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>
      <SidebarFooter className="p-4 border-t">
        <Button variant="ghost" onClick={logout} className="w-full justify-start group-data-[collapsible=icon]:justify-center">
          <LogOut className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
