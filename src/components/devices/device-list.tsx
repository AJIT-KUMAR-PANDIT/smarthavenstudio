"use client";

import type { Device } from "@/types";
import { DeviceCard } from "./device-card";
import { Lightbulb, Thermometer, VenetianBlinds, Speaker, Video, Router } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockDevices: Device[] = [
  { id: "1", name: "Living Room Light", room: "Living Room", type: "light", status: "on", isOnline: true, lastSeen: "Online", controllable: true, settings: { brightness: 75 } },
  { id: "2", name: "Kitchen Thermostat", room: "Kitchen", type: "thermostat", status: "22°C", isOnline: true, lastSeen: "Online", controllable: true, settings: { temperature: 22 } },
  { id: "3", name: "Bedroom Blinds", room: "Bedroom", type: "blinds", status: "closed", isOnline: true, lastSeen: "Online", controllable: true },
  { id: "4", name: "Office Light", room: "Office", type: "light", status: "off", isOnline: false, lastSeen: "2 hours ago", controllable: true, settings: { brightness: 50 } },
  { id: "5", name: "Porch Camera", room: "Outdoor", type: "camera", status: "recording", isOnline: true, lastSeen: "Online", controllable: false, value: "Live" },
  { id: "6", name: "Main Speaker", room: "Living Room", type: "speaker", status: "idle", isOnline: true, lastSeen: "Online", controllable: true },
  { id: "7", name: "Door Sensor", room: "Entrance", type: "sensor", status: "closed", isOnline: true, lastSeen: "Online", controllable: false, value: "Closed" },
];

export function DeviceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const handleToggle = (id: string, status: boolean) => {
    console.log(`Device ${id} toggled to ${status ? 'on' : 'off'}`);
    // Update device state here
  };
  
  const handleSettingChange = (id: string, setting: string, value: any) => {
    console.log(`Device ${id} setting ${setting} changed to ${value}`);
    // Update device settings here
  };

  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = filterRoom === "all" || device.room === filterRoom;
    const matchesType = filterType === "all" || device.type === filterType;
    return matchesSearch && matchesRoom && matchesType;
  });
  
  const rooms = ["all", ...Array.from(new Set(mockDevices.map(d => d.room)))];
  const types = ["all", ...Array.from(new Set(mockDevices.map(d => d.type)))];


  if (filteredDevices.length === 0 && mockDevices.length > 0) {
    return <p className="text-muted-foreground">No devices match your filters. Try adjusting your search.</p>;
  }
  
  if (mockDevices.length === 0) {
     return <p className="text-muted-foreground">No devices added yet. Click &quot;Add Device&quot; to get started.</p>;
  }


  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="Search devices by name or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-card"
        />
        <Select value={filterRoom} onValueChange={setFilterRoom}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card">
            <SelectValue placeholder="Filter by room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => <SelectItem key={room} value={room}>{room === "all" ? "All Rooms" : room}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {types.map(type => <SelectItem key={type} value={type}>{type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDevices.map((device) => (
          <DeviceCard key={device.id} device={device} onToggle={handleToggle} onSettingChange={handleSettingChange} />
        ))}
      </div>
    </div>
  );
}
