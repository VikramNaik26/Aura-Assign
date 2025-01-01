import { UserRole, Status, Event } from "@prisma/client"
import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { currentRole, currentUser } from "@/lib/auth"
import { EnrollmentGrowthChart } from "@/components/admin/EnrollmentGrowthChart"
import { EnrollmentStatusChart } from "@/components/admin/EnrollmentStatusChart"
import { getEnrollmentsByOrgId, getEnrollmentsByUserId } from "@/actions/enrollment"
import { getEventsByOrgId } from "@/actions/event"
import { EventGrowthChart } from "@/components/admin/EventGrowthChart"
import { EventDistributionChart } from "@/components/admin/EventDistributionChart"
import { EnrollmentTrendChart } from "@/components/admin/EnrollmentTrendChart"

export default async function AnalyticsPage() {
  const user = await currentUser()

  if (user?.role === UserRole.USER) {
    const enrollments = await getEnrollmentsByUserId(user?.id)

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

  if (user?.role === UserRole.ORGANIZATION) {
    const events = await getEventsByOrgId(user.id)
    const mappedEvents: Event[] = events.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description ?? null, // Map to nullable String
      payment: event.payment,
      paymentBasis: event.paymentBasis ?? 'PER_DAY', // Default to 'PER_DAY' if not provided
      imageUrl: event.imageUrl ?? null, // Map to nullable String
      time: event.time,
      date: event.date,
      orgId: event.orgId ?? null, // Handle optional orgId
      address: event.location?.address ?? '', // Handle address from location
      latitude: event.location?.lat ?? 0, // Default to 0 if no latitude provided
      longitude: event.location?.lng ?? 0, // Default to 0 if no longitude provided
      createdAt: new Date(), // Set createdAt to current date
      updatedAt: new Date(), // Set updatedAt to current date
    }));

    const enrollments = await getEnrollmentsByOrgId(user.id)

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Event Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <EventGrowthChart events={mappedEvents} />
          <EventDistributionChart events={mappedEvents} />
          <EnrollmentTrendChart events={mappedEvents} enrollments={enrollments} />
        </div>
      </div>
    )
  }
  return notFound()
}


