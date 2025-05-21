
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { RoomList } from '@/components/rooms/room-list';
import { AddRoomModal } from '@/components/rooms/add-room-modal';
import { EditRoomModal } from '@/components/rooms/edit-room-modal';
import { DeleteRoomConfirmationModal } from '@/components/rooms/delete-room-confirmation-modal'; // Added
import type { Room } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { getIconComponentByName } from '@/components/rooms/add-room-form';

const initialMockRooms: Room[] = [
  { 
    id: "1", 
    name: "Living Room", 
    iconName: "Armchair",
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
    devices: [
      { id: "8", name: "Desk Lamp", room: "Office", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, value: 60 },
      { id: "9", name: "Air Purifier", room: "Office", type: "sensor", status: "active", value: "AQI: 15", isOnline: true, lastSeen: "Online", controllable: true },
    ], 
    backgroundImage: "https://placehold.co/600x400.png",
  },
];


export default function RoomsPage() {
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isDeleteRoomModalOpen, setIsDeleteRoomModalOpen] = useState(false); // Added
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null); // Added
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (rooms.length === 0) { 
       setRooms(initialMockRooms.map(room => ({
        ...room,
        icon: getIconComponentByName(room.iconName),
        backgroundImage: room.backgroundImage || `https://placehold.co/600x400.png` // Ensure bg image
       })));
    }
  }, [rooms.length]); // Added rooms.length to dependency array

  const handleRoomAdd = (newRoomData: Omit<Room, 'id' | 'devices' | 'icon'>) => {
    const newRoom: Room = {
      ...newRoomData,
      id: String(rooms.length + 1 + Date.now()), 
      devices: [], 
      icon: getIconComponentByName(newRoomData.iconName),
      backgroundImage: newRoomData.backgroundImage || `https://placehold.co/600x400.png`, 
    };
    setRooms(prevRooms => [...prevRooms, newRoom]);
    toast({
      title: 'Room Created',
      description: `${newRoom.name} has been successfully created.`,
    });
  };

  const handleOpenEditModal = (room: Room) => {
    setEditingRoom(room);
    setIsEditRoomModalOpen(true);
  };

  const handleRoomUpdate = (updatedRoomData: Omit<Room, 'devices' | 'icon'>) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === updatedRoomData.id ? { ...room, ...updatedRoomData, icon: getIconComponentByName(updatedRoomData.iconName), backgroundImage: updatedRoomData.backgroundImage || room.backgroundImage } : room
      )
    );
    setEditingRoom(null);
    toast({
      title: 'Room Updated',
      description: `${updatedRoomData.name} has been successfully updated.`,
    });
  };

  const handleOpenDeleteModal = (room: Room) => { // Added
    setDeletingRoom(room);
    setIsDeleteRoomModalOpen(true);
  };

  const handleConfirmDeleteRoom = () => { // Added
    if (deletingRoom) {
      setRooms(prevRooms => prevRooms.filter(room => room.id !== deletingRoom.id));
      toast({
        title: 'Room Deleted',
        description: `${deletingRoom.name} has been removed.`,
        variant: 'destructive',
      });
      setDeletingRoom(null);
      setIsDeleteRoomModalOpen(false);
    }
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
      <RoomList 
        rooms={rooms} 
        onEditRoom={handleOpenEditModal} 
        onDeleteRoom={handleOpenDeleteModal} // Added
      />
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onOpenChange={setIsAddRoomModalOpen}
        onRoomAdd={handleRoomAdd}
      />
      {editingRoom && (
        <EditRoomModal
          isOpen={isEditRoomModalOpen}
          onOpenChange={setIsEditRoomModalOpen}
          roomToEdit={editingRoom}
          onRoomUpdate={handleRoomUpdate}
        />
      )}
      {deletingRoom && ( // Added
        <DeleteRoomConfirmationModal
          isOpen={isDeleteRoomModalOpen}
          onOpenChange={setIsDeleteRoomModalOpen}
          roomName={deletingRoom.name}
          onConfirmDelete={handleConfirmDeleteRoom}
        />
      )}
    </div>
  );
}
