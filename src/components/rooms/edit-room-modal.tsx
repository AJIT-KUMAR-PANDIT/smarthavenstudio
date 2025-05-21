
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditRoomForm } from './edit-room-form';
import type { Room } from '@/types';

interface EditRoomModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roomToEdit: Room | null;
  onRoomUpdate: (roomData: Omit<Room, 'devices' | 'icon'>) => void;
}

export function EditRoomModal({ isOpen, onOpenChange, roomToEdit, onRoomUpdate }: EditRoomModalProps) {
  if (!roomToEdit) return null;

  const handleRoomUpdated = (roomData: Omit<Room, 'devices' | 'icon'>) => {
    onRoomUpdate(roomData);
    onOpenChange(false); // Close modal after updating
  };

  const handleDialogClose = (open: boolean) => {
    onOpenChange(open);
    if (!open && roomToEdit) {
      // Optionally reset form state if needed, though EditRoomForm's useEffect handles pre-filling
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Room: {roomToEdit.name}</DialogTitle>
          <DialogDescription>
            Modify the details for your room.
          </DialogDescription>
        </DialogHeader>
        <EditRoomForm
          roomToEdit={roomToEdit}
          onRoomUpdate={handleRoomUpdated}
          onCancel={() => handleDialogClose(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
