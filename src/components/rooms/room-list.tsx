"use client";

import type { Room } from "@/types";
import { RoomCard } from "./room-card";
import { Armchair, BedDouble, CookingPot, Bath, LampDesk, TreePalm } from "lucide-react";

const mockRooms: Room[] = [
  { 
    id: "1", 
    name: "Living Room", 
    devices: [
      { id: "1", name: "Main Light", room: "Living Room", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, value: 75 },
      { id: "2", name: "Smart TV", room: "Living Room", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true }, // Representing TV as a controllable "light" for simplicity
      { id: "6", name: "Room Thermostat", room: "Living Room", type: "thermostat", status: "22°C", value: "22°C", isOnline: true, lastSeen: "Online", controllable: true },
    ], 
    backgroundImage: "https://placehold.co/600x400/673AB7/FFFFFF.png?text=Living+Room",
    icon: Armchair,
  },
  { 
    id: "2", 
    name: "Bedroom", 
    devices: [
      { id: "3", name: "Bedside Lamp", room: "Bedroom", type: "light", status: "off", isOnline: true, lastSeen: "Online", controllable: true },
      { id: "4", name: "Blinds", room: "Bedroom", type: "blinds", status: "closed", isOnline: true, lastSeen: "Online", controllable: true },
    ], 
    backgroundImage: "https://placehold.co/600x400/3F51B5/FFFFFF.png?text=Bedroom",
    icon: BedDouble,
  },
  { 
    id: "3", 
    name: "Kitchen", 
    devices: [
      { id: "5", name: "Overhead Lights", room: "Kitchen", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, value: 100 },
      { id: "7", name: "Fridge Sensor", room: "Kitchen", type: "sensor", status: "4°C", value: "4°C", isOnline: true, lastSeen: "Online", controllable: false },
    ], 
    backgroundImage: "https://placehold.co/600x400/4CAF50/FFFFFF.png?text=Kitchen",
    icon: CookingPot,
  },
   { 
    id: "4", 
    name: "Office", 
    devices: [
      { id: "8", name: "Desk Lamp", room: "Office", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, value: 60 },
      { id: "9", name: "Air Purifier", room: "Office", type: "sensor", status: "active", value: "AQI: 15", isOnline: true, lastSeen: "Online", controllable: true }, // Air purifier as controllable sensor
    ], 
    backgroundImage: "https://placehold.co/600x400/FFC107/000000.png?text=Office",
    icon: LampDesk,
  },
];


export function RoomList() {
   if (mockRooms.length === 0) {
     return <p className="text-muted-foreground">No rooms configured yet. Click &quot;Add Room&quot; to get started.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mockRooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
