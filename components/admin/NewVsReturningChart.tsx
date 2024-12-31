'use client'

import { User } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"

interface NewVsReturningChartProps {
  users: User[]
}

export function NewVsReturningChart({ users }: NewVsReturningChartProps) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const newUsers = users.filter(user => new Date(user.createdAt) > thirtyDaysAgo).length
  const returningUsers = users.filter(user =>
    new Date(user.createdAt) <= thirtyDaysAgo &&
    user.lastLoginAt &&
    new Date(user.lastLoginAt) > thirtyDaysAgo
  ).length

  const chartData = [
    { name: 'New Users', value: newUsers },
    { name: 'Returning Users', value: returningUsers },
  ]

  const COLORS = [
    'hsl(220, 80%, 60%)',
    'hsl(340, 65%, 65%)',
  ]


  const chartConfig = {
    value: {
      label: 'Users',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>New vs Returning Users (30 Days)</CardTitle>
        <CardDescription>Comparison of new and returning users in the last 30 days</CardDescription>
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
