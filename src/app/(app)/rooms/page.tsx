
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Armchair, BedDouble, CookingPot, LampDesk } from 'lucide-react';
import { RoomList } from '@/components/rooms/room-list';
import { AddRoomModal } from '@/components/rooms/add-room-modal';
import type { Room } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getIconComponentByName } from '@/components/rooms/add-room-form';

// Metadata removed as this is now a client component
// export const metadata: Metadata = {
//   title: 'Rooms - SmartHaven',
//   description: 'Manage and organize your smart home rooms.',
// };

const initialMockRooms: Room[] = [
  { 
    id: "1", 
    name: "Living Room", 
    iconName: "Armchair",
    icon: Armchair,
    devices: [
      { id: "1", name: "Main Light", room: "Living Room", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, value: 75 },
      { id: "2", name: "Smart TV", room: "Living Room", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true },
      { id: "6", name: "Room Thermostat", room: "Living Room", type: "thermostat", status: "22°C", value: "22°C", isOnline: true, lastSeen: "Online", controllable: true },
    ], 
    backgroundImage: "https://placehold.co/600x400.png",
  },
  { 
    id: "2", 
    name: "Bedroom", 
    iconName: "BedDouble",
    icon: BedDouble,
    devices: [
      { id: "3", name: "Bedside Lamp", room: "Bedroom", type: "light", status: "off", isOnline: true, lastSeen: "Online", controllable: true },
      { id: "4", name: "Blinds", room: "Bedroom", type: "blinds", status: "closed", isOnline: true, lastSeen: "Online", controllable: true },
    ], 
    backgroundImage: "https://placehold.co/600x400.png",
  },
  { 
    id: "3", 
    name: "Kitchen", 
    iconName: "CookingPot",
    icon: CookingPot,
    devices: [
      { id: "5", name: "Overhead Lights", room: "Kitchen", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, value: 100 },
      { id: "7", name: "Fridge Sensor", room: "Kitchen", type: "sensor", status: "4°C", value: "4°C", isOnline: true, lastSeen: "Online", controllable: false },
    ], 
    backgroundImage: "https://placehold.co/600x400.png",
  },
   { 
    id: "4", 
    name: "Office", 
    iconName: "LampDesk",
    icon: LampDesk,
    devices: [
      { id: "8", name: "Desk Lamp", room: "Office", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, value: 60 },
      { id: "9", name: "Air Purifier", room: "Office", type: "sensor", status: "active", value: "AQI: 15", isOnline: true, lastSeen: "Online", controllable: true },
    ], 
    backgroundImage: "https://placehold.co/600x400.png",
  },
];


export default function RoomsPage() {
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading rooms, e.g., from localStorage if persisting
    // For now, populate with mock data if no rooms exist in state
    if (rooms.length === 0) {
       setRooms(initialMockRooms.map(room => ({
        ...room,
        icon: getIconComponentByName(room.iconName)
       })));
    }
  }, []); // Ensure this runs only once on mount

  const handleRoomAdd = (newRoomData: Omit<Room, 'id' | 'devices' | 'icon'>) => {
    const newRoom: Room = {
      ...newRoomData,
      id: String(rooms.length + 1 + Date.now()), // Simple unique ID
      devices: [], // New rooms start with no devices
      icon: getIconComponentByName(newRoomData.iconName),
      // backgroundImage: newRoomData.backgroundImage || `https://placehold.co/600x400.png?text=${encodeURIComponent(newRoomData.name)}`,
      backgroundImage: `https://placehold.co/600x400.png`, // Generic placeholder
    };
    setRooms(prevRooms => [...prevRooms, newRoom]);
    toast({
      title: 'Room Created',
      description: `${newRoom.name} has been successfully created.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Rooms" 
        description="Organize your devices by rooms for easier control."
        actions={
          <Button onClick={() => setIsAddRoomModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Room
          </Button>
        }
      />
      <RoomList rooms={rooms} />
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onOpenChange={setIsAddRoomModalOpen}
        onRoomAdd={handleRoomAdd}
      />
    </div>
  );
}
