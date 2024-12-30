import { UserRole } from "@prisma/client"
import { notFound } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, getOrgs } from "@/actions/users"
import { getEvents } from "@/actions/event"
import { currentRole } from "@/lib/auth"
import { UserGrowthChart } from "@/components/admin/UserGrowthChart"
import { OrganizationGrowthChart } from "@/components/admin/OrganizationGrowthChart"
import { EventGrowthChart } from "@/components/admin/EventGrowthChart"
import { EventDistributionChart } from "@/components/admin/EventDistributionChart"

export default async function AdminDashboard() {
  const users = await getUsers()
  const orgs = await getOrgs()
  const events = await getEvents()

  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Event Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        {/*<Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.reduce((sum, event) => sum + event.enrollments.length, 0)}</div>
          </CardContent>
        </Card>*/}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UserGrowthChart users={users} />
        <OrganizationGrowthChart organizations={orgs} />
        <EventGrowthChart events={events} />
        <EventDistributionChart events={events} />
      </div>
    </div>
  )
}


