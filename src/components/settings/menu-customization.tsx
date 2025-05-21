"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ListChecks, Settings2, GripVertical } from "lucide-react";
import { allNavItems, type NavItem } from "@/config/nav"; // Assuming nav items are defined here
import { useToast } from "@/hooks/use-toast";


interface EditableNavItem extends NavItem {
  isVisible: boolean;
}

export function MenuCustomization() {
  const [menuItems, setMenuItems] = useState<EditableNavItem[]>(
    allNavItems.map(item => ({ ...item, isVisible: true })) // Default all to visible
  );
  const { toast } = useToast();

  const handleVisibilityChange = (href: string, checked: boolean) => {
    setMenuItems(currentItems =>
      currentItems.map(item =>
        item.href === href ? { ...item, isVisible: checked } : item
      )
    );
  };
  
  const handleSaveChanges = () => {
    // In a real app, save these preferences to user settings (e.g., localStorage or backend)
    localStorage.setItem('smartHavenMenuSettings', JSON.stringify(menuItems));
    toast({
      title: "Menu Settings Saved",
      description: "Your sidebar menu preferences have been updated (feature mocked).",
    });
  };
  
  // Drag and drop functionality is complex and would require a library like react-beautiful-dnd.
  // This is a simplified version focusing on visibility.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Menu</CardTitle>
        <CardDescription>
          Choose which items appear in your sidebar menu and reorder them. (Reordering is a mock-up)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto p-1">
          {menuItems.map(item => (
            <div key={item.href} className="flex items-center justify-between p-2 border rounded-md bg-background hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor={`menu-item-${item.href}`} className="font-medium text-foreground">
                  {item.title}
                </Label>
              </div>
              <Checkbox
                id={`menu-item-${item.href}`}
                checked={item.isVisible}
                onCheckedChange={(checked) => handleVisibilityChange(item.href, !!checked)}
              />
            </div>
          ))}
        </div>
        <Button onClick={handleSaveChanges} className="mt-4">
            <ListChecks className="mr-2 h-4 w-4" /> Save Menu Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
