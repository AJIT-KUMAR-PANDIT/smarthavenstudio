
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditAutomationForm } from './edit-automation-form';
import type { Automation, AutomationAction } from '@/types';

interface EditAutomationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  automationToEdit: Automation | null;
  onAutomationUpdate: (automationData: Automation) => void;
}

export function EditAutomationModal({ isOpen, onOpenChange, automationToEdit, onAutomationUpdate }: EditAutomationModalProps) {
  if (!automationToEdit) {
    return null;
  }

  const handleAutomationUpdated = (automationData: Automation) => {
    onAutomationUpdate(automationData);
    onOpenChange(false); // Close modal after updating
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]"> {/* Increased width & height for actions */}
        <DialogHeader>
          <DialogTitle>Edit Automation: {automationToEdit.name}</DialogTitle>
          <DialogDescription>
            Modify the details, trigger, and actions for your automated routine.
          </DialogDescription>
        </DialogHeader>
        <EditAutomationForm
          automationToEdit={automationToEdit}
          onAutomationUpdate={handleAutomationUpdated}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
