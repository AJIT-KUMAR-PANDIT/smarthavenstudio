
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
import type { Automation } from '@/types';

const automationFormSchema = z.object({
  name: z.string().min(2, { message: 'Automation name must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
});

type AutomationFormValues = z.infer<typeof automationFormSchema>;

interface EditAutomationFormProps {
  automationToEdit: Automation;
  onAutomationUpdate: (automationData: Pick<Automation, 'id' | 'name' | 'description'>) => void;
  onCancel: () => void;
}

export function EditAutomationForm({ automationToEdit, onAutomationUpdate, onCancel }: EditAutomationFormProps) {
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      name: automationToEdit.name,
      description: automationToEdit.description,
    },
  });

  useEffect(() => {
    form.reset({
      name: automationToEdit.name,
      description: automationToEdit.description,
    });
  }, [automationToEdit, form]);

  function onSubmit(data: AutomationFormValues) {
    onAutomationUpdate({
      id: automationToEdit.id,
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
              <FormLabel>Automation Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Morning Lights" {...field} />
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
                  placeholder="Describe what this automation does..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-sm text-muted-foreground">
          Triggers and actions configuration will be available in a future update.
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
