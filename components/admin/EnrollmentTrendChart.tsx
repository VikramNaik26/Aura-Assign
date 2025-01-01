'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { getWeekBoundaries } from "@/lib/date-utils"
import { prepareEnrollmentData, enrollmentChartConfig } from "@/lib/chart-utils"
import { Enrollments } from "@/actions/enrollment"
import { Event } from "@prisma/client"

export type ExtendedEnrollments = Enrollments & {
  enrolledAt: Date
}

export interface EnrollmentTrendChartProps {
  events: Event[]
  enrollments: ExtendedEnrollments[]
}

export function EnrollmentTrendChart({ events, enrollments }: EnrollmentTrendChartProps) {
  const { startOfWeek, endOfWeek } = getWeekBoundaries()
  const chartData = prepareEnrollmentData(enrollments, startOfWeek, endOfWeek)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Trend (This Week)</CardTitle>
        <CardDescription>Number of enrollments per day this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={enrollmentChartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={chartData}
            >
              <PolarGrid
                gridType="polygon"
              />
              <PolarAngleAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { weekday: 'short' })
                }}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const date = new Date(payload[0].payload.date)
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-medium">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="mt-1 flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: 'hsl(120, 40%, 50%)' }} />
                          <div>Enrollments: {payload[0].value}</div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Radar
                name="Enrollments"
                dataKey="enrollments"
                
                stroke="hsl(120, 40%, 50%)"
                fill="hsl(120, 40%, 50%)"
                fillOpacity={0.2}
                dot={{ r: 4, fill: "hsl(120, 40%, 50%)" }}
                activeDot={{ r: 6, fill: "hsl(120, 40%, 50%)" }}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
