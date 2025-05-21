
"use client";

import type { Room } from "@/types";
import { RoomCard } from "./room-card";

interface RoomListProps {
  rooms: Room[];
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (room: Room) => void; 
}

export function RoomList({ rooms, onEditRoom, onDeleteRoom }: RoomListProps) {
   if (rooms.length === 0) {
     return <p className="text-muted-foreground text-center py-10">No rooms configured yet. Click &quot;Add Room&quot; to get started.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard 
            key={room.id} 
            room={room} 
            onEdit={onEditRoom} 
            onDelete={onDeleteRoom}
        />
      ))}
    </div>
  );
}
