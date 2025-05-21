
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DeviceList } from '@/components/devices/device-list';
import { AddDeviceModal } from '@/components/devices/add-device-modal';
import type { Device } from '@/types';

// Client Components cannot export metadata.
// If you need metadata for this page, it should be defined in a parent Server Component (e.g., layout.tsx)
// export const metadata: Metadata = {
//   title: 'Devices - SmartHaven',
//   description: 'Manage your smart home devices.',
// };

const initialMockDevices: Device[] = [
  { id: "1", name: "Living Room Light", room: "Living Room", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, settings: { brightness: 75 } },
  { id: "2", name: "Kitchen Thermostat", room: "Kitchen", type: "thermostat", status: "22°C", isOnline: true, lastSeen: "Online", controllable: true, settings: { temperature: 22 } },
  { id: "3", name: "Bedroom Blinds", room: "Bedroom", type: "blinds", status: "closed", isOnline: true, lastSeen: "Online", controllable: true },
  { id: "4", name: "Office Light", room: "Office", type: "light", status: "off", isOnline: false, lastSeen: "2 hours ago", controllable: true, settings: { brightness: 50 } },
  { id: "5", name: "Porch Camera", room: "Outdoor", type: "camera", status: "recording", isOnline: true, lastSeen: "Online", controllable: false, value: "Live" },
  { id: "6", name: "Main Speaker", room: "Living Room", type: "speaker", status: "idle", isOnline: true, lastSeen: "Online", controllable: true },
  { id: "7", name: "Door Sensor", room: "Entrance", type: "sensor", status: "closed", isOnline: true, lastSeen: "Online", controllable: false, value: "Closed" },
];


export default function DevicesPage() {
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>(initialMockDevices);

  const handleDeviceAdd = (newDeviceData: Omit<Device, 'id' | 'status' | 'isOnline' | 'lastSeen' | 'controllable' | 'settings' | 'icon' | 'value'> & {type: 'light' | 'thermostat' | 'blinds' | 'sensor' | 'camera' | 'speaker'}) => {
    const newDevice: Device = {
      ...newDeviceData,
      id: String(devices.length + 1 + Date.now()), // Simple unique ID
      status: newDeviceData.type === 'light' || newDeviceData.type === 'blinds' ? 'off' : 'inactive', // Default status
      isOnline: true, 
      lastSeen: 'Just now',
      controllable: true, 
      // settings, icon, value can be added based on type if needed
    };
    setDevices(prevDevices => [...prevDevices, newDevice]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Devices"
        description="View, control, and manage all your connected devices."
        actions={
          <Button onClick={() => setIsAddDeviceModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Device
          </Button>
        }
      />
      <DeviceList devices={devices} />
      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onOpenChange={setIsAddDeviceModalOpen}
        onDeviceAdd={handleDeviceAdd}
      />
    </div>
  );
}
