import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AutomationList } from '@/components/automations/automation-list';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Automations - SmartHaven',
  description: 'Set up and manage your smart home automations.',
};

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Automations" 
        description="Let your home work for you with custom automated routines."
        actions={
          <Button asChild>
            <Link href="/automations/new"> {/* Assuming a route for creating new automations */}
              <PlusCircle className="mr-2 h-4 w-4" /> Create Automation
            </Link>
          </Button>
        }
      />
      <AutomationList />
    </div>
  );
}
