"use client";

import type { Scene } from "@/types";
import { SceneCard } from "./scene-card";
import { Moon, Sun, Film, Zap, Coffee, Palette } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const initialMockScenes: Scene[] = [
  { id: "1", name: "Movie Night", description: "Dim lights, enable surround sound, close blinds.", isActive: false, actions: [{deviceId: 'light1', action: 'dim', value: 20}], icon: Film },
  { id: "2", name: "Good Morning", description: "Gradually brighten lights, open blinds, play soft music.", isActive: false, actions: [], icon: Sun },
  { id: "3", name: "Focus Work", description: "Set cool white light, minimize distractions.", isActive: false, actions: [], icon: Palette },
  { id: "4", name: "Away Mode", description: "Turn off all non-essential devices, arm security.", isActive: false, actions: [], icon: Zap },
  { id: "5", name: "Dinner Time", description: "Warm lighting in dining area, soft background music.", isActive: false, actions: [], icon: Coffee },
  { id: "6", name: "Bedtime", description: "Dim all lights, set thermostat to sleep mode.", isActive: false, actions: [], icon: Moon },
];

export function SceneList() {
  const [scenes, setScenes] = useState<Scene[]>(initialMockScenes);
  const { toast } = useToast();

  const handleActivate = (id: string) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === id ? { ...scene, isActive: true } : { ...scene, isActive: false } // Only one scene active at a time
      )
    );
    const scene = scenes.find(s => s.id === id);
    toast({ title: `${scene?.name || 'Scene'} Activated`, description: scene?.description });
  };
  
  const handleDeactivate = (id: string) => {
     setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === id ? { ...scene, isActive: false } : scene
      )
    );
    const scene = scenes.find(s => s.id === id);
    toast({ title: `${scene?.name || 'Scene'} Deactivated` });
  }

  const handleEdit = (id: string) => {
    const scene = scenes.find(s => s.id === id);
    toast({ title: `Editing ${scene?.name}`, description: "Scene editing UI would open here." });
  };

  const handleDelete = (id: string) => {
    const scene = scenes.find(s => s.id === id);
    // Add confirmation dialog here in a real app
    setScenes(prevScenes => prevScenes.filter(scene => scene.id !== id));
    toast({ title: `${scene?.name} Deleted`, variant: "destructive" });
  };
  
  if (scenes.length === 0) {
     return <p className="text-muted-foreground">No scenes created yet. Try the AI Suggester or click &quot;Create Scene&quot;.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {scenes.map((scene) => (
        <SceneCard 
          key={scene.id} 
          scene={scene} 
          onActivate={handleActivate} 
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
