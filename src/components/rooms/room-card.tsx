
import type { Room, Device } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoorOpen, Lightbulb, Thermometer, Users, Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getIconComponentByName } from "./add-room-form"; // Import helper

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const Icon = room.icon || getIconComponentByName(room.iconName) || DoorOpen; // Use helper or default
  const onlineDevices = room.devices.filter(d => d.isOnline).length;
  const activeLights = room.devices.filter(d => d.type === 'light' && d.status === 'on').length;
  // A simple heuristic for room activity based on device status
  const isRoomActive = room.devices.some(d => d.status === 'on' || d.status === 'active' || (typeof d.value === 'number' && d.value > 0));


  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      {room.backgroundImage && (
         <div className="relative h-40 w-full">
            <Image 
                src={room.backgroundImage} 
                alt={room.name} 
                fill={true} // Use fill instead of layout
                style={{objectFit: "cover"}} // Use style for objectFit
                className="transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="room interior" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
         </div>
      )}
      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", room.backgroundImage && "relative pt-4 text-white z-10 -mt-16")}>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-6 w-6", room.backgroundImage ? "text-white" : "text-primary")} />
          <CardTitle className={cn("text-xl", room.backgroundImage && "text-white")}>{room.name}</CardTitle>
        </div>
         <Button variant={room.backgroundImage ? "ghost" : "outline"} size="icon" className={cn("h-8 w-8", room.backgroundImage && "text-white hover:bg-white/20")} asChild>
            {/* This link will eventually trigger an EditRoomModal */}
            <Link href={`#edit-room-${room.id}`}>
                <Edit3 className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent className={cn("flex-grow space-y-2", room.backgroundImage && "pt-2")}>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{room.devices.length} device{room.devices.length === 1 ? '' : 's'} ({onlineDevices} online)</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Lightbulb className="mr-2 h-4 w-4" />
          <span>{activeLights} light{activeLights === 1 ? '' : 's'} on</span>
        </div>
        {room.devices.find(d => d.type === 'thermostat') && (
            <div className="flex items-center text-sm text-muted-foreground">
                <Thermometer className="mr-2 h-4 w-4" />
                <span>Avg. Temp: {room.devices.find(d => d.type === 'thermostat')?.value || 'N/A'}</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="default" size="sm" className="w-full" asChild>
             {/* This link will eventually trigger a ViewRoomModal or navigate to a room detail page */}
            <Link href={`#view-room-${room.id}`}>
                View Room
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
