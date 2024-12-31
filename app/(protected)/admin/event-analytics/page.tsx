import { UserRole, Status } from "@prisma/client"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { currentRole } from "@/lib/auth"
import { EnrollmentGrowthChart } from "@/components/admin/EnrollmentGrowthChart"
import { EnrollmentStatusChart } from "@/components/admin/EnrollmentStatusChart"
import { getEnrollments } from "@/actions/enrollment"

export default async function EventAnalyticsPage() {
  const enrollments = await getEnrollments()
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    notFound()
  }

  // Calculate enrollment statistics
  const totalEnrollments = enrollments.length
  const activeEnrollments = enrollments.filter(enrollment => 
    enrollment.status === Status.APPROVED).length
  const uniqueEvents = new Set(enrollments.map(enrollment => enrollment.eventId)).size

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Event Analytics</h2>
          <p className="text-muted-foreground">
            Detailed analytics about your platform&apos;s events and enrollments
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueEvents}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <EnrollmentGrowthChart enrollments={enrollments} />
        <EnrollmentStatusChart enrollments={enrollments} />
      </div>
    </div>
  )
}


