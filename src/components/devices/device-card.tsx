
"use client";

import type { Device } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Settings, ChevronDown, ChevronUp, Lightbulb, Thermometer, PanelTopOpen, Video, Speaker, Edit3, Trash2, HelpCircle } from "lucide-react"; // Added HelpCircle
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const deviceTypeIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  blinds: PanelTopOpen,
  sensor: Thermometer, 
  camera: Video,
  speaker: Speaker,
  other: HelpCircle, // Added 'other'
};

interface DeviceCardProps {
  device: Device;
  onToggle?: (id: string, status: boolean) => void;
  onSettingChange?: (id:string, setting: string, value: any) => void;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void; 
}

export function DeviceCard({ device, onToggle, onSettingChange, onEdit, onDelete }: DeviceCardProps) { 
  const [isOn, setIsOn] = useState(device.status === 'on' || (typeof device.value === 'number' && device.value > 0));
  const [brightness, setBrightness] = useState(device.type === 'light' && typeof device.settings?.brightness === 'number' ? device.settings.brightness : 50);
  const [temperature, setTemperature] = useState(device.type === 'thermostat' && typeof device.settings?.temperature === 'number' ? device.settings.temperature : 22);
  const [isExpanded, setIsExpanded] = useState(false);

  const Icon = device.icon || deviceTypeIcons[device.type] || HelpCircle; // Default to HelpCircle if type is unknown

  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    if (onToggle) onToggle(device.id, checked);
  };

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0]);
    if(onSettingChange) onSettingChange(device.id, 'brightness', value[0]);
  };

  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
     if(onSettingChange) onSettingChange(device.id, 'temperature', value[0]);
  };


  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col", device.isOnline ? "" : "opacity-60")}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className={cn("h-8 w-8", isOn && device.isOnline ? "text-primary" : "text-muted-foreground")} />
          <div>
            <CardTitle className="text-lg">{device.name}</CardTitle>
            <CardDescription className="text-xs">{device.room} - {device.type}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
         {device.isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
          {device.controllable && (device.type === 'light' || device.type === 'thermostat' || device.type === 'blinds') && (
             <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-7 w-7">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {device.controllable && (
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Switch checked={isOn} onCheckedChange={handleToggle} aria-label={`Toggle ${device.name}`} />
            </div>
        )}
        {!device.controllable && device.value && (
             <p className="text-sm">Value: <span className="font-semibold">{device.value}</span></p>
        )}

        {isExpanded && device.isOnline && isOn && (
          <div className="mt-4 space-y-4">
            {device.type === 'light' && (
              <div>
                <Label htmlFor={`brightness-${device.id}`} className="text-xs text-muted-foreground">Brightness: {brightness}%</Label>
                <Slider
                  id={`brightness-${device.id}`}
                  defaultValue={[brightness]}
                  max={100}
                  step={1}
                  onValueChange={handleBrightnessChange}
                  className="mt-1"
                />
              </div>
            )}
            {device.type === 'thermostat' && (
               <div>
                <Label htmlFor={`temperature-${device.id}`} className="text-xs text-muted-foreground">Temperature: {temperature}°C</Label>
                <Slider
                  id={`temperature-${device.id}`}
                  defaultValue={[temperature]}
                  min={15}
                  max={30}
                  step={0.5}
                  onValueChange={handleTemperatureChange}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-between items-center pt-4 border-t mt-auto">
        <span>Last seen: {device.lastSeen}</span>
         <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Settings className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
                <div className="grid gap-1">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => onEdit(device)}>
                        <Edit3 className="mr-2 h-3 w-3" /> Edit Device
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">View Details</Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">Device Logs</Button>
                    <Button variant="destructive" size="sm" className="w-full justify-start text-xs" onClick={() => onDelete(device)}> 
                        <Trash2 className="mr-2 h-3 w-3" /> Remove Device
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}

const Label = React.forwardRef<
  React.ElementRef<"label">,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block text-sm font-medium text-foreground", className)}
    {...props}
  />
));
Label.displayName = "Label";
