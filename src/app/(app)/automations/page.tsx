
'use client';

import { useState, useEffect } from 'react'; // Added useEffect
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AutomationList } from '@/components/automations/automation-list';
import type { Automation } from '@/types';
import { AddAutomationModal } from '@/components/automations/add-automation-modal';
import { EditAutomationModal } from '@/components/automations/edit-automation-modal';
import { DeleteAutomationConfirmationModal } from '@/components/automations/delete-automation-confirmation-modal';
import { useToast } from '@/hooks/use-toast';

const initialMockAutomations: Automation[] = [
  {
    id: "1",
    name: "Morning Wake-up",
    description: "At 7 AM, open blinds and turn on bedroom lights.",
    isEnabled: true,
    trigger: { type: "time", details: { time: "07:00" } },
    actions: [
      { type: "device_action", details: { deviceId: "bedroom-blinds", command: "open" } },
      { type: "device_action", details: { deviceId: "bedroom-light", command: "turnOn", value: "soft white" } },
    ]
  },
  {
    id: "2",
    name: "Sunset Lighting",
    description: "Turn on outdoor lights at sunset.",
    isEnabled: true,
    trigger: { type: "sunset", details: { offset: "-15m" } },
    actions: [{ type: "device_action", details: { deviceId: "outdoor-lights", command: "turnOn" } }]
  },
  {
    id: "3",
    name: "Movie Mode Trigger",
    description: "If Movie Night scene is active, dim hallway lights.",
    isEnabled: false,
    trigger: { type: "device_state", details: { sceneId: "movie-night-scene", state: "active" } },
    actions: [{ type: "device_action", details: { deviceId: "hallway-light", command: "dim", value: 10 } }]
  },
   {
    id: "4",
    name: "Security Alert",
    description: "If door sensor opens after 11 PM, send notification.",
    isEnabled: true,
    trigger: { type: "sensor_reading", details: { deviceId: "door-sensor", value: "open", condition: "after:23:00" } },
    actions: [{ type: "notification", details: { message: "Front door opened late at night!" } }]
  },
];


export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isAddAutomationModalOpen, setIsAddAutomationModalOpen] = useState(false);
  const [isEditAutomationModalOpen, setIsEditAutomationModalOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [isDeleteAutomationModalOpen, setIsDeleteAutomationModalOpen] = useState(false);
  const [deletingAutomationId, setDeletingAutomationId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load automations from localStorage on mount
  useEffect(() => {
    try {
      const storedAutomations = localStorage.getItem('smartHavenAutomations');
      if (storedAutomations) {
        setAutomations(JSON.parse(storedAutomations));
      } else {
        setAutomations(initialMockAutomations);
      }
    } catch (error) {
      console.error("Failed to load automations from localStorage:", error);
      setAutomations(initialMockAutomations); // Fallback
    }
  }, []);

  // Save automations to localStorage whenever they change
  useEffect(() => {
    try {
      if (automations.length > 0 || localStorage.getItem('smartHavenAutomations')) {
        localStorage.setItem('smartHavenAutomations', JSON.stringify(automations));
      }
    } catch (error) {
      console.error("Failed to save automations to localStorage:", error);
    }
  }, [automations]);


  const handleAutomationAdd = (newAutomationData: Pick<Automation, 'name' | 'description'>) => {
    const newAutomation: Automation = {
      ...newAutomationData,
      id: String(automations.length + 1 + Date.now()),
      isEnabled: true, 
      trigger: { type: 'time', details: { time: '12:00' } }, 
      actions: [], 
    };
    setAutomations(prevAutomations => [...prevAutomations, newAutomation]);
    toast({
      title: 'Automation Created',
      description: `${newAutomation.name} has been successfully created.`,
    });
  };

  const handleToggleEnable = (id: string, enabled: boolean) => {
    setAutomations(prev => prev.map(auto => auto.id === id ? { ...auto, isEnabled: enabled } : auto));
    const automation = automations.find(a => a.id === id);
    toast({ title: `${automation?.name || 'Automation'} ${enabled ? 'Enabled' : 'Disabled'}` });
  };

  const handleOpenEditModal = (id: string) => {
    const automationToEdit = automations.find(auto => auto.id === id);
    if (automationToEdit) {
      setEditingAutomation(automationToEdit);
      setIsEditAutomationModalOpen(true);
    } else {
      toast({ title: "Error", description: "Automation not found.", variant: "destructive" });
    }
  };

  const handleAutomationUpdate = (updatedData: Pick<Automation, 'id' | 'name' | 'description'>) => {
    setAutomations(prev => 
      prev.map(auto => 
        auto.id === updatedData.id ? { ...auto, ...updatedData } : auto
      )
    );
    setEditingAutomation(null);
    toast({
      title: "Automation Updated",
      description: `${updatedData.name} has been successfully updated.`,
    });
  };

  const handleOpenDeleteAutomationModal = (automationId: string) => {
    setDeletingAutomationId(automationId);
    setIsDeleteAutomationModalOpen(true);
  };

  const handleConfirmDeleteAutomation = () => {
    if (deletingAutomationId) {
      const automationToDelete = automations.find(auto => auto.id === deletingAutomationId);
      setAutomations(prev => prev.filter(auto => auto.id !== deletingAutomationId));
      toast({
        title: "Automation Deleted",
        description: `${automationToDelete?.name || 'Automation'} has been successfully deleted.`,
        variant: "destructive"
      });
      setDeletingAutomationId(null);
      setIsDeleteAutomationModalOpen(false);
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations"
        description="Let your home work for you with custom automated routines."
        actions={
          <Button onClick={() => setIsAddAutomationModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Automation
          </Button>
        }
      />
      <AutomationList
        automations={automations}
        onToggleEnable={handleToggleEnable}
        onEdit={handleOpenEditModal} 
        onDelete={handleOpenDeleteAutomationModal}
      />
      <AddAutomationModal
        isOpen={isAddAutomationModalOpen}
        onOpenChange={setIsAddAutomationModalOpen}
        onAutomationAdd={handleAutomationAdd}
      />
      {editingAutomation && (
        <EditAutomationModal
          isOpen={isEditAutomationModalOpen}
          onOpenChange={setIsEditAutomationModalOpen}
          automationToEdit={editingAutomation}
          onAutomationUpdate={handleAutomationUpdate}
        />
      )}
      {deletingAutomationId && (
        <DeleteAutomationConfirmationModal
          isOpen={isDeleteAutomationModalOpen}
          onOpenChange={setIsDeleteAutomationModalOpen}
          automationName={automations.find(auto => auto.id === deletingAutomationId)?.name || 'this automation'}
          onConfirmDelete={handleConfirmDeleteAutomation}
        />
      )}
    </div>
  );
}
