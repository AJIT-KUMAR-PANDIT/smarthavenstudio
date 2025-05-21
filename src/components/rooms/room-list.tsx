
"use client";

import type { Room } from "@/types";
import { RoomCard } from "./room-card";

interface RoomListProps {
  rooms: Room[];
  onEditRoom?: (room: Room) => void; // Added onEditRoom prop
}

export function RoomList({ rooms, onEditRoom }: RoomListProps) { // Added onEditRoom to props
   if (rooms.length === 0) {
     return <p className="text-muted-foreground text-center py-10">No rooms configured yet. Click &quot;Add Room&quot; to get started.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onEdit={onEditRoom} /> // Pass onEditRoom to RoomCard
      ))}
    </div>
  );
}
