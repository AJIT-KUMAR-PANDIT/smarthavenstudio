'use client';

import { useEffect, useState } from 'react';
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
import Image from 'next/image'; // For image preview

const roomFormSchema = z.object({
  name: z.string().min(2, { message: 'Room name must be at least 2 characters.' }),
  iconName: z.string().min(1, { message: 'Please select an icon.' }),
  roomImage: z.string().optional(), // To store data URI
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface EditRoomFormProps {
  roomToEdit: Room;
  onRoomUpdate: (roomData: Omit<Room, 'devices' | 'icon'> & { id: string }) => void;
  onCancel: () => void;
}

export function EditRoomForm({ roomToEdit, onRoomUpdate, onCancel }: EditRoomFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(roomToEdit.roomImage || null);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: roomToEdit.name,
      iconName: roomToEdit.iconName || 'Default',
      roomImage: roomToEdit.roomImage || undefined,
    },
  });

  useEffect(() => {
    if (roomToEdit) {
      form.reset({
        name: roomToEdit.name,
        iconName: roomToEdit.iconName || 'Default',
        roomImage: roomToEdit.roomImage || undefined,
      });
      setImagePreview(roomToEdit.roomImage || null);
    }
  }, [roomToEdit, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        form.setValue('roomImage', dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      // Option to clear image if needed, for now, keeps existing if no new file selected
      // setImagePreview(null);
      // form.setValue('roomImage', undefined);
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('roomImage', undefined);
  }


  function onSubmit(data: RoomFormValues) {
    onRoomUpdate({
      id: roomToEdit.id, 
      name: data.name,
      iconName: data.iconName,
      roomImage: data.roomImage,
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
        <FormItem>
          <FormLabel>Room Image</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </FormControl>
          {imagePreview && (
            <div className="mt-2 space-y-2">
              <div className="relative w-full h-32 rounded-md overflow-hidden border">
                <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                Remove Image
              </Button>
            </div>
          )}
          <FormMessage />
        </FormItem>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => { form.reset(roomToEdit); setImagePreview(roomToEdit.roomImage || null); onCancel(); }}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}