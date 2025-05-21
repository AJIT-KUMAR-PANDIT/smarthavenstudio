import type { SVGProps } from 'react';
import React from 'react';
import { Home } from 'lucide-react';

export function Logo({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <Home className="h-8 w-8 text-primary" />
      <span className="ml-2 text-2xl font-bold text-foreground">
        SmartHaven
      </span>
    </div>
  );
}
