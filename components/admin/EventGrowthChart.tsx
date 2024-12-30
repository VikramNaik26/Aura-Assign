'use client'

import { Event } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface EventGrowthChartProps {
  events: Event[]
}

export function EventGrowthChart({ events }: EventGrowthChartProps) {
  // Create sample data if no events exist
  const sampleData = [
    { date: '2024-01-01', events: 0 },
    { date: new Date().toISOString().split('T')[0], events: 0 }
  ]

  // Sort events by creation date
  const sortedEvents = [...events].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  // Create cumulative data
  const cumulativeData = sortedEvents.length > 0
    ? sortedEvents.reduce((acc, event, index) => {
      const date = event.createdAt.toISOString().split('T')[0]
      if (acc.length === 0 || acc[acc.length - 1].date !== date) {
        acc.push({ date, events: index + 1 })
      } else {
        acc[acc.length - 1].events = index + 1
      }
      return acc
    }, [] as { date: string; events: number }[])
    : sampleData

  const chartConfig = {
    events: {
      label: 'Total Events',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Growth</CardTitle>
        <CardDescription>Cumulative number of events over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className="text-muted-foreground"
              />
              <YAxis className="text-muted-foreground" />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


