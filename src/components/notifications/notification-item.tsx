import type { NotificationMessage } from "@/types";
import { cn } from "@/lib/utils";
import { Bell, AlertTriangle, Info, CheckCircle, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationItemProps {
  notification: NotificationMessage;
}

const typeIcons = {
  alert: AlertTriangle,
  info: Info,
  update: CheckCircle,
  reminder: CalendarClock,
};

const typeColors = {
  alert: "border-red-500 bg-red-500/10 text-red-400",
  info: "border-blue-500 bg-blue-500/10 text-blue-400",
  update: "border-green-500 bg-green-500/10 text-green-400",
  reminder: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const Icon = notification.icon || typeIcons[notification.type] || Bell;
  const colorClasses = typeColors[notification.type] || "border-muted bg-muted/20";

  return (
    <div className={cn(
        "flex items-start gap-3 p-4 rounded-lg border transition-colors hover:bg-muted/50", 
        colorClasses,
        !notification.read && "bg-card shadow-md" // More prominent if unread
        )}>
      <Icon className={cn("h-6 w-6 mt-1 flex-shrink-0", !notification.read && "text-primary")} />
      <div className="flex-grow">
        <div className="flex items-center justify-between">
            <h4 className={cn("font-semibold text-foreground", !notification.read && "text-lg")}>{notification.title}</h4>
            {!notification.read && <Badge variant="default" className="bg-primary text-xs">New</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
}
