'use client'

import { User } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface UserGrowthChartProps {
  users: User[]
}

export function UserGrowthChart({ users }: UserGrowthChartProps) {
  // Create sample data if no users exist
  const sampleData = [
    { date: '2024-01-01', users: 0 },
    { date: new Date().toISOString().split('T')[0], users: 0 }
  ]

  // Sort users by creation date
  const sortedUsers = [...users].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  // Create cumulative data
  const cumulativeData = sortedUsers.length > 0
    ? sortedUsers.reduce((acc, user, index) => {
      const date = user.createdAt.toISOString().split('T')[0]
      if (acc.length === 0 || acc[acc.length - 1].date !== date) {
        acc.push({ date, users: index + 1 })
      } else {
        acc[acc.length - 1].users = index + 1
      }
      return acc
    }, [] as { date: string; users: number }[])
    : sampleData

  const chartConfig = {
    users: {
      label: 'Total Users',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Cumulative number of users over time</CardDescription>
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
                dataKey="users"
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


