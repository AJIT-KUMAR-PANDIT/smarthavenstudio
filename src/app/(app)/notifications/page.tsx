import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { NotificationItem } from '@/components/notifications/notification-item';
import type { NotificationMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCheck, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Notifications - SmartHaven',
  description: 'View your smart home notifications and alerts.',
};

const mockNotifications: NotificationMessage[] = [
  { id: "1", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), title: "Security Alert", message: "Front door was opened while 'Away Mode' was active.", read: false, type: 'alert' },
  { id: "2", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), title: "Device Offline", message: "Living Room Light appears to be offline. Please check its connection.", read: false, type: 'alert' },
  { id: "3", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), title: "Scene Activated", message: "'Movie Night' scene was successfully activated.", read: true, type: 'info' },
  { id: "4", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), title: "Automation Ran", message: "'Good Morning' automation completed.", read: true, type: 'update' },
  { id: "5", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), title: "Low Battery", message: "Kitchen Smoke Detector battery is low (15%).", read: true, type: 'reminder' },
];

export default function NotificationsPage() {
  // In a real app, these actions would update state and call an API
  const handleMarkAllRead = () => alert("Mark all as read functionality");
  const handleClearAll = () => alert("Clear all notifications functionality");

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        description="Stay updated with alerts and important information from your smart home."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleMarkAllRead}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear all
            </Button>
          </div>
        }
      />
      
      {mockNotifications.length > 0 ? (
        <div className="space-y-3">
          {mockNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No notifications to display.</p>
      )}
    </div>
  );
}
