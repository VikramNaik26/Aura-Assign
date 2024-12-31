import { ExtendedEnrollments } from "@/components/admin/EnrollmentTrendChart"
import { ChartConfig } from "@/components/ui/chart"

export function prepareEnrollmentData(enrollments: ExtendedEnrollments[], startOfWeek: Date, endOfWeek: Date) {
  const allDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date.toISOString().split('T')[0]
  })

  // Create initial data structure with zero enrollments for all days
  const initialData = allDays.reduce((acc, date) => {
    acc[date] = 0
    return acc
  }, {} as Record<string, number>)

  // Count enrollments for each day
  enrollments.forEach(enrollment => {
    const enrolledDate = new Date(enrollment.enrolledAt)
    if (enrolledDate >= startOfWeek && enrolledDate <= endOfWeek) {
      const dateKey = enrolledDate.toISOString().split('T')[0]
      initialData[dateKey] = (initialData[dateKey] || 0) + 1
    }
  })

  return Object.entries(initialData)
    .map(([date, count]) => ({
      date,
      enrollments: count
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export const enrollmentChartConfig: ChartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: 'hsl(var(--chart-4))',
  },
}
