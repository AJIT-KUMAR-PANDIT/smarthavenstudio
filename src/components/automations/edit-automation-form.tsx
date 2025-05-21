
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Automation, Device } from '@/types';

const automationFormSchema = z.object({
  name: z.string().min(2, { message: 'Automation name must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
  trigger: z.object({
    type: z.enum(['time', 'sunrise', 'sunset', 'device_state', 'sensor_reading'], {
      required_error: 'Trigger type is required.',
    }),
    details: z.object({
      time: z.string().optional(),
      deviceId: z.string().optional(),
      expectedState: z.string().optional(),
    }).optional(),
  }),
});

type AutomationFormValues = z.infer<typeof automationFormSchema>;

interface EditAutomationFormProps {
  automationToEdit: Automation;
  onAutomationUpdate: (automationData: Pick<Automation, 'id' | 'name' | 'description' | 'trigger'>) => void;
  onCancel: () => void;
}

export function EditAutomationForm({ automationToEdit, onAutomationUpdate, onCancel }: EditAutomationFormProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      name: automationToEdit.name,
      description: automationToEdit.description,
      trigger: {
        type: automationToEdit.trigger.type,
        details: automationToEdit.trigger.details || {},
      },
    },
  });

  const triggerType = form.watch('trigger.type');

  useEffect(() => {
    try {
      const storedDevices = localStorage.getItem('smartHavenDevices');
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      }
    } catch (error) {
      console.error("Failed to load devices from localStorage:", error);
      setDevices([]);
    }
  }, []);

  useEffect(() => {
    form.reset({
      name: automationToEdit.name,
      description: automationToEdit.description,
      trigger: {
        type: automationToEdit.trigger.type,
        details: automationToEdit.trigger.details || {},
      },
    });
  }, [automationToEdit, form]);

  // Reset trigger details when trigger type changes, preserving existing relevant values
  useEffect(() => {
    const currentDetails = form.getValues('trigger.details') || {};
    if (triggerType === 'time') {
      form.setValue('trigger.details', { time: currentDetails.time || '12:00' });
    } else if (triggerType === 'device_state') {
       form.setValue('trigger.details', { deviceId: currentDetails.deviceId, expectedState: currentDetails.expectedState || '' });
    } else {
      form.setValue('trigger.details', {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerType, form.setValue]); // form.setValue is stable, but include to be explicit

  function onSubmit(data: AutomationFormValues) {
    const triggerDetails = { ...data.trigger.details };
     if (data.trigger.type !== 'time') delete triggerDetails.time;
    if (data.trigger.type !== 'device_state') {
        delete triggerDetails.deviceId;
        delete triggerDetails.expectedState;
    }
    
    onAutomationUpdate({
      id: automationToEdit.id,
      name: data.name,
      description: data.description,
      trigger: {
        type: data.trigger.type,
        details: triggerDetails,
      },
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

        <FormField
          control={form.control}
          name="trigger.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="time">Time of Day</SelectItem>
                  <SelectItem value="sunrise">Sunrise</SelectItem>
                  <SelectItem value="sunset">Sunset</SelectItem>
                  <SelectItem value="device_state">Device State</SelectItem>
                  <SelectItem value="sensor_reading">Sensor Reading</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {triggerType === 'time' && (
          <FormField
            control={form.control}
            name="trigger.details.time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {triggerType === 'device_state' && (
          <>
            <FormField
              control={form.control}
              name="trigger.details.deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device to Monitor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {devices.length > 0 ? (
                        devices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name} ({device.room || 'Unassigned'})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-center text-muted-foreground">No devices available.</div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trigger.details.expectedState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., on, off, active, 25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {(triggerType === 'sunrise' || triggerType === 'sunset' || triggerType === 'sensor_reading') && (
            <p className="text-sm text-muted-foreground">Configuration for {triggerType.replace('_', ' ')} triggers is coming soon.</p>
        )}

        <div className="text-sm text-muted-foreground pt-2">
          Actions configuration will be available in a future update.
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
