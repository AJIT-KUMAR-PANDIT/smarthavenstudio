
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wand2, Film, Sun, Coffee, Palette, Zap, Moon, type LucideIcon } from 'lucide-react';
import { SceneList } from '@/components/scenes/scene-list';
import { AiSceneSuggester } from '@/components/scenes/ai-scene-suggester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddSceneModal } from '@/components/scenes/add-scene-modal';
import { EditSceneModal } from '@/components/scenes/edit-scene-modal';
import { DeleteSceneConfirmationModal } from '@/components/scenes/delete-scene-confirmation-modal';
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

// Helper to re-apply icons from mock data after loading from localStorage
const rehydrateSceneIcons = (scenesToHydrate: Scene[]): Scene[] => {
  return scenesToHydrate.map(scene => {
    const mockScene = initialMockScenes.find(ms => ms.id === scene.id);
    return {
      ...scene,
      icon: mockScene ? mockScene.icon : Film, // Default to Film icon if not found
    };
  });
};


export default function ScenesPage() {
  const [isAddSceneModalOpen, setIsAddSceneModalOpen] = useState(false);
  const [isEditSceneModalOpen, setIsEditSceneModalOpen] = useState(false);
  const [isDeleteSceneModalOpen, setIsDeleteSceneModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [deletingSceneId, setDeletingSceneId] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const { toast } = useToast();

  // Load scenes from localStorage on mount
  useEffect(() => {
    try {
      const storedScenes = localStorage.getItem('smartHavenScenes');
      if (storedScenes) {
        const parsedScenes: Omit<Scene, 'icon'>[] = JSON.parse(storedScenes);
        setScenes(rehydrateSceneIcons(parsedScenes as Scene[])); // Cast as Scene[] and let rehydrate handle icon
      } else {
        setScenes(initialMockScenes); // Already has icons
      }
    } catch (error) {
      console.error("Failed to load scenes from localStorage:", error);
      setScenes(initialMockScenes); // Fallback
    }
  }, []);

  // Save scenes to localStorage whenever they change
  useEffect(() => {
    try {
      // Create a version of scenes without the icon component for serialization
      const scenesToStore = scenes.map(({ icon, ...rest }) => rest);
      if (scenesToStore.length > 0 || localStorage.getItem('smartHavenScenes')) {
         localStorage.setItem('smartHavenScenes', JSON.stringify(scenesToStore));
      }
    } catch (error) {
      console.error("Failed to save scenes to localStorage:", error);
    }
  }, [scenes]);


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

  const handleOpenEditModal = (sceneId: string) => {
    const sceneToEdit = scenes.find(s => s.id === sceneId);
    if (sceneToEdit) {
      setEditingScene(sceneToEdit);
      setIsEditSceneModalOpen(true);
    } else {
      toast({ title: "Error", description: "Scene not found.", variant: "destructive" });
    }
  };

  const handleSceneUpdate = (updatedSceneData: Pick<Scene, 'id' | 'name' | 'description'>) => {
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

  const handleOpenDeleteModal = (sceneId: string) => {
    setDeletingSceneId(sceneId);
    setIsDeleteSceneModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingSceneId) {
      const sceneToDelete = scenes.find(s => s.id === deletingSceneId);
      setScenes(prevScenes => prevScenes.filter(s => s.id !== deletingSceneId));
      toast({
        title: 'Scene Deleted',
        description: `${sceneToDelete?.name || 'Scene'} has been removed.`,
        variant: 'destructive',
      });
      setDeletingSceneId(null);
      setIsDeleteSceneModalOpen(false);
    }
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
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
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
      {editingScene && (
        <EditSceneModal
          isOpen={isEditSceneModalOpen}
          onOpenChange={setIsEditSceneModalOpen}
          sceneToEdit={editingScene}
          onSceneUpdate={handleSceneUpdate}
        />
      )}
      {deletingSceneId && (
        <DeleteSceneConfirmationModal
          isOpen={isDeleteSceneModalOpen}
          onOpenChange={setIsDeleteSceneModalOpen}
          sceneName={scenes.find(s => s.id === deletingSceneId)?.name || 'this scene'}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
