
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
import { Textarea } from '@/components/ui/textarea';
import type { Scene } from '@/types';

const sceneFormSchema = z.object({
  name: z.string().min(2, { message: 'Scene name must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
});

type SceneFormValues = z.infer<typeof sceneFormSchema>;

interface EditSceneFormProps {
  sceneToEdit: Scene;
  onSceneUpdate: (sceneData: Pick<Scene, 'id' | 'name' | 'description'>) => void;
  onCancel: () => void;
}

export function EditSceneForm({ sceneToEdit, onSceneUpdate, onCancel }: EditSceneFormProps) {
  const form = useForm<SceneFormValues>({
    resolver: zodResolver(sceneFormSchema),
    defaultValues: {
      name: sceneToEdit.name,
      description: sceneToEdit.description,
    },
  });

  useEffect(() => {
    form.reset({
      name: sceneToEdit.name,
      description: sceneToEdit.description,
    });
  }, [sceneToEdit, form]);

  function onSubmit(data: SceneFormValues) {
    onSceneUpdate({
      id: sceneToEdit.id,
      name: data.name,
      description: data.description,
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
        <div className="text-sm text-muted-foreground">
          Device actions can be configured after editing the scene (feature coming soon).
        </div>
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
