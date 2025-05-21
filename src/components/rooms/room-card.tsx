
import type { Room } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoorOpen, Lightbulb, Thermometer, Users, Edit3, Trash2, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getIconComponentByName } from "./add-room-form"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const Icon = room.icon || getIconComponentByName(room.iconName) || DoorOpen; 
  const onlineDevices = room.devices.filter(d => d.isOnline).length;
  const activeLights = room.devices.filter(d => d.type === 'light' && d.status === 'on').length;

  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      {room.backgroundImage && (
         <div className="relative h-40 w-full">
            <Image 
                src={room.backgroundImage} 
                alt={room.name} 
                fill={true}
                style={{objectFit: "cover"}}
                className="transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="room interior"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
         </div>
      )}
      <CardHeader className={cn("flex flex-row items-start justify-between space-y-0 pb-2", room.backgroundImage && "relative pt-4 text-white z-10 -mt-16")}>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-6 w-6", room.backgroundImage ? "text-white" : "text-primary")} />
          <CardTitle className={cn("text-xl", room.backgroundImage && "text-white")}>{room.name}</CardTitle>
        </div>
         <Popover>
            <PopoverTrigger asChild>
                <Button 
                    variant={room.backgroundImage ? "ghost" : "outline"} 
                    size="icon" 
                    className={cn("h-8 w-8", room.backgroundImage && "text-white hover:bg-white/20 hover:text-white")}
                    aria-label={`Actions for room ${room.name}`}
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
                <div className="grid gap-1">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={() => onEdit(room)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Room
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(room)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Room
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
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
            {/* In a real app, this link would navigate to a detailed room view page */}
            <Link href={`#view-room-${room.id}`} onClick={(e) => {e.preventDefault(); alert(`Navigating to details for room: ${room.name} (feature placeholder)`)}}>
                View Room Details
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
