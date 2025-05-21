
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

// Simple hash function to get a color index based on room name
const getColorIndexForRoom = (roomName: string) => {
  let hash = 0;
  for (let i = 0; i < roomName.length; i++) {
    hash = roomName.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const fallbackBgColors = [
  "bg-sky-200 dark:bg-sky-800",
  "bg-amber-200 dark:bg-amber-800",
  "bg-emerald-200 dark:bg-emerald-800",
  "bg-rose-200 dark:bg-rose-800",
  "bg-indigo-200 dark:bg-indigo-800",
  "bg-pink-200 dark:bg-pink-800",
  "bg-lime-200 dark:bg-lime-800",
  "bg-fuchsia-200 dark:bg-fuchsia-800",
];


export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const Icon = room.icon || getIconComponentByName(room.iconName) || DoorOpen; 
  const onlineDevices = room.devices.filter(d => d.isOnline).length;
  const activeLights = room.devices.filter(d => d.type === 'light' && d.status === 'on').length;

  const fallbackBgClass = fallbackBgColors[getColorIndexForRoom(room.name) % fallbackBgColors.length];

  return (
    <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      <div className="relative h-48 w-full">
        {room.roomImage ? (
          <Image 
              src={room.roomImage} 
              alt={room.name} 
              fill={true}
              style={{objectFit: "cover"}}
              className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center transition-colors duration-300",
            fallbackBgClass
          )}>
            <span className="text-3xl font-bold text-gray-700 dark:text-gray-300 px-4 text-center break-all line-clamp-3">
              {room.name}
            </span>
          </div>
        )}
        {/* Gradient overlay for cards with images, for text contrast */}
        {room.roomImage && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>}
      </div>
      
      <CardHeader className={cn(
        "flex flex-row items-start justify-between space-y-0 pb-2", 
        room.roomImage && "relative pt-4 text-white z-10 -mt-16" 
        // If no image, header is below the color block
      )}>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-6 w-6", room.roomImage ? "text-white" : "text-primary")} />
          <CardTitle className={cn("text-xl", room.roomImage && "text-white")}>{room.name}</CardTitle>
        </div>
         <Popover>
            <PopoverTrigger asChild>
                <Button 
                    variant={room.roomImage ? "ghost" : "outline"} 
                    size="icon" 
                    className={cn("h-8 w-8", room.roomImage && "text-white hover:bg-white/20 hover:text-white")}
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
      <CardContent className={cn("flex-grow space-y-2", room.roomImage && "pt-2", !room.roomImage && "pt-4")}>
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
            <Link href={`#view-room-${room.id}`} onClick={(e) => {e.preventDefault(); alert(`Navigating to details for room: ${room.name} (feature placeholder)`)}}>
                View Room Details
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
