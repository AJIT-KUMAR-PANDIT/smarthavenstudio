
'use client';

import { useEffect, useState } from 'react';
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
import type { Device, Room } from '@/types';

const deviceSchema = z.object({
  name: z.string().min(2, { message: 'Device name must be at least 2 characters.' }),
  room: z.string().optional(), // Made room optional
  type: z.enum(['light', 'thermostat', 'blinds', 'sensor', 'camera', 'speaker', 'other'], {
    required_error: 'You need to select a device type.',
  }),
});

type EditDeviceFormValues = z.infer<typeof deviceSchema>;

interface EditDeviceModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  deviceToEdit: Device;
  onDeviceUpdate: (device: Pick<Device, 'id' | 'name' | 'type'> & { room?: string }) => void;
}

export function EditDeviceModal({ isOpen, onOpenChange, deviceToEdit, onDeviceUpdate }: EditDeviceModalProps) {
  const { toast } = useToast();
  const [availableRoomsInModal, setAvailableRoomsInModal] = useState<string[]>([]);

  const form = useForm<EditDeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    // Default values will be set by useEffect
  });

  useEffect(() => {
    if (isOpen) {
      try {
        const storedRooms = localStorage.getItem('smartHavenRooms');
        if (storedRooms) {
          const parsedRooms: Pick<Room, 'name'>[] = JSON.parse(storedRooms);
          setAvailableRoomsInModal(Array.from(new Set(parsedRooms.map(r => r.name))).sort());
        } else {
          setAvailableRoomsInModal([]);
        }
      } catch (error) {
        console.error("Failed to load rooms from localStorage for modal:", error);
        setAvailableRoomsInModal([]);
      }

      if (deviceToEdit) {
        form.reset({
          name: deviceToEdit.name,
          room: deviceToEdit.room || '', // Ensure empty string if undefined for Select
          type: deviceToEdit.type,
        });
      }
    }
  }, [deviceToEdit, isOpen, form]);

  function onSubmit(data: EditDeviceFormValues) {
    onDeviceUpdate({
      id: deviceToEdit.id,
      name: data.name,
      room: data.room || undefined, // Ensure undefined if empty string
      type: data.type,
    });
    onOpenChange(false);
  }

  const handleModalOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Device: {deviceToEdit?.name}</DialogTitle>
          <DialogDescription>
            Modify the details for your smart device.
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
                  <FormLabel>Room (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoomsInModal.length > 0 ? (
                        availableRoomsInModal.map((roomName) => (
                          <SelectItem key={roomName} value={roomName}>
                            {roomName}
                          </SelectItem>
                        ))
                      ) : (
                         <SelectItem value={deviceToEdit?.room || ""} disabled>{deviceToEdit?.room || "No rooms available"}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleModalOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
