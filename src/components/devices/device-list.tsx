
"use client";

import type { Device } from "@/types";
import { DeviceCard } from "./device-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeviceListProps {
  devices: Device[];
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (device: Device) => void; 
}

export function DeviceList({ devices, onEditDevice, onDeleteDevice }: DeviceListProps) { 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const handleToggle = (id: string, status: boolean) => {
    console.log(`Device ${id} toggled to ${status ? 'on' : 'off'}`);
    // In a real app, this would typically involve updating the state in the parent component (`DevicesPage`)
    // or calling an API to update the device status. For now, it's just a console log.
  };

  const handleSettingChange = (id: string, setting: string, value: any) => {
    console.log(`Device ${id} setting ${setting} changed to ${value}`);
    // Similar to handleToggle, this would update state or call an API.
  };

  const filteredDevices = devices.filter(device => {
    const nameMatch = device.name.toLowerCase().includes(searchTerm.toLowerCase());
    const roomMatch = device.room.toLowerCase().includes(searchTerm.toLowerCase());
    const searchMatch = nameMatch || roomMatch;

    const roomFilterMatch = filterRoom === "all" || device.room === filterRoom;
    const typeFilterMatch = filterType === "all" || device.type === filterType;

    return searchMatch && roomFilterMatch && typeFilterMatch;
  });

  const rooms = ["all", ...Array.from(new Set(devices.map(d => d.room))).sort()];
  const types = ["all", ...Array.from(new Set(devices.map(d => d.type))).sort()];

  if (devices.length === 0) {
     return <p className="text-muted-foreground text-center py-10">No devices added yet. Click &quot;Add Device&quot; to get started.</p>;
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4 sm:overflow-x-auto py-1">
        <Input
          placeholder="Search devices by name or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm bg-card flex-shrink-0"
        />
        <Select value={filterRoom} onValueChange={setFilterRoom}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card flex-shrink-0">
            <SelectValue placeholder="Filter by room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => <SelectItem key={room} value={room}>{room === "all" ? "All Rooms" : room}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card flex-shrink-0">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {types.map(type => <SelectItem key={type} value={type}>{type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      
      {filteredDevices.length === 0 && devices.length > 0 ? (
         <p className="text-muted-foreground text-center py-10">No devices match your current filters. Try adjusting your search or filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={handleToggle}
              onSettingChange={handleSettingChange}
              onEdit={() => onEditDevice(device)}
              onDelete={() => onDeleteDevice(device)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
