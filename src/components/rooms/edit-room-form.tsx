
'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import type { Room } from '@/types';
import { roomIconsList } from './add-room-form'; // Re-use the icon list

const roomFormSchema = z.object({
  name: z.string().min(2, { message: 'Room name must be at least 2 characters.' }),
  iconName: z.string().min(1, { message: 'Please select an icon.' }),
  // backgroundImage: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface EditRoomFormProps {
  roomToEdit: Room;
  onRoomUpdate: (roomData: Omit<Room, 'devices' | 'icon'>) => void;
  onCancel: () => void;
}

export function EditRoomForm({ roomToEdit, onRoomUpdate, onCancel }: EditRoomFormProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: roomToEdit.name,
      iconName: roomToEdit.iconName || 'Default',
      // backgroundImage: roomToEdit.backgroundImage || '',
    },
  });

  useEffect(() => {
    if (roomToEdit) {
      form.reset({
        name: roomToEdit.name,
        iconName: roomToEdit.iconName || 'Default',
        // backgroundImage: roomToEdit.backgroundImage || '',
      });
    }
  }, [roomToEdit, form]);

  function onSubmit(data: RoomFormValues) {
    onRoomUpdate({
      id: roomToEdit.id, // Keep the original ID
      name: data.name,
      iconName: data.iconName,
      // backgroundImage: data.backgroundImage, // Handle if you re-enable background image editing
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Living Room" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iconName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roomIconsList.map(icon => (
                    <SelectItem key={icon.name} value={icon.name}>
                      <div className="flex items-center gap-2">
                        <icon.component className="h-4 w-4" />
                        {icon.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 
        <FormField
          control={form.control}
          name="backgroundImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
