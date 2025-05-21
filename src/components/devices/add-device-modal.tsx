
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Device } from '@/types';

const deviceSchema = z.object({
  name: z.string().min(2, { message: 'Device name must be at least 2 characters.' }),
  room: z.string().min(1, { message: 'Please select or enter a room name.' }), // Changed min to 1 for selection
  type: z.enum(['light', 'thermostat', 'blinds', 'sensor', 'camera', 'speaker'], {
    required_error: 'You need to select a device type.',
  }),
});

type AddDeviceFormValues = z.infer<typeof deviceSchema>;

interface AddDeviceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDeviceAdd: (device: Omit<Device, 'id' | 'status' | 'isOnline' | 'lastSeen' | 'controllable' | 'settings' | 'icon' | 'value'> & {type: AddDeviceFormValues['type']}) => void;
  availableRooms: string[];
}

export function AddDeviceModal({ isOpen, onOpenChange, onDeviceAdd, availableRooms }: AddDeviceModalProps) {
  const { toast } = useToast();
  const form = useForm<AddDeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: '',
      room: '',
      type: undefined,
    },
  });

  function onSubmit(data: AddDeviceFormValues) {
    onDeviceAdd({
        name: data.name,
        room: data.room,
        type: data.type,
    });
    toast({
      title: 'Device Added',
      description: `${data.name} has been added to ${data.room}.`,
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Enter the details for your new smart device.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Living Room Lamp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRooms.map((roomName) => (
                        <SelectItem key={roomName} value={roomName}>
                          {roomName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* 
                  // Alternative: If you want to allow typing new rooms as well, use a Combobox or keep Input.
                  // For now, sticking to Select as per "selectable dropdown".
                  <FormControl>
                    <Input placeholder="e.g., Living Room" {...field} />
                  </FormControl>
                   */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="thermostat">Thermostat</SelectItem>
                      <SelectItem value="blinds">Blinds</SelectItem>
                      <SelectItem value="sensor">Sensor</SelectItem>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="speaker">Speaker</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Device</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
