
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
import type { Automation } from '@/types';

const automationFormSchema = z.object({
  name: z.string().min(2, { message: 'Automation name must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
});

type AutomationFormValues = z.infer<typeof automationFormSchema>;

interface AddAutomationFormProps {
  onAutomationAdd: (automationData: Pick<Automation, 'name' | 'description'>) => void;
  onCancel: () => void;
}

export function AddAutomationForm({ onAutomationAdd, onCancel }: AddAutomationFormProps) {
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function onSubmit(data: AutomationFormValues) {
    onAutomationAdd({
      name: data.name,
      description: data.description,
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
          Triggers and actions can be configured after creating the automation (feature coming soon).
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Automation</Button>
        </div>
      </form>
    </Form>
  );
}
