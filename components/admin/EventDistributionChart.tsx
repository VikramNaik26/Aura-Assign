'use client'

import { Event, PaymentBasis } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"

interface EventDistributionChartProps {
  events: Event[]
}

export function EventDistributionChart({ events }: EventDistributionChartProps) {
  // Create sample data if no events exist
  const sampleData = [
    { name: 'No Data', value: 1 }
  ]

  // Calculate distribution if events exist
  const eventDistribution = events.length > 0
    ? events.reduce((acc, event) => {
      const basis = event.paymentBasis || PaymentBasis.PER_DAY
      acc[basis] = (acc[basis] || 0) + 1
      return acc
    }, {} as Record<PaymentBasis, number>)
    : { NO_DATA: 1 }

  // Transform to chart data format
  const chartData = events.length > 0
    ? Object.entries(eventDistribution).map(([basis, count]) => ({
      name: basis.replace('_', ' ').toLowerCase(),
      value: count,
    }))
    : sampleData

  // Updated color scheme
  const COLORS = [
    'hsl(207, 50%, 50%)',  // Matte Blue
    'hsl(120, 40%, 50%)',  // Matte Green
    'hsl(35, 40%, 50%)',   // Matte Yellow
    'hsl(10, 50%, 40%)',   // Matte Red
    'hsl(180, 30%, 50%)',  // Matte Cyan
  ]

  // ].map((color, index) => `${color}/${(index + 1) * 20}%`)

  const chartConfig = {
    value: {
      label: 'Events',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Distribution</CardTitle>
        <CardDescription>Distribution of events by payment basis</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={60}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}  // Apply the color based on index
                    strokeWidth={1}
                    stroke={COLORS[index % COLORS.length]}  // Outline stroke color
                  />
                ))}
              </Pie>
              <Legend
                formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                className="text-muted-foreground"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

