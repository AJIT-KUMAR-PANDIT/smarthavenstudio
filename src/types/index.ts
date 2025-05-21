
import type { LucideIcon } from 'lucide-react';

export interface Device {
  id: string;
  name: string;
  room?: string; // Made room optional
  type: 'light' | 'thermostat' | 'blinds' | 'sensor' | 'camera' | 'speaker' | 'other';
  status: 'on' | 'off' | 'active' | 'inactive' | string; // string for custom statuses like temperature
  isOnline: boolean;
  icon?: React.ElementType; // Lucide icon component
  lastSeen: string;
  controllable: boolean;
  value?: string | number; // For sensors or dimmable lights
  settings?: Record<string, any>; // e.g., brightness, color for lights
}

export interface Room {
  id: string;
  name: string;
  devices: Device[];
  backgroundImage?: string; // URL for room image
  icon?: LucideIcon; // The actual Lucide icon component
  iconName?: string; // Name of the icon for storage/selection
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
  isActive: boolean;
  actions: {
    deviceId: string;
    action: string; // e.g., 'turnOn', 'setBrightness'
    value?: any;
  }[];
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  trigger: {
    type: 'time' | 'sunrise' | 'sunset' | 'device_state' | 'sensor_reading';
    details: Record<string, any>; // e.g., { time: '07:00' } or { deviceId: 'xyz', state: 'on' }
  };
  actions: {
    type: 'device_action' | 'scene_activation' | 'notification';
    details: Record<string, any>; // e.g., { deviceId: 'abc', command: 'turnOff' } or { sceneId: '123' }
  }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source?: string; // e.g., 'Device X', 'Automation Y'
}

export interface NotificationMessage {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  read: boolean;
  type: 'alert' | 'info' | 'update' | 'reminder';
  icon?: LucideIcon;
}

export interface EnergyDataPoint {
  time: string; // Could be date string or hour
  consumption: number; // in kWh or other unit
}
