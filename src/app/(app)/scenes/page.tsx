
'use client';

import { useState, useEffect } from 'react';
// Metadata export removed as this is a client component
// import type { Metadata } from 'next'; 
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wand2, Film, Sun, Coffee, Palette, Zap, Moon } from 'lucide-react';
import { SceneList } from '@/components/scenes/scene-list';
import { AiSceneSuggester } from '@/components/scenes/ai-scene-suggester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSceneModal } from '@/components/scenes/add-scene-modal';
import { EditSceneModal } from '@/components/scenes/edit-scene-modal'; // Added
import type { Scene } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  const [isEditSceneModalOpen, setIsEditSceneModalOpen] = useState(false); // Added
  const [editingScene, setEditingScene] = useState<Scene | null>(null); // Added
  const [scenes, setScenes] = useState<Scene[]>(initialMockScenes);
  const { toast } = useToast();

  const handleSceneAdd = (newSceneData: Omit<Scene, 'id' | 'isActive' | 'icon' | 'actions'>) => {
    const newScene: Scene = {
      ...newSceneData,
      id: String(scenes.length + 1 + Date.now()), 
      isActive: false,
      icon: Film, 
      actions: [], 
    };
    setScenes(prevScenes => [...prevScenes, newScene]);
    toast({
      title: 'Scene Created',
      description: `${newScene.name} has been successfully created.`,
    });
  };

  const handleOpenEditModal = (sceneId: string) => { // Modified to take ID
    const sceneToEdit = scenes.find(s => s.id === sceneId);
    if (sceneToEdit) {
      setEditingScene(sceneToEdit);
      setIsEditSceneModalOpen(true);
    } else {
      toast({ title: "Error", description: "Scene not found.", variant: "destructive" });
    }
  };

  const handleSceneUpdate = (updatedSceneData: Pick<Scene, 'id' | 'name' | 'description'>) => { // Added
    setScenes(prevScenes =>
      prevScenes.map(scene =>
        scene.id === updatedSceneData.id ? { ...scene, ...updatedSceneData } : scene
      )
    );
    setEditingScene(null);
    toast({
      title: 'Scene Updated',
      description: `${updatedSceneData.name} has been successfully updated.`,
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
            onEdit={handleOpenEditModal} // Changed from handleDelete to handleOpenEditModal
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
      {editingScene && ( // Added
        <EditSceneModal
          isOpen={isEditSceneModalOpen}
          onOpenChange={setIsEditSceneModalOpen}
          sceneToEdit={editingScene}
          onSceneUpdate={handleSceneUpdate}
        />
      )}
    </div>
  );
}
