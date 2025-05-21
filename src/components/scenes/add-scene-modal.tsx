
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddSceneForm } from './add-scene-form';
import type { Scene } from '@/types';

interface AddSceneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSceneAdd: (sceneData: Omit<Scene, 'id' | 'isActive' | 'icon' | 'actions'>) => void;
}

export function AddSceneModal({ isOpen, onOpenChange, onSceneAdd }: AddSceneModalProps) {
  const handleSceneAdded = (sceneData: Omit<Scene, 'id' | 'isActive' | 'icon' | 'actions'>) => {
    onSceneAdd(sceneData);
    onOpenChange(false); // Close modal after adding
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Scene</DialogTitle>
          <DialogDescription>
            Set up a new scene to control multiple devices with a single command.
          </DialogDescription>
        </DialogHeader>
        <AddSceneForm onSceneAdd={handleSceneAdded} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
