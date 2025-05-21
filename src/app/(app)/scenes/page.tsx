import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wand2 } from 'lucide-react';
import { SceneList } from '@/components/scenes/scene-list';
import { AiSceneSuggester } from '@/components/scenes/ai-scene-suggester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Scenes - SmartHaven',
  description: 'Create and manage your smart home scenes.',
};

export default function ScenesPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Smart Scenes" 
        description="Automate multiple device actions with a single tap or voice command."
        actions={
          <Button asChild>
            <Link href="/scenes/new"> {/* Assuming a route for creating new scenes */}
              <PlusCircle className="mr-2 h-4 w-4" /> Create Scene
            </Link>
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
          <SceneList />
        </TabsContent>
        <TabsContent value="ai-suggester" className="mt-6">
          <AiSceneSuggester />
        </TabsContent>
      </Tabs>
    </div>
  );
}
