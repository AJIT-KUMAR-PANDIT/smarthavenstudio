
"use client";

import type { Scene } from "@/types";
import { SceneCard } from "./scene-card";
// Icons are now managed by the parent or default in AddSceneForm/SceneCard
// import { Moon, Sun, Film, Zap, Coffee, Palette } from "lucide-react";
// No longer need useToast or useState here as they are managed by parent page
// import { useState } from "react";
// import { useToast } from "@/hooks/use-toast";


interface SceneListProps {
  scenes: Scene[];
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SceneList({ scenes, onActivate, onDeactivate, onEdit, onDelete }: SceneListProps) {
  // Removed local state management for scenes and toast, as these are now props

  if (scenes.length === 0) {
     return <p className="text-muted-foreground text-center py-10">No scenes created yet. Try the AI Suggester or click &quot;Create Scene&quot;.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {scenes.map((scene) => (
        <SceneCard
          key={scene.id}
          scene={scene}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
