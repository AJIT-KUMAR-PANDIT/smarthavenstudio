
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
import { Logo } from "@/components/ui/logo";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      {/* Logo Section - hidden on mobile, flex on md+ */}
      <Link href="/dashboard" aria-label="SmartHaven Home" className="hidden md:flex items-center flex-shrink-0">
        <Logo className="h-8" />
      </Link>

      {/* Search and Actions Section - takes remaining space and pushes content to its end */}
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4 min-w-0"> {/* Added min-w-0 */}
        {/* Search Form - adaptive width */}
        <form className="relative w-full max-w-xs sm:w-auto sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-full bg-card"
          />
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
