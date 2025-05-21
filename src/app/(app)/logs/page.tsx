import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import type { LogEntry } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'System Logs - SmartHaven',
  description: 'View system activity and device logs.',
};

const mockLogs: LogEntry[] = [
  { id: "1", timestamp: new Date().toISOString(), level: "info", message: "User 'demo@example.com' logged in.", source: "AuthSystem" },
  { id: "2", timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), level: "debug", message: "Device 'Living Room Light' status updated to ON.", source: "DeviceManager" },
  { id: "3", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), level: "warning", message: "Device 'Kitchen Thermostat' reported unusual temperature fluctuation.", source: "Device:KitchenThermo" },
  { id: "4", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), level: "error", message: "Failed to connect to MQTT broker. Retrying...", source: "MQTTClient" },
  { id: "5", timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), level: "info", message: "Automation 'Sunset Lighting' triggered.", source: "AutomationEngine" },
  { id: "6", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), level: "info", message: "'Movie Night' scene activated by user.", source: "SceneManager" },
];

const getBadgeVariant = (level: LogEntry['level']) => {
  switch (level) {
    case 'error': return 'destructive';
    case 'warning': return 'default'; // Tailwind yellow is not default, custom style needed or use primary/secondary
    case 'info': return 'secondary';
    case 'debug': return 'outline';
    default: return 'default';
  }
};
const getBadgeColorClass = (level: LogEntry['level']) => {
  switch (level) {
    case 'error': return 'bg-red-500/80 hover:bg-red-500/70';
    case 'warning': return 'bg-yellow-500/80 hover:bg-yellow-500/70 text-black';
    case 'info': return 'bg-blue-500/80 hover:bg-blue-500/70';
    case 'debug': return 'bg-gray-500/80 hover:bg-gray-500/70';
    default: return 'bg-primary';
  }
}


export default function LogsPage() {
  // Add filtering and pagination state here in a real app
  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Logs" 
        description="Monitor system events, device activity, and troubleshoot issues."
        actions={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input placeholder="Filter logs..." className="w-full sm:max-w-xs bg-card" />
                <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-card">
                        <SelectValue placeholder="Log Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                </Select>
                 <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
                 <Button variant="default" className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Export Logs
                </Button>
            </div>
        }
      />
      
      <div className="rounded-lg border shadow-sm bg-card">
        <Table>
          <TableCaption>A list of recent system and device logs. For older logs, please export.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead className="w-[100px]">Level</TableHead>
              <TableHead className="w-[200px]">Source</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs">{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(log.level)} className={getBadgeColorClass(log.level)}>
                    {log.level.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{log.source || 'System'}</TableCell>
                <TableCell className="text-sm">{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {/* Pagination controls would go here */}
       <div className="flex justify-center mt-4">
            <Button variant="outline">Load More Logs</Button>
       </div>
    </div>
  );
}
