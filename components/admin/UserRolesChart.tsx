'use client'

import { User, Organization, UserRole } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"

interface UserRolesChartProps {
  users: User[]
  organizations: Organization[]
}

export function UserRolesChart({ users, organizations }: UserRolesChartProps) {
  const roleDistribution = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<UserRole, number>)

  // Add organization count
  roleDistribution['ORGANIZATION'] = organizations.length

  const chartData = Object.entries(roleDistribution).map(([role, count]) => ({
    name: role.toLowerCase(),
    value: count,
  }))

  const COLORS = [
    'hsl(220, 80%, 60%)',
    'hsl(340, 65%, 65%)',
  ]

  const chartConfig = {
    value: {
      label: 'Count',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>User and Organization Roles Distribution</CardTitle>
        <CardDescription>Distribution of users by role and organizations</CardDescription>
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


