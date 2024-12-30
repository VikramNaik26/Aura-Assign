'use client'

import { Event } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface EnrollmentTrendChartProps {
  events: Event[]
  enrollments: any[]
}

export function EnrollmentTrendChart({ events, enrollments }: EnrollmentTrendChartProps) {
  const enrollmentData = events.reduce((acc, event) => {
    const date = event.date.toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + enrollments.length
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(enrollmentData)
    .map(([date, count]) => ({ date, enrollments: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartConfig = {
    enrollments: {
      label: 'Enrollments',
      color: 'hsl(var(--chart-4))',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Trend</CardTitle>
        <CardDescription>Number of enrollments per event date</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="enrollments" 
                stroke="var(--color-enrollments)" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


