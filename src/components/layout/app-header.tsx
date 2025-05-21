
"use client";

import Link from "next/link";
import {
  Bell,
  Search,
  UserCircle,
  LogOut,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/settings/theme-switcher";
import { useAuth } from "@/contexts/auth-context";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";
import { useIsMobile } from "@/hooks/use-mobile"; // Added

export function AppHeader() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile(); // Added

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Show SidebarTrigger only on desktop/tablet if sidebar is collapsible, hide on mobile */}
        {!isMobile && (
          <div className="md:hidden"> {/* This would be for tablet if sidebar can be triggered */}
             {/* <SidebarTrigger />  // Potentially keep for tablet, but for now, let's simplify to only desktop sidebar */}
          </div>
        )}
         <Link href="/dashboard" aria-label="SmartHaven Home" className="flex items-center">
            <Logo className="h-8" />
         </Link>
      </div>
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..." // Simplified placeholder
              className="pl-8 sm:w-[200px] md:w-[200px] lg:w-[300px] bg-card"
            />
          </div>
        </form>
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.name ? `https://avatar.vercel.sh/${user.name}.png` : undefined} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutGrid className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
