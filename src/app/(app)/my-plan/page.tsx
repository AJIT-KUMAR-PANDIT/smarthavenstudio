import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Plan - SmartHaven',
  description: 'View and manage your SmartHaven subscription plan.',
};

export default function MyPlanPage() {
  // Mock plan data
  const currentPlan = {
    name: "Premium Plus",
    price: "$19.99/month",
    devices: "Unlimited",
    scenes: "Unlimited",
    automations: "Unlimited",
    aiFeatures: "Advanced AI Suggestions",
    support: "Priority Support",
    billingDate: "Renews on July 30, 2024",
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Plan" 
        description="Manage your subscription and explore upgrade options."
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-400" /> {currentPlan.name}
            </CardTitle>
            <span className="text-xl font-semibold text-primary">{currentPlan.price}</span>
          </div>
          <CardDescription>{currentPlan.billingDate}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {currentPlan.devices} Devices</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {currentPlan.scenes} Scenes</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {currentPlan.automations} Automations</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {currentPlan.aiFeatures}</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {currentPlan.support}</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 items-center border-t pt-4">
          <Button variant="outline">Change Payment Method</Button>
          <Button variant="destructive">Cancel Subscription</Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />Explore Other Plans</CardTitle>
            <CardDescription>Find a plan that best suits your needs.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Basic</h4>
                    <p className="text-sm text-muted-foreground">$9.99/month. Up to 10 devices.</p>
                    <Button size="sm" variant="link" className="p-0 h-auto mt-1">Learn More</Button>
                </div>
                 <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Pro</h4>
                    <p className="text-sm text-muted-foreground">$29.99/month. All features + business tools.</p>
                    <Button size="sm" variant="link" className="p-0 h-auto mt-1">Learn More</Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
