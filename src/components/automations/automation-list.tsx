"use client";

import type { Automation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shuffle, Zap, Edit3, Trash2, Play, Pause, Sunrise, Sunset, Clock, BellDot } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const initialMockAutomations: Automation[] = [
  { 
    id: "1", 
    name: "Morning Wake-up", 
    description: "At 7 AM, open blinds and turn on bedroom lights.", 
    isEnabled: true, 
    trigger: { type: "time", details: { time: "07:00" } },
    actions: [
      { type: "device_action", details: { deviceId: "bedroom-blinds", command: "open" } },
      { type: "device_action", details: { deviceId: "bedroom-light", command: "turnOn", value: "soft white" } },
    ]
  },
  { 
    id: "2", 
    name: "Sunset Lighting", 
    description: "Turn on outdoor lights at sunset.", 
    isEnabled: true, 
    trigger: { type: "sunset", details: { offset: "-15m" } },
    actions: [{ type: "device_action", details: { deviceId: "outdoor-lights", command: "turnOn" } }]
  },
  { 
    id: "3", 
    name: "Movie Mode Trigger", 
    description: "If Movie Night scene is active, dim hallway lights.", 
    isEnabled: false, 
    trigger: { type: "device_state", details: { sceneId: "movie-night-scene", state: "active" } }, // Assuming scenes can be device_state triggers
    actions: [{ type: "device_action", details: { deviceId: "hallway-light", command: "dim", value: 10 } }]
  },
   { 
    id: "4", 
    name: "Security Alert", 
    description: "If door sensor opens after 11 PM, send notification.", 
    isEnabled: true, 
    trigger: { type: "sensor_reading", details: { deviceId: "door-sensor", value: "open", condition: "after:23:00" } },
    actions: [{ type: "notification", details: { message: "Front door opened late at night!" } }]
  },
];

const triggerIcons = {
  time: Clock,
  sunrise: Sunrise,
  sunset: Sunset,
  device_state: Zap,
  sensor_reading: BellDot,
};

export function AutomationList() {
  const [automations, setAutomations] = useState<Automation[]>(initialMockAutomations);
  const { toast } = useToast();

  const handleToggleEnable = (id: string, enabled: boolean) => {
    setAutomations(prev => prev.map(auto => auto.id === id ? { ...auto, isEnabled: enabled } : auto));
    const automation = automations.find(a => a.id === id);
    toast({ title: `${automation?.name || 'Automation'} ${enabled ? 'Enabled' : 'Disabled'}` });
  };

  const handleEdit = (id: string) => {
    const automation = automations.find(a => a.id === id);
    toast({ title: `Editing ${automation?.name}`, description: "Automation editing UI would open here." });
  };

  const handleDelete = (id: string) => {
    const automation = automations.find(a => a.id === id);
    // Add confirmation dialog here
    setAutomations(prev => prev.filter(auto => auto.id !== id));
    toast({ title: `${automation?.name} Deleted`, variant: "destructive" });
  };

  if (automations.length === 0) {
     return <p className="text-muted-foreground">No automations set up yet. Click &quot;Create Automation&quot; to begin.</p>;
  }

  return (
    <div className="space-y-4">
      {automations.map((automation) => {
        const TriggerIcon = triggerIcons[automation.trigger.type] || Shuffle;
        return (
          <Card key={automation.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <TriggerIcon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{automation.name}</CardTitle>
                </div>
                <Switch 
                  checked={automation.isEnabled} 
                  onCheckedChange={(checked) => handleToggleEnable(automation.id, checked)}
                  aria-label={`Toggle ${automation.name}`}
                />
              </div>
              <CardDescription className="text-sm pt-1">{automation.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p><strong>Trigger:</strong> {automation.trigger.type} ({JSON.stringify(automation.trigger.details)})</p>
              <p><strong>Actions:</strong> {automation.actions.length} action{automation.actions.length === 1 ? '' : 's'}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => handleEdit(automation.id)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(automation.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
