import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Thermometer, Tv } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const usageData = [
  { device: "Living Room Light", type: "Light", icon: Lightbulb, usage: "25 kWh", percentage: 30, status: "High" },
  { device: "Kitchen Thermostat", type: "HVAC", icon: Thermometer, usage: "40 kWh", percentage: 50, status: "Very High" },
  { device: "Smart TV", type: "Entertainment", icon: Tv, usage: "15 kWh", percentage: 18, status: "Medium" },
  { device: "Bedroom Lamp", type: "Light", icon: Lightbulb, usage: "5 kWh", percentage: 7, status: "Low" },
   { device: "Office AC", type: "HVAC", icon: Thermometer, usage: "2 kWh", percentage: 5, status: "Low" },
]

export function DeviceUsageTable() {
  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Top Device Consumers</CardTitle>
            <CardDescription>Energy consumption by individual devices (Last 30 Days)</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[200px]">Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="w-[150px]">Contribution</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {usageData.map((item) => {
                const Icon = item.icon;
                return (
                    <TableRow key={item.device}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <Icon className="h-5 w-5 text-muted-foreground"/> {item.device}
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.usage}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                         <Progress value={item.percentage} className="h-2 w-[80px]" />
                         <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                        </div>
                    </TableCell>
                    </TableRow>
                )})}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
