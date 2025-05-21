
'use client';

import { useState, useEffect } from 'react'; // Removed useMemo
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DeviceList } from '@/components/devices/device-list';
import { AddDeviceModal } from '@/components/devices/add-device-modal';
import { EditDeviceModal } from '@/components/devices/edit-device-modal';
import { DeleteDeviceConfirmationModal } from '@/components/devices/delete-device-confirmation-modal';
import type { Device } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const { toast } = useToast();

  // Load devices from localStorage on mount
  useEffect(() => {
    try {
      const storedDevices = localStorage.getItem('smartHavenDevices');
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      } else {
        setDevices(initialMockDevices);
      }
    } catch (error) {
      console.error("Failed to load devices from localStorage:", error);
      setDevices(initialMockDevices); // Fallback to mock data
    }
  }, []);

  // Save devices to localStorage whenever they change
  useEffect(() => {
    try {
      if (devices.length > 0 || localStorage.getItem('smartHavenDevices')) { 
         localStorage.setItem('smartHavenDevices', JSON.stringify(devices));
      }
    } catch (error) {
      console.error("Failed to save devices to localStorage:", error);
    }
  }, [devices]);

  // availableRooms useMemo removed as modals will fetch rooms from localStorage directly

  const handleDeviceAdd = (newDeviceData: Omit<Device, 'id' | 'status' | 'isOnline' | 'lastSeen' | 'controllable' | 'settings' | 'icon' | 'value'> & {type: 'light' | 'thermostat' | 'blinds' | 'sensor' | 'camera' | 'speaker' | 'other'}) => {
    const newDevice: Device = {
      ...newDeviceData,
      id: String(devices.length + 1 + Date.now()), 
      status: (newDeviceData.type === 'light' || newDeviceData.type === 'blinds') ? 'off' : 'inactive',
      isOnline: true,
      lastSeen: 'Just now',
      controllable: newDeviceData.type === 'other' ? false : ['light', 'thermostat', 'blinds', 'speaker'].includes(newDeviceData.type),
      settings: newDeviceData.type === 'light' ? { brightness: 50 } : newDeviceData.type === 'thermostat' ? { temperature: 22 } : {},
    };
    setDevices(prevDevices => [...prevDevices, newDevice]);
    toast({
      title: 'Device Added',
      description: `${newDevice.name} has been added to ${newDevice.room}.`,
    });
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
    toast({
      title: 'Device Updated',
      description: `${updatedDeviceData.name} has been updated.`,
    });
  };

  const handleOpenDeleteModal = (device: Device) => {
    setDeletingDevice(device);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
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
        onDeleteDevice={handleOpenDeleteModal}
      />
      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onOpenChange={setIsAddDeviceModalOpen}
        onDeviceAdd={handleDeviceAdd}
        // availableRooms prop removed
      />
      {editingDevice && (
        <EditDeviceModal
          isOpen={isEditDeviceModalOpen}
          onOpenChange={setIsEditDeviceModalOpen}
          deviceToEdit={editingDevice}
          onDeviceUpdate={handleDeviceUpdate}
          // availableRooms prop removed
        />
      )}
      {deletingDevice && (
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
