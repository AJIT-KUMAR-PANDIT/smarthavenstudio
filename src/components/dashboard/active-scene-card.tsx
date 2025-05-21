"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clapperboard, ZapOff, Moon, Sun } from "lucide-react";
import type { Scene } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockScenes: Scene[] = [
  { id: "1", name: "Movie Night", description: "Dim lights, cozy temperature.", isActive: true, actions: [], icon: Moon },
  { id: "2", name: "Morning Routine", description: "Bright lights, blinds open.", isActive: false, actions: [], icon: Sun },
  { id: "3", name: "Focus Mode", description: "Cool lighting, minimal distractions.", isActive: false, actions: [], icon: Clapperboard },
];


export function ActiveSceneCard() {
  const [activeSceneId, setActiveSceneId] = useState<string | null>(mockScenes.find(s => s.isActive)?.id || null);
  const activeScene = mockScenes.find(s => s.id === activeSceneId);

  const handleSceneChange = (sceneId: string) => {
    setActiveSceneId(sceneId);
    // Here you would typically send a command to activate the scene
  };
  
  const handleDeactivateScene = () => {
    setActiveSceneId(null);
     // Here you would typically send a command to deactivate all scenes
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clapperboard className="h-6 w-6 text-primary" />
          Active Scene
        </CardTitle>
        <CardDescription>
          {activeScene ? `Current: ${activeScene.name} - ${activeScene.description}` : "No scene currently active."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={handleSceneChange} defaultValue={activeSceneId || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a scene to activate" />
          </SelectTrigger>
          <SelectContent>
            {mockScenes.map(scene => (
              <SelectItem key={scene.id} value={scene.id}>
                <div className="flex items-center gap-2">
                  {scene.icon && <scene.icon className="h-4 w-4" />}
                  {scene.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeScene && (
          <Button variant="destructive" className="w-full" onClick={handleDeactivateScene}>
            <ZapOff className="mr-2 h-4 w-4" /> Deactivate Scene
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
