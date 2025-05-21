
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { NavItem } from "@/config/nav";
import { mainNavItems, secondaryNavItems, userNavItems } from "@/config/nav";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";

interface MobileMenuNavLinkProps {
  item: NavItem;
  pathname: string;
  onClose?: () => void;
}

const MobileMenuNavLink = ({ item, pathname, onClose }: MobileMenuNavLinkProps) => {
  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  const Icon = item.icon;

  if (item.items && item.items.length > 0) {
    return (
      <div>
        <span className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-5 w-5" />
          {item.title}
        </span>
        <div className="pl-8">
          {item.items.map(subItem => (
            <MobileMenuNavLink key={subItem.href} item={subItem} pathname={pathname} onClose={onClose} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <SheetClose asChild>
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-foreground"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className="h-5 w-5" />
        <span>{item.title}</span>
        {item.label && (
          <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-sm">
            {item.label}
          </span>
        )}
      </Link>
    </SheetClose>
  );
};


export function MobileMenuSheetContent() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const renderNavSection = (items: NavItem[], title?: string) => (
    <div className="space-y-1">
      {title && <h4 className="px-3 py-2 text-sm font-semibold text-muted-foreground">{title}</h4>}
      {items.map((item) => (
        <MobileMenuNavLink key={item.href} item={item} pathname={pathname} />
      ))}
    </div>
  );

  return (
    <>
      <SheetHeader className="p-4 border-b">
        <SheetTitle><Logo /></SheetTitle>
      </SheetHeader>
      <ScrollArea className="flex-1 p-4">
        <nav className="grid gap-4">
          {renderNavSection(mainNavItems, "Main Menu")}
          <Separator />
          {renderNavSection(secondaryNavItems, "Overview")}
          <Separator />
          {renderNavSection(userNavItems, "Account")}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <SheetClose asChild>
        <Button variant="outline" onClick={logout} className="w-full">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
        </SheetClose>
      </div>
    </>
  );
}
