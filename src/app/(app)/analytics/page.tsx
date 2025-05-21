import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EnergyUsageChart } from '@/components/dashboard/energy-usage-chart'; // Re-using for overall trend
import { EnergyBreakdownChart } from '@/components/analytics/energy-breakdown-chart';
import { DeviceUsageTable } from '@/components/analytics/device-usage-table';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Analytics - SmartHaven',
  description: 'Analyze your smart home energy consumption and system activity.',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Smart Home Analytics" 
        description="Gain insights into your energy usage and device activity."
        actions={
          <Button variant="outline" asChild>
            <Link href="/logs">
              <FileText className="mr-2 h-4 w-4" /> View Full Logs
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <EnergyBreakdownChart />
        <EnergyUsageChart /> {/* Shows overall trend, could be a different detailed chart */}
      </div>
      
      <div>
        <DeviceUsageTable />
      </div>
      
      {/* Placeholder for activity feed or event timeline */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Recent Activity Highlights</h2>
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><span className="font-medium text-foreground">Living Room Light</span> turned on at 7:00 PM.</li>
            <li><span className="font-medium text-foreground">"Movie Night"</span> scene activated.</li>
            <li><span className="font-medium text-foreground">Kitchen Thermostat</span> set to 20°C.</li>
            <li>Energy consumption peak detected at 8:30 PM.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
