import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageSquare, BookOpen, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support - SmartHaven',
  description: 'Get help and support for your SmartHaven application.',
};

const faqs = [
  {
    question: "How do I add a new device?",
    answer: "Navigate to the 'Devices' page and click the 'Add Device' button. Follow the on-screen instructions to pair your smart device with SmartHaven. Ensure your device is in pairing mode.",
  },
  {
    question: "What is a Scene?",
    answer: "A Scene is a collection of pre-set actions for multiple devices that can be activated with a single command. For example, a 'Movie Night' scene might dim your lights and turn on your TV.",
  },
  {
    question: "How does AI Scene Suggestion work?",
    answer: "Our AI analyzes your device usage patterns, device capabilities, and optionally environmental data to suggest new and useful scenes tailored to your lifestyle. You can find this feature on the 'Scenes' page.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, SmartHaven uses industry-standard security practices, including HTTPS for all communications and secure authentication via Logto. Your local device data is managed by you.",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Support Center" 
        description="Find answers to your questions and get help with SmartHaven."
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" /> Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/>Documentation</CardTitle>
                <CardDescription>Explore our comprehensive guides and tutorials.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" className="w-full">Visit Knowledge Base</Button>
            </CardContent>
        </Card>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary"/>Contact Us</CardTitle>
                <CardDescription>Can&apos;t find an answer? Reach out to our support team.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full bg-primary hover:bg-primary/90">Email Support</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
