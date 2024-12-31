'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface EnrollmentGrowthChartProps {
  enrollments: {
    id: string;
    userId: string;
    eventId: string;
    status: string;
    jobDetails: string | null;
    enrolledAt: Date;
  }[]
}

export function EnrollmentGrowthChart({ enrollments }: EnrollmentGrowthChartProps) {
  // Sort enrollments by date
  const sortedEnrollments = [...enrollments].sort((a, b) => a.enrolledAt.getTime() - b.enrolledAt.getTime())

  // Create cumulative data
  const cumulativeData = sortedEnrollments.reduce((acc, enrollment, index) => {
    const date = enrollment.enrolledAt.toISOString().split('T')[0]
    if (acc.length === 0 || acc[acc.length - 1].date !== date) {
      acc.push({ date, enrollments: index + 1 })
    } else {
      acc[acc.length - 1].enrollments = index + 1
    }
    return acc
  }, [] as { date: string; enrollments: number }[])

  const chartConfig = {
    enrollments: {
      label: 'Total Enrollments',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Growth</CardTitle>
        <CardDescription>Cumulative number of enrollments over time</CardDescription>
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
                dataKey="enrollments"
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


