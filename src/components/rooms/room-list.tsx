
"use client";

import type { Room } from "@/types";
import { RoomCard } from "./room-card";
// Mock data is now managed by the parent page component.
// import { Armchair, BedDouble, CookingPot, Bath, LampDesk, TreePalm } from "lucide-react";

interface RoomListProps {
  rooms: Room[];
}

export function RoomList({ rooms }: RoomListProps) {
   if (rooms.length === 0) {
     return <p className="text-muted-foreground text-center py-10">No rooms configured yet. Click &quot;Add Room&quot; to get started.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
