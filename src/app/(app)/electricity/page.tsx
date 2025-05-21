import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Electricity Usage - SmartHaven',
  description: 'Detailed electricity consumption data and insights.',
};

// This page can be expanded with more specific electricity-focused charts and data.
// For now, it can redirect or show a summary from the main analytics.

export default function ElectricityPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Electricity Insights" 
        description="Track and analyze your home's electricity consumption in detail."
      />
      
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertTitle>Detailed View</AlertTitle>
        <AlertDescription>
          This section provides a deep dive into your electricity usage. For a general overview, please visit the <Button variant="link" asChild className="p-0 h-auto"><Link href="/analytics">Analytics Dashboard</Link></Button>.
        </AlertDescription>
      </Alert>

      {/* Placeholder for electricity-specific components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Real-time Consumption</h3>
          <p className="text-4xl font-bold text-primary">1.2 kWh</p>
          <p className="text-sm text-muted-foreground">Current draw</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Daily Peak</h3>
          <p className="text-4xl font-bold">3.5 kWh</p>
          <p className="text-sm text-muted-foreground">Today at 8:00 PM</p>
        </div>
      </div>
       <div className="mt-6 p-6 bg-card rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Cost Savings Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Utilize smart scheduling for high-energy appliances.</li>
            <li>Switch to LED lighting for significant energy reduction.</li>
            <li>Ensure your home is well-insulated to reduce HVAC load.</li>
          </ul>
        </div>
    </div>
  );
}
