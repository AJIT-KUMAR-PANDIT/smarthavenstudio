"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const data = [
  { name: "Lighting", value: 400, fill: "hsl(var(--chart-1))" },
  { name: "HVAC", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Appliances", value: 300, fill: "hsl(var(--chart-3))" },
  { name: "Entertainment", value: 200, fill: "hsl(var(--chart-4))" },
  { name: "Other", value: 150, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  value: {
    label: "Energy (kWh)",
  },
  lighting: { label: "Lighting", color: "hsl(var(--chart-1))" },
  hvac: { label: "HVAC", color: "hsl(var(--chart-2))" },
  appliances: { label: "Appliances", color: "hsl(var(--chart-3))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
}


export function EnergyBreakdownChart() {
  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>Energy Consumption Breakdown</CardTitle>
        <CardDescription>Distribution of energy usage by category (Last 30 Days)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
