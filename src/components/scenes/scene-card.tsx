
"use client";

import type { Scene } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Zap, Edit3, Trash2, AlertTriangle, PowerOff } from "lucide-react"; // Added PowerOff for deactivate
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SceneCardProps {
  scene: Scene;
  onActivate: (id: string) => void;
  onDeactivate?: (id: string) => void; 
  onEdit: (id: string) => void; // Prop remains, expects id
  onDelete: (id: string) => void;
}

export function SceneCard({ scene, onActivate, onDeactivate, onEdit, onDelete }: SceneCardProps) {
  const Icon = scene.icon || Zap;

  return (
    <Card className={cn("shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col", scene.isActive && "border-primary ring-2 ring-primary")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-6 w-6", scene.isActive ? "text-primary" : "text-muted-foreground")} />
            <CardTitle className="text-lg">{scene.name}</CardTitle>
          </div>
          {scene.isActive && <Badge variant="default" className="bg-primary/80">Active</Badge>}
        </div>
        <CardDescription className="text-sm pt-1 line-clamp-2 h-[40px]">{scene.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xs text-muted-foreground">
          Actions: {scene.actions.length} device command{scene.actions.length === 1 ? '' : 's'}
        </p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4">
        {scene.isActive && onDeactivate ? (
           <Button variant="outline" size="sm" onClick={() => onDeactivate(scene.id)}>
            <PowerOff className="mr-2 h-4 w-4 text-destructive" /> Deactivate 
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={() => onActivate(scene.id)} disabled={scene.isActive}>
            <Play className="mr-2 h-4 w-4" /> Activate
          </Button>
        )}
        <div className="flex gap-2 justify-end">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(scene.id)}>
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit Scene</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(scene.id)}>
                <Trash2 className="h-4 w-4" />
                 <span className="sr-only">Delete Scene</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
