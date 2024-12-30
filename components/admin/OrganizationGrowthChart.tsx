'use client'

import { Organization } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface OrganizationGrowthChartProps {
  organizations: Organization[]
}

export function OrganizationGrowthChart({ organizations }: OrganizationGrowthChartProps) {
  // Create sample data if no organizations exist
  const sampleData = [
    { date: '2024-01-01', organizations: 0 },
    { date: new Date().toISOString().split('T')[0], organizations: 0 }
  ]

  // Sort organizations by creation date
  const sortedOrgs = [...organizations].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  // Create cumulative data
  const cumulativeData = sortedOrgs.length > 0
    ? sortedOrgs.reduce((acc, org, index) => {
      const date = org.createdAt.toISOString().split('T')[0]
      if (acc.length === 0 || acc[acc.length - 1].date !== date) {
        acc.push({ date, organizations: index + 1 })
      } else {
        acc[acc.length - 1].organizations = index + 1
      }
      return acc
    }, [] as { date: string; organizations: number }[])
    : sampleData

  const chartConfig = {
    organizations: {
      label: 'Total Organizations',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Growth</CardTitle>
        <CardDescription>Cumulative number of organizations over time</CardDescription>
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
                dataKey="organizations"
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


