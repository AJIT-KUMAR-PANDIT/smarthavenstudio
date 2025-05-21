
import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from '@/components/settings/profile-settings';
import { SecuritySettings } from '@/components/settings/security-settings';
import { MenuCustomization } from '@/components/settings/menu-customization';
import { ThemeSwitcher } from '@/components/settings/theme-switcher';
import { ConnectivitySettings } from '@/components/settings/connectivity-settings'; // Added
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, Shield, ListCollapse, Palette, Network } from "lucide-react"; // Added Network

export const metadata: Metadata = {
  title: 'Settings - SmartHaven',
  description: 'Manage your SmartHaven account and application settings.',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Configure your SmartHaven experience."
      />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6"> {/* Adjusted grid-cols for new tab */}
          <TabsTrigger value="profile"><UserCog className="mr-2 h-4 w-4 sm:hidden md:inline-block"/>Profile</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4 sm:hidden md:inline-block"/>Security</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4 sm:hidden md:inline-block"/>Appearance</TabsTrigger>
          <TabsTrigger value="connectivity"><Network className="mr-2 h-4 w-4 sm:hidden md:inline-block"/>Connectivity</TabsTrigger> {/* Added Connectivity Tab */}
          <TabsTrigger value="menu"><ListCollapse className="mr-2 h-4 w-4 sm:hidden md:inline-block"/>Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-medium">Theme</h4>
                        <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
                    </div>
                    <ThemeSwitcher />
                </div>
                 {/* Placeholder for font size or other appearance settings */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-medium">Density</h4>
                        <p className="text-sm text-muted-foreground">Adjust interface density (coming soon).</p>
                    </div>
                    <span className="text-sm text-muted-foreground">Default</span>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="connectivity"> {/* Added Connectivity Content */}
          <ConnectivitySettings />
        </TabsContent>
        <TabsContent value="menu">
          <MenuCustomization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
