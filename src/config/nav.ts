import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ToggleRight,
  DoorOpen,
  Clapperboard,
  Route,
  Shuffle,
  BarChart3,
  Zap,
  Bell,
  CreditCard,
  HelpCircle,
  Info,
  FileText,
  Settings,
  LockKeyhole,
  QrCode,
  Home
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[];
}

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Devices',
    href: '/devices',
    icon: ToggleRight,
  },
  {
    title: 'Rooms',
    href: '/rooms',
    icon: DoorOpen,
  },
  {
    title: 'Scenes',
    href: '/scenes',
    icon: Clapperboard,
  },
  {
    title: 'Automations',
    href: '/automations',
    icon: Shuffle, // Using Shuffle for Automations
  },
];

export const secondaryNavItems: NavItem[] = [
   {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Electricity',
    href: '/electricity',
    icon: Zap,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    label: '3', // Example notification count
  },
];


export const userNavItems: NavItem[] = [
  {
    title: 'My Plan',
    href: '/my-plan',
    icon: CreditCard,
  },
  {
    title: 'Support',
    href: '/support',
    icon: HelpCircle,
  },
  {
    title: 'About',
    href: '/about',
    icon: Info,
  },
  {
    title: 'Logs',
    href: '/logs',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const allNavItems = [...mainNavItems, ...secondaryNavItems, ...userNavItems];
