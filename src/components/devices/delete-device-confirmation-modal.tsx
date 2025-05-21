
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteDeviceConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirmDelete: () => void;
  deviceName: string;
}

export function DeleteDeviceConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirmDelete,
  deviceName,
}: DeleteDeviceConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the device "{deviceName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={onConfirmDelete}>Delete</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
