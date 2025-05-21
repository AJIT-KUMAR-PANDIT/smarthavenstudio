
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNavigationBar } from '@/components/layout/bottom-navigation'; // Added
import { useIsMobile } from '@/hooks/use-mobile'; // Added
import {
  SidebarProvider,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Added

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPinSet } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile(); // Added

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isPinSet) {
        router.push('/set-pin');
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isPinSet, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {!isMobile && <AppSidebar />} 
      {!isMobile && <SidebarRail />} 
      <div className={cn(
        "flex flex-col flex-1 min-h-screen overflow-x-hidden overflow-y-auto", 
        isMobile && "pb-16"
      )}>
        <AppHeader />
        <SidebarInset>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
      {isMobile && <BottomNavigationBar />} {/* Added */}
    </SidebarProvider>
  );
}
