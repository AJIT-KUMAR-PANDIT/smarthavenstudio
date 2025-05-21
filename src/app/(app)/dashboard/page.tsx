import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { EnergyUsageChart } from '@/components/dashboard/energy-usage-chart';
import { ActiveSceneCard } from '@/components/dashboard/active-scene-card';
import { Lightbulb, Thermometer, Tv, ShieldAlert, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard - SmartHaven',
  description: 'Overview of your smart home.',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Welcome to your SmartHaven control center."
        actions={<Button asChild><Link href="/scenes/new">Create Scene</Link></Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Active Devices" value="12" icon={Lightbulb} footer="+2 since last week" />
        <SummaryCard title="Avg. Temperature" value="22°C" icon={Thermometer} footer="Living Room: 23°C" />
        <SummaryCard title="Scenes Active" value="1" icon={Tv} footer="Movie Night" />
        <SummaryCard title="Security Alerts" value="0" icon={ShieldAlert} className="bg-green-500/10 dark:bg-green-500/20 border-green-500" footer="System Secure" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <EnergyUsageChart />
        </div>
        <div className="lg:col-span-3">
          <ActiveSceneCard />
        </div>
      </div>

      {/* Placeholder for recent activity or quick actions */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col">
            <Lightbulb className="h-6 w-6 mb-1" />
            All Lights On
          </Button>
           <Button variant="outline" className="h-20 flex-col">
            <Lightbulb className="h-6 w-6 mb-1 opacity-50" />
            All Lights Off
          </Button>
           <Button variant="outline" className="h-20 flex-col">
            <Tv className="h-6 w-6 mb-1" />
            Good Morning
          </Button>
           <Button variant="outline" className="h-20 flex-col">
            <Moon className="h-6 w-6 mb-1" />
            Good Night
          </Button>
        </div>
      </div>
    </div>
  );
}
