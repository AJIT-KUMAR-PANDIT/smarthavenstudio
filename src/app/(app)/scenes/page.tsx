
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wand2, Film, Sun, Coffee, Palette, Zap, Moon } from 'lucide-react';
import { SceneList } from '@/components/scenes/scene-list';
import { AiSceneSuggester } from '@/components/scenes/ai-scene-suggester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSceneModal } from '@/components/scenes/add-scene-modal';
import type { Scene } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Metadata should be handled in a parent Server Component or layout if this page is client-side.
// export const metadata: Metadata = {
//   title: 'Scenes - SmartHaven',
//   description: 'Create and manage your smart home scenes.',
// };

const initialMockScenes: Scene[] = [
  { id: "1", name: "Movie Night", description: "Dim lights, enable surround sound, close blinds.", isActive: false, actions: [{deviceId: 'light1', action: 'dim', value: 20}], icon: Film },
  { id: "2", name: "Good Morning", description: "Gradually brighten lights, open blinds, play soft music.", isActive: false, actions: [], icon: Sun },
  { id: "3", name: "Focus Work", description: "Set cool white light, minimize distractions.", isActive: false, actions: [], icon: Palette },
  { id: "4", name: "Away Mode", description: "Turn off all non-essential devices, arm security.", isActive: false, actions: [], icon: Zap },
  { id: "5", name: "Dinner Time", description: "Warm lighting in dining area, soft background music.", isActive: false, actions: [], icon: Coffee },
  { id: "6", name: "Bedtime", description: "Dim all lights, set thermostat to sleep mode.", isActive: false, actions: [], icon: Moon },
];

export default function ScenesPage() {
  const [isAddSceneModalOpen, setIsAddSceneModalOpen] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>(initialMockScenes);
  const { toast } = useToast();

  const handleSceneAdd = (newSceneData: Omit<Scene, 'id' | 'isActive' | 'icon' | 'actions'>) => {
    const newScene: Scene = {
      ...newSceneData,
      id: String(scenes.length + 1 + Date.now()), // Simple unique ID
      isActive: false,
      icon: Film, // Default icon for new scenes, can be customized later
      actions: [], // Default empty actions
    };
    setScenes(prevScenes => [...prevScenes, newScene]);
    toast({
      title: 'Scene Created',
      description: `${newScene.name} has been successfully created.`,
    });
  };

  const handleActivate = (id: string) => {
    setScenes(prevScenes =>
      prevScenes.map(scene =>
        scene.id === id ? { ...scene, isActive: true } : { ...scene, isActive: false }
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
    // This would open an EditSceneModal in a full implementation
    toast({ title: `Editing ${scene?.name}`, description: "Scene editing UI would open here." });
  };

  const handleDelete = (id: string) => {
    const scene = scenes.find(s => s.id === id);
    // Add confirmation dialog here in a real app
    setScenes(prevScenes => prevScenes.filter(s => s.id !== id));
    toast({ title: `${scene?.name} Deleted`, variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Scenes"
        description="Automate multiple device actions with a single tap or voice command."
        actions={
          <Button onClick={() => setIsAddSceneModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Scene
          </Button>
        }
      />

      <Tabs defaultValue="my-scenes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="my-scenes">My Scenes</TabsTrigger>
          <TabsTrigger value="ai-suggester">
            <Wand2 className="mr-2 h-4 w-4"/> AI Suggestions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-scenes" className="mt-6">
          <SceneList
            scenes={scenes}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="ai-suggester" className="mt-6">
          <AiSceneSuggester />
        </TabsContent>
      </Tabs>

      <AddSceneModal
        isOpen={isAddSceneModalOpen}
        onOpenChange={setIsAddSceneModalOpen}
        onSceneAdd={handleSceneAdd}
      />
    </div>
  );
}
