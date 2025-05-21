
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddRoomForm } from './add-room-form';
import type { Room } from '@/types';

interface AddRoomModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRoomAdd: (roomData: Omit<Room, 'id' | 'devices' | 'icon'>) => void;
}

export function AddRoomModal({ isOpen, onOpenChange, onRoomAdd }: AddRoomModalProps) {
  const handleRoomAdded = (roomData: Omit<Room, 'id' | 'devices' | 'icon'>) => {
    onRoomAdd(roomData);
    onOpenChange(false); // Close modal after adding
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Organize your devices by creating a new room.
          </DialogDescription>
        </DialogHeader>
        <AddRoomForm onRoomAdd={handleRoomAdded} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
