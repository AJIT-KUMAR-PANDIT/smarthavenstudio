"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react'; // Added useState here
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPinSet } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Changed React.useState to useState

  useEffect(() => {
    // Give a moment for auth state to initialize from localStorage
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isPinSet) {
        router.push('/set-pin');
      } else {
        setIsLoading(false);
      }
    }, 100); // Adjust delay as needed, or use a more robust loading state mechanism

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
      <AppSidebar />
      <SidebarRail />
      <div className="flex flex-col flex-1 min-h-screen">
        <AppHeader />
        <SidebarInset>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
