
'use client';

import { useEffect, useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Scene, Device, SceneAction } from '@/types';
import { Lightbulb, Thermometer, PanelTopOpen, Tv, Speaker, HelpCircle, Search } from 'lucide-react';

const sceneActionSchema = z.object({
  deviceId: z.string(),
  action: z.string(),
  value: z.any().optional(),
});

const sceneFormSchema = z.object({
  name: z.string().min(2, { message: 'Scene name must be at least 2 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
  actions: z.array(sceneActionSchema).optional(),
});

type SceneFormValues = z.infer<typeof sceneFormSchema>;

interface EditSceneFormProps {
  sceneToEdit: Scene;
  onSceneUpdate: (sceneData: Scene) => void;
  onCancel: () => void;
}

const deviceTypeIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  blinds: PanelTopOpen,
  camera: Tv,
  speaker: Speaker,
  other: HelpCircle,
};

export function EditSceneForm({ sceneToEdit, onSceneUpdate, onCancel }: EditSceneFormProps) {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<SceneFormValues>({
    resolver: zodResolver(sceneFormSchema),
    defaultValues: {
      name: sceneToEdit.name,
      description: sceneToEdit.description,
      actions: sceneToEdit.actions || [],
    },
  });

  const { fields: actionFields, append: appendAction, remove: removeAction, update: updateAction } = useFieldArray({
    control: form.control,
    name: "actions",
  });

  useEffect(() => {
    try {
      const storedDevices = localStorage.getItem('smartHavenDevices');
      if (storedDevices) {
        setAllDevices(JSON.parse(storedDevices));
      }
    } catch (error) {
      console.error("Failed to load devices from localStorage:", error);
    }
  }, []);
  
  useEffect(() => {
    // Reset form if sceneToEdit changes, including actions
    form.reset({
        name: sceneToEdit.name,
        description: sceneToEdit.description,
        actions: sceneToEdit.actions || []
    });
  }, [sceneToEdit, form]);


  const filteredDevices = useMemo(() => {
    return allDevices.filter(device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.room?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allDevices, searchTerm]);

  const devicesByRoom = useMemo(() => {
    const grouped: Record<string, Device[]> = {};
    filteredDevices.forEach(device => {
      const roomName = device.room || 'Unassigned Room';
      if (!grouped[roomName]) {
        grouped[roomName] = [];
      }
      grouped[roomName].push(device);
    });
    return grouped;
  }, [filteredDevices]);

  const handleDeviceSelectionChange = (deviceId: string, deviceType: Device['type'], checked: boolean) => {
    const existingActionIndex = actionFields.findIndex(action => action.deviceId === deviceId);
    if (checked) {
      if (existingActionIndex === -1) {
        let defaultActionValue: any = undefined;
        let actionType = '';
        switch (deviceType) {
          case 'light': actionType = 'turnOn'; defaultActionValue = { brightness: 50, isOn: true }; break;
          case 'thermostat': actionType = 'setTemperature'; defaultActionValue = 22; break;
          case 'blinds': actionType = 'setStatus'; defaultActionValue = 'open'; break;
          default: actionType = 'activate';
        }
        appendAction({ deviceId, action: actionType, value: defaultActionValue });
      }
    } else {
      if (existingActionIndex !== -1) {
        removeAction(existingActionIndex);
      }
    }
  };

  const handleActionValueChange = (deviceId: string, field: string, newValue: any) => {
    const actionIndex = actionFields.findIndex(action => action.deviceId === deviceId);
    if (actionIndex !== -1) {
      const currentAction = actionFields[actionIndex];
      let updatedValue = { ...currentAction.value };
      if (currentAction.action === 'turnOn') { // For lights
        updatedValue = { ...updatedValue, [field]: newValue };
      } else { // For thermostat, blinds, etc.
        updatedValue = newValue;
      }
      updateAction(actionIndex, { ...currentAction, value: updatedValue });
    }
  };

  function onSubmit(data: SceneFormValues) {
    onSceneUpdate({
      ...sceneToEdit, // keep id, icon, isActive
      name: data.name,
      description: data.description,
      actions: data.actions || [],
    });
  }
  
  const getDeviceAction = (deviceId: string) => {
    return actionFields.find(action => action.deviceId === deviceId);
  };

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

        <div className="space-y-2">
          <FormLabel>Configure Device Actions</FormLabel>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices by name or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background/50"
            />
          </div>
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-2 bg-background/30">
          {Object.keys(devicesByRoom).length > 0 ? (
            <Accordion type="multiple" className="w-full" defaultValue={Object.keys(devicesByRoom)}>
              {Object.entries(devicesByRoom).map(([roomName, devicesInRoom]) => (
                <AccordionItem value={roomName} key={roomName}>
                  <AccordionTrigger className="text-sm font-medium">{roomName} ({devicesInRoom.length})</AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-1 pb-3">
                    {devicesInRoom.map((device) => {
                      const DeviceIcon = deviceTypeIcons[device.type] || HelpCircle;
                      const currentAction = getDeviceAction(device.id);
                      const isSelected = !!currentAction;

                      return (
                        <div key={device.id} className="p-3 rounded-md border bg-background/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs font-medium">{device.name}</span>
                              <span className="text-xs text-muted-foreground">({device.type})</span>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleDeviceSelectionChange(device.id, device.type, !!checked)}
                              aria-label={`Select ${device.name}`}
                            />
                          </div>
                          {isSelected && currentAction && (
                            <div className="pl-6 space-y-2 border-l-2 border-primary/50 ml-2 pt-2">
                              {device.type === 'light' && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      id={`${device.id}-light-switch`}
                                      checked={currentAction.value?.isOn ?? true}
                                      onCheckedChange={(checked) => handleActionValueChange(device.id, 'isOn', checked)}
                                    />
                                    <Label htmlFor={`${device.id}-light-switch`} className="text-xs">Turn On/Off</Label>
                                  </div>
                                  {currentAction.value?.isOn && (
                                    <div>
                                      <Label htmlFor={`${device.id}-brightness`} className="text-xs">Brightness: {currentAction.value?.brightness ?? 50}%</Label>
                                      <Slider
                                        id={`${device.id}-brightness`}
                                        defaultValue={[currentAction.value?.brightness ?? 50]}
                                        max={100}
                                        step={1}
                                        onValueChange={(val) => handleActionValueChange(device.id, 'brightness', val[0])}
                                        className="mt-1"
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              {device.type === 'thermostat' && (
                                <div>
                                  <Label htmlFor={`${device.id}-temp`} className="text-xs">Set Temperature (°C)</Label>
                                  <Input
                                    id={`${device.id}-temp`}
                                    type="number"
                                    defaultValue={currentAction.value ?? 22}
                                    onChange={(e) => handleActionValueChange(device.id, 'temperature', parseInt(e.target.value))}
                                    className="h-8 text-xs mt-1"
                                  />
                                </div>
                              )}
                              {device.type === 'blinds' && (
                                <div>
                                  <Label htmlFor={`${device.id}-blinds-status`} className="text-xs">Status</Label>
                                  <ShadcnSelect
                                    defaultValue={currentAction.value ?? 'open'}
                                    onValueChange={(value) => handleActionValueChange(device.id, 'status', value)}
                                  >
                                    <SelectTrigger id={`${device.id}-blinds-status`} className="h-8 text-xs mt-1">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Open</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                  </ShadcnSelect>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              {allDevices.length === 0 ? "No devices found. Add devices on the Devices page." : "No devices match your search."}
            </p>
          )}
        </ScrollArea>

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
