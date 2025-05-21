
'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import type { Automation, Device, Scene, AutomationAction } from '@/types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const automationActionSchema = z.object({
  id: z.string(),
  type: z.enum(['device_action', 'scene_activation', 'notification'], { required_error: "Action type is required."}),
  details: z.object({
    deviceId: z.string().optional(),
    command: z.string().optional(),
    value: z.any().optional(),
    sceneId: z.string().optional(),
    message: z.string().optional(),
  }),
});

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
  actions: z.array(automationActionSchema).optional(),
});

type AutomationFormValues = z.infer<typeof automationFormSchema>;

interface EditAutomationFormProps {
  automationToEdit: Automation;
  onAutomationUpdate: (automationData: Automation) => void;
  onCancel: () => void;
}

export function EditAutomationForm({ automationToEdit, onAutomationUpdate, onCancel }: EditAutomationFormProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      name: automationToEdit.name,
      description: automationToEdit.description,
      trigger: {
        type: automationToEdit.trigger.type,
        details: automationToEdit.trigger.details || {},
      },
      actions: automationToEdit.actions || [],
    },
  });

  const { fields: actionFields, append: appendAction, remove: removeAction } = useFieldArray({
    control: form.control,
    name: "actions",
  });

  const triggerType = form.watch('trigger.type');

  useEffect(() => {
    try {
      const storedDevices = localStorage.getItem('smartHavenDevices');
      if (storedDevices) setDevices(JSON.parse(storedDevices));
      const storedScenes = localStorage.getItem('smartHavenScenes');
      if (storedScenes) setScenes(JSON.parse(storedScenes));
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
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
      actions: automationToEdit.actions || [],
    });
  }, [automationToEdit, form]);

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
  }, [triggerType, form.setValue]);

  function onSubmit(data: AutomationFormValues) {
    const triggerDetails = { ...data.trigger.details };
     if (data.trigger.type !== 'time') delete triggerDetails.time;
    if (data.trigger.type !== 'device_state') {
        delete triggerDetails.deviceId;
        delete triggerDetails.expectedState;
    }
    
    onAutomationUpdate({
      ...automationToEdit, // Preserve other fields like id, isEnabled
      name: data.name,
      description: data.description,
      trigger: {
        type: data.trigger.type,
        details: triggerDetails,
      },
      actions: data.actions || [],
    });
  }

  const handleAddNewAction = () => {
    appendAction({ 
      id: `action-${Date.now()}`, 
      type: 'device_action', 
      details: {} 
    });
  };

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

        {/* Trigger Configuration */}
         <div className="space-y-2 p-3 border rounded-md bg-muted/20">
            <h4 className="text-sm font-medium">Trigger</h4>
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
        </div>

        {/* Actions Configuration */}
        <div className="space-y-3 p-3 border rounded-md bg-muted/20">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Actions</h4>
            <Button type="button" size="sm" variant="outline" onClick={handleAddNewAction}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Action
            </Button>
          </div>
          
          {actionFields.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">No actions added yet.</p>
          )}

          <ScrollArea className="h-[200px] pr-3">
            <div className="space-y-3">
            {actionFields.map((field, index) => (
                <div key={field.id} className="space-y-2 p-2 border rounded-md bg-background/50">
                <div className="flex justify-between items-center">
                     <p className="text-xs font-medium">Action #{index + 1}</p>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAction(index)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                </div>
                
                <FormField
                    control={form.control}
                    name={`actions.${index}.type`}
                    render={({ field: typeField }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Action Type</FormLabel>
                        <Select onValueChange={typeField.onChange} value={typeField.value}>
                        <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select action type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="device_action">Device Action</SelectItem>
                            <SelectItem value="scene_activation">Activate Scene</SelectItem>
                            <SelectItem value="notification">Send Notification</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {form.watch(`actions.${index}.type`) === 'device_action' && (
                    <>
                    <FormField
                        control={form.control}
                        name={`actions.${index}.details.deviceId`}
                        render={({ field: deviceIdField }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Target Device</FormLabel>
                            <Select onValueChange={deviceIdField.onChange} value={deviceIdField.value}>
                            <FormControl>
                                <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select device" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {devices.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`actions.${index}.details.command`}
                        render={({ field: commandField }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Command</FormLabel>
                             <Select onValueChange={commandField.onChange} value={commandField.value}>
                                <FormControl>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select command" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="turnOn">Turn On</SelectItem>
                                    <SelectItem value="turnOff">Turn Off</SelectItem>
                                    <SelectItem value="setBrightness">Set Brightness (Value 0-100)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     {form.watch(`actions.${index}.details.command`) === 'setBrightness' && (
                         <FormField
                            control={form.control}
                            name={`actions.${index}.details.value`}
                            render={({ field: valueField }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Value (0-100)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" max="100" className="h-8 text-xs" {...valueField} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    </>
                )}

                {form.watch(`actions.${index}.type`) === 'scene_activation' && (
                    <FormField
                        control={form.control}
                        name={`actions.${index}.details.sceneId`}
                        render={({ field: sceneIdField }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Scene to Activate</FormLabel>
                            <Select onValueChange={sceneIdField.onChange} value={sceneIdField.value}>
                            <FormControl>
                                <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select scene" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {scenes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}

                {form.watch(`actions.${index}.type`) === 'notification' && (
                     <FormField
                        control={form.control}
                        name={`actions.${index}.details.message`}
                        render={({ field: messageField }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Notification Message</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter notification text..." className="text-xs min-h-[60px]" {...messageField} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                </div>
            ))}
            </div>
          </ScrollArea>
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
