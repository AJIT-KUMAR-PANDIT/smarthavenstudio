import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Info, Zap, Brain, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SmartHaven',
  description: 'Learn more about the SmartHaven application.',
};

export default function AboutPage() {
  // Get app version from package.json or environment variable in a real app
  const appVersion = "1.0.0 (Beta)";

  return (
    <div className="space-y-6">
      <PageHeader 
        title="About SmartHaven"
        description="Empowering your smart home experience."
      />
      
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4" />
          <CardTitle className="text-3xl">SmartHaven</CardTitle>
          <CardDescription>Version {appVersion}</CardDescription>
        </CardHeader>
        <CardContent className="text-center max-w-2xl mx-auto space-y-4">
          <p className="text-lg">
            SmartHaven is a cutting-edge smart home control application designed to bring seamless automation,
            intelligent insights, and intuitive control to your fingertips.
          </p>
          <p className="text-muted-foreground">
            Our mission is to simplify your life by making your home smarter, more energy-efficient, 
            and perfectly attuned to your habits and preferences.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="shadow-md">
            <CardHeader className="items-center text-center">
                <Zap className="h-10 w-10 text-primary mb-2"/>
                <CardTitle>Powerful Control</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
                Manage all your MQTT and HTTPS devices from one place, with real-time status and control.
            </CardContent>
        </Card>
         <Card className="shadow-md">
            <CardHeader className="items-center text-center">
                <Brain className="h-10 w-10 text-primary mb-2"/>
                <CardTitle>AI-Driven Automation</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
                Leverage AI to create personalized scenes and automations that learn and adapt to you.
            </CardContent>
        </Card>
         <Card className="shadow-md">
            <CardHeader className="items-center text-center">
                <Users className="h-10 w-10 text-primary mb-2"/>
                <CardTitle>User-Focused Design</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
                Enjoy a sleek, customizable interface that works beautifully on web and mobile.
            </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardContent className="pt-6 text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SmartHaven. All rights reserved.</p>
            <p>Built with Next.js, Tailwind CSS, and lots of <span className="text-red-500">&hearts;</span>.</p>
        </CardContent>
      </Card>
    </div>
  );
}
