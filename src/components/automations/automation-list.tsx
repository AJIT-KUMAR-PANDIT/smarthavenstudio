
"use client";

import type { Automation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shuffle, Zap, Edit3, Trash2, Play, Pause, Sunrise, Sunset, Clock, BellDot } from "lucide-react";
// Removed useState and useToast as they are managed by parent
// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Removed initialMockAutomations, will be passed as prop

const triggerIcons = {
  time: Clock,
  sunrise: Sunrise,
  sunset: Sunset,
  device_state: Zap,
  sensor_reading: BellDot,
  // Add other trigger types if necessary
};

interface AutomationListProps {
  automations: Automation[];
  onToggleEnable: (id: string, enabled: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AutomationList({ automations, onToggleEnable, onEdit, onDelete }: AutomationListProps) {
  // const [automations, setAutomations] = useState<Automation[]>(initialMockAutomations); // Removed
  // const { toast } = useToast(); // Removed

  // Handlers are now passed as props, so local handlers are removed
  // const handleToggleEnable = (id: string, enabled: boolean) => { ... }
  // const handleEdit = (id: string) => { ... }
  // const handleDelete = (id: string) => { ... }

  if (automations.length === 0) {
     return <p className="text-muted-foreground text-center py-10">No automations set up yet. Click &quot;Create Automation&quot; to begin.</p>;
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
                  onCheckedChange={(checked) => onToggleEnable(automation.id, checked)}
                  aria-label={`Toggle ${automation.name}`}
                />
              </div>
              <CardDescription className="text-sm pt-1 line-clamp-2 h-[40px]">{automation.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p><strong>Trigger:</strong> {automation.trigger.type}
                {automation.trigger.details && Object.keys(automation.trigger.details).length > 0 &&
                 ` (${Object.entries(automation.trigger.details).map(([key, value]) => `${key}: ${value}`).join(', ')})`}
              </p>
              <p><strong>Actions:</strong> {automation.actions.length} action{automation.actions.length === 1 ? '' : 's'}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" size="sm" onClick={() => onEdit(automation.id)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(automation.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
