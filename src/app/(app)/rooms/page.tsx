import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { RoomList } from '@/components/rooms/room-list';

export const metadata: Metadata = {
  title: 'Rooms - SmartHaven',
  description: 'Manage and organize your smart home rooms.',
};

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Rooms" 
        description="Organize your devices by rooms for easier control."
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Room
          </Button>
        }
      />
      <RoomList />
    </div>
  );
}
