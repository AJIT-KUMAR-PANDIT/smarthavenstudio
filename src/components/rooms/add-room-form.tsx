
'use client';

import { useState } from 'react';
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
import { 
    Armchair, BedDouble, CookingPot, Bath, LampDesk, TreePalm, Home, 
    Building, Briefcase, Factory, Store, Warehouse, DoorOpen, type LucideIcon 
} from 'lucide-react';
import Image from 'next/image'; // For image preview

export const roomIconsList: { name: string; component: LucideIcon }[] = [
  { name: 'Armchair', component: Armchair },
  { name: 'BedDouble', component: BedDouble },
  { name: 'CookingPot', component: CookingPot },
  { name: 'Bath', component: Bath },
  { name: 'LampDesk', component: LampDesk },
  { name: 'TreePalm', component: TreePalm },
  { name: 'Home', component: Home },
  { name: 'Building', component: Building },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Factory', component: Factory },
  { name: 'Store', component: Store },
  { name: 'Warehouse', component: Warehouse },
  { name: 'Default', component: DoorOpen },
];

export const getIconComponentByName = (name?: string): LucideIcon => {
  const foundIcon = roomIconsList.find(icon => icon.name === name);
  return foundIcon ? foundIcon.component : DoorOpen; // Default icon
};

const roomFormSchema = z.object({
  name: z.string().min(2, { message: 'Room name must be at least 2 characters.' }),
  iconName: z.string().min(1, { message: 'Please select an icon.' }),
  roomImage: z.string().optional(), // To store data URI
});

type RoomFormValues = z.infer<typeof roomFormSchema>;

interface AddRoomFormProps {
  onRoomAdd: (roomData: Omit<Room, 'id' | 'devices' | 'icon'>) => void;
  onCancel: () => void;
}

export function AddRoomForm({ onRoomAdd, onCancel }: AddRoomFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: '',
      iconName: 'Default',
      roomImage: undefined,
    },
  });

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
      setImagePreview(null);
      form.setValue('roomImage', undefined);
    }
  };

  function onSubmit(data: RoomFormValues) {
    onRoomAdd({
      name: data.name,
      iconName: data.iconName,
      roomImage: data.roomImage,
    });
    form.reset();
    setImagePreview(null);
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
          <FormLabel>Room Image (Optional)</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </FormControl>
          {imagePreview && (
            <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden border">
              <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" />
            </div>
          )}
          <FormMessage />
        </FormItem>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => { form.reset(); setImagePreview(null); onCancel();}}>
            Cancel
          </Button>
          <Button type="submit">Create Room</Button>
        </div>
      </form>
    </Form>
  );
}
