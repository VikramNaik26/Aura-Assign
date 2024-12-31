'use client'

import { User, Organization } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface CombinedGrowthChartProps {
  users: User[]
  organizations: Organization[]
}

export function CombinedGrowthChart({ users, organizations }: CombinedGrowthChartProps) {
  const sortedUsers = [...users].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  const sortedOrgs = [...organizations].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const combinedData = sortedUsers.reduce((acc, user, index) => {
    const date = user.createdAt.toISOString().split('T')[0]
    if (acc.length === 0 || acc[acc.length - 1].date !== date) {
      acc.push({ date, users: index + 1, organizations: 0 })
    } else {
      acc[acc.length - 1].users = index + 1
    }
    return acc
  }, [] as { date: string; users: number; organizations: number }[])

  sortedOrgs.forEach((org, index) => {
    const date = org.createdAt.toISOString().split('T')[0]
    const existingEntry = combinedData.find(entry => entry.date === date)
    if (existingEntry) {
      existingEntry.organizations = index + 1
    } else {
      combinedData.push({ date, users: combinedData[combinedData.length - 1]?.users || 0, organizations: index + 1 })
    }
  })

  combinedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartConfig = {
    users: {
      label: 'Total Users',
      color: 'hsl(220, 80%, 60%)', // Vibrant blue
    },
    organizations: {
      label: 'Total Organizations',
      color: 'hsl(340, 65%, 65%)', // Vibrant pink
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combined Growth</CardTitle>
        <CardDescription>Cumulative growth of users and organizations over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                stackId="1"
                stroke="hsl(220, 80%, 60%)"
                fill="hsl(220, 80%, 60%)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="organizations"
                stackId="2"
                stroke="hsl(340, 65%, 65%)"
                fill="hsl(340, 65%, 65%)"
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


