'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"

interface EnrollmentStatusChartProps {
  enrollments: {
    id: string;
    userId: string;
    eventId: string;
    status: string;
    jobDetails: string | null;
    enrolledAt: Date;
  }[]
}

export function EnrollmentStatusChart({ enrollments }: EnrollmentStatusChartProps) {
  // Calculate enrollment status distribution
  const statusDistribution = enrollments.reduce((acc, enrollment) => {
    acc[enrollment.status] = (acc[enrollment.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: status.toLowerCase(),
    value: count,
  }))

  const COLORS = [
    'hsl(220, 90%, 60%)', // Primary blue
    'hsl(220, 80%, 70%)', // Lighter blue
    'hsl(220, 90%, 50%)', // Slightly darker blue
    'hsl(220, 90%, 40%)', // Dark blue
    'hsl(220, 90%, 30%)', // Very dark blue
  ];

  const chartConfig = {
    value: {
      label: 'Enrollments',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Status Distribution</CardTitle>
        <CardDescription>Distribution of enrollments by status</CardDescription>
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
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


