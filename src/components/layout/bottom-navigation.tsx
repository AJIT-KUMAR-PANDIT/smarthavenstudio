
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clapperboard, Mic, ToggleRight, Menu as MenuIcon, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { MobileMenuSheetContent } from "./mobile-menu-sheet"; // We'll create this next

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  pathname: string;
}

const NavLink = ({ href, icon: Icon, label, pathname }: NavLinkProps) => {
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "flex flex-col items-center justify-center h-16 w-full rounded-none p-1 text-xs",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <Link href={href}>
        <Icon className="h-5 w-5 mb-0.5" />
        {label}
      </Link>
    </Button>
  );
};

export function BottomNavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/scenes", icon: Clapperboard, label: "Scenes" },
  ];

  const secondaryNavItems = [
    { href: "/devices", icon: ToggleRight, label: "Devices" },
    // Placeholder for Menu button - will be a SheetTrigger
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-background shadow-top md:hidden">
      {navItems.map((item) => (
        <NavLink key={item.href} {...item} pathname={pathname} />
      ))}

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-16 w-full rounded-none p-1 text-xs text-primary hover:bg-primary/10 relative -top-3 bg-background rounded-full aspect-square w-14 h-14 border-4 border-background shadow-lg"
        onClick={() => alert("Mic button clicked (feature placeholder)")}
        aria-label="Voice command"
      >
        <Mic className="h-6 w-6" />
        <span className="mt-0.5 text-[10px]">Speak</span>
      </Button>

      {secondaryNavItems.map((item) => (
        <NavLink key={item.href} {...item} pathname={pathname} />
      ))}
      
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-16 w-full rounded-none p-1 text-xs text-muted-foreground"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5 mb-0.5" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] flex flex-col p-0">
            <MobileMenuSheetContent />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
