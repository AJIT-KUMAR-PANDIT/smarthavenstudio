import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DeviceList } from '@/components/devices/device-list';

export const metadata: Metadata = {
  title: 'Devices - SmartHaven',
  description: 'Manage your smart home devices.',
};

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Devices" 
        description="View, control, and manage all your connected devices."
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Device
          </Button>
        }
      />
      <DeviceList />
    </div>
  );
}
