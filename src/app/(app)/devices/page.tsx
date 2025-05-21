
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DeviceList } from '@/components/devices/device-list';
import { AddDeviceModal } from '@/components/devices/add-device-modal';
import { EditDeviceModal } from '@/components/devices/edit-device-modal';
import { DeleteDeviceConfirmationModal } from '@/components/devices/delete-device-confirmation-modal'; // Added
import type { Device } from '@/types';
import { useToast } from '@/hooks/use-toast'; // Added

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
  const [isEditDeviceModalOpen, setIsEditDeviceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Added
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null); // Added
  const [devices, setDevices] = useState<Device[]>([]);
  const { toast } = useToast(); // Added

  useEffect(() => {
    // Simulate loading devices, e.g., from localStorage if we were persisting
    setDevices(initialMockDevices);
  }, []);

  const handleDeviceAdd = (newDeviceData: Omit<Device, 'id' | 'status' | 'isOnline' | 'lastSeen' | 'controllable' | 'settings' | 'icon' | 'value'> & {type: 'light' | 'thermostat' | 'blinds' | 'sensor' | 'camera' | 'speaker'}) => {
    const newDevice: Device = {
      ...newDeviceData,
      id: String(devices.length + 1 + Date.now()), // Simple unique ID
      status: newDeviceData.type === 'light' || newDeviceData.type === 'blinds' ? 'off' : 'inactive', // Default status
      isOnline: true,
      lastSeen: 'Just now',
      controllable: ['light', 'thermostat', 'blinds', 'speaker'].includes(newDeviceData.type), // Default controllability
      settings: newDeviceData.type === 'light' ? { brightness: 50 } : newDeviceData.type === 'thermostat' ? { temperature: 22 } : {},
    };
    setDevices(prevDevices => [...prevDevices, newDevice]);
  };

  const handleOpenEditModal = (device: Device) => {
    setEditingDevice(device);
    setIsEditDeviceModalOpen(true);
  };

  const handleDeviceUpdate = (updatedDeviceData: Pick<Device, 'id' | 'name' | 'room' | 'type'>) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === updatedDeviceData.id ? { ...device, ...updatedDeviceData } : device
      )
    );
    setEditingDevice(null);
  };

  const handleOpenDeleteModal = (device: Device) => { // Added
    setDeletingDevice(device);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => { // Added
    if (deletingDevice) {
      setDevices(prevDevices => prevDevices.filter(device => device.id !== deletingDevice.id));
      toast({
        title: 'Device Deleted',
        description: `${deletingDevice.name} has been removed.`,
        variant: 'destructive',
      });
      setDeletingDevice(null);
      setIsDeleteModalOpen(false);
    }
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
      <DeviceList
        devices={devices}
        onEditDevice={handleOpenEditModal}
        onDeleteDevice={handleOpenDeleteModal} // Added
      />
      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onOpenChange={setIsAddDeviceModalOpen}
        onDeviceAdd={handleDeviceAdd}
      />
      {editingDevice && (
        <EditDeviceModal
          isOpen={isEditDeviceModalOpen}
          onOpenChange={setIsEditDeviceModalOpen}
          deviceToEdit={editingDevice}
          onDeviceUpdate={handleDeviceUpdate}
        />
      )}
      {deletingDevice && ( // Added
        <DeleteDeviceConfirmationModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          deviceName={deletingDevice.name}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
