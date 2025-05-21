
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddAutomationForm } from './add-automation-form';
import type { Automation, AutomationAction } from '@/types';

interface AddAutomationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAutomationAdd: (automationData: Pick<Automation, 'name' | 'description' | 'trigger' | 'actions'>) => void;
}

export function AddAutomationModal({ isOpen, onOpenChange, onAutomationAdd }: AddAutomationModalProps) {
  const handleAutomationAdded = (automationData: Pick<Automation, 'name' | 'description' | 'trigger' | 'actions'>) => {
    onAutomationAdd(automationData);
    onOpenChange(false); // Close modal after adding
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]"> {/* Increased width & height for actions */}
        <DialogHeader>
          <DialogTitle>Create New Automation</DialogTitle>
          <DialogDescription>
            Set up a new automated routine for your smart home, including triggers and actions.
          </DialogDescription>
        </DialogHeader>
        <AddAutomationForm onAutomationAdd={handleAutomationAdded} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
