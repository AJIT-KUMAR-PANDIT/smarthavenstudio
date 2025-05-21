
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { EnergyDataPoint } from "@/types"

const chartData: EnergyDataPoint[] = [
  { time: "Jan", consumption: 186 },
  { time: "Feb", consumption: 305 },
  { time: "Mar", consumption: 237 },
  { time: "Apr", consumption: 273 },
  { time: "May", consumption: 209 },
  { time: "Jun", consumption: 214 },
  { time: "Jul", consumption: 250 },
  { time: "Aug", consumption: 180 },
  { time: "Sep", consumption: 220 },
  { time: "Oct", consumption: 190 },
  { time: "Nov", consumption: 240 },
  { time: "Dec", consumption: 310 },
]

const chartConfig = {
  consumption: {
    label: "Energy (kWh)",
    color: "hsl(var(--primary))",
  },
}

export function EnergyUsageChart() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Energy Usage Overview</CardTitle>
        <CardDescription>Monthly energy consumption for the current year.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer config={chartConfig} className="h-[300px] w-full min-w-[600px]">
            {/* ResponsiveContainer will adapt to ChartContainer's size */}
            <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Legend />
              <Bar dataKey="consumption" fill="var(--color-consumption)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total energy consumption for the last 12 months.
        </div>
      </CardFooter>
    </Card>
  )
}
