
'use client';

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
import { Textarea } from '@/components/ui/textarea';
import type { Scene } from '@/types';
import { Film } from 'lucide-react'; // Default icon

const sceneFormSchema = z.object({
  name: z.string().min(2, { message: 'Scene name must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
  // For now, actions will be an empty array. We can expand this later.
});

type SceneFormValues = z.infer<typeof sceneFormSchema>;

interface AddSceneFormProps {
  onSceneAdd: (sceneData: Omit<Scene, 'id' | 'isActive' | 'icon' | 'actions'>) => void;
  onCancel: () => void;
}

export function AddSceneForm({ onSceneAdd, onCancel }: AddSceneFormProps) {
  const form = useForm<SceneFormValues>({
    resolver: zodResolver(sceneFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function onSubmit(data: SceneFormValues) {
    onSceneAdd({
      name: data.name,
      description: data.description,
      // icon: Film, // Default icon, can be customized later
      // actions: [], // Default empty actions
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scene Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Movie Night" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this scene does..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Placeholder for adding device actions - to be implemented later */}
        <div className="text-sm text-muted-foreground">
          Device actions can be configured after creating the scene.
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Scene</Button>
        </div>
      </form>
    </Form>
  );
}
