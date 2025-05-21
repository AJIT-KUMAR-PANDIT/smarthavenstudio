"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isPinSet } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Delay check to allow AuthProvider to initialize
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        if (isPinSet) {
          router.replace('/dashboard');
        } else {
          router.replace('/set-pin');
        }
      } else {
        router.replace('/login');
      }
      // setIsLoading(false); // Not strictly needed if redirect happens fast
    }, 100); // Small delay for auth state to load

    return () => clearTimeout(timer);
  }, [isAuthenticated, isPinSet, router]);
  
  // Render a loading state or null while checking auth and redirecting
  return (
     <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-xl text-foreground">Loading SmartHaven...</p>
      </div>
  );
}
