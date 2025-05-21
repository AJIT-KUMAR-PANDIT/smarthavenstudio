
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditSceneForm } from './edit-scene-form';
import type { Scene } from '@/types';

interface EditSceneModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sceneToEdit: Scene | null;
  onSceneUpdate: (sceneData: Scene) => void; // Changed to expect full Scene object
}

export function EditSceneModal({ isOpen, onOpenChange, sceneToEdit, onSceneUpdate }: EditSceneModalProps) {
  if (!sceneToEdit) return null;

  const handleSceneUpdated = (sceneData: Scene) => {
    onSceneUpdate(sceneData);
    onOpenChange(false); // Close modal after updating
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl"> {/* Increased width */}
        <DialogHeader>
          <DialogTitle>Edit Scene: {sceneToEdit.name}</DialogTitle>
          <DialogDescription>
            Modify the details and device actions for your smart scene.
          </DialogDescription>
        </DialogHeader>
        <EditSceneForm
          sceneToEdit={sceneToEdit}
          onSceneUpdate={handleSceneUpdated}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
