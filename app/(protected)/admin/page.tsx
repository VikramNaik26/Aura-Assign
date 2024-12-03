import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/admin/UsersTable"
import { OrganizationsTable } from "@/components/admin/OrganizationsTable"
import { EventListingsTable } from "@/components/admin/EventListingsTable"
import { getUsers, getOrgs } from "@/actions/users"
import { getEvents } from "@/actions/event"

export default async function AdminDashboard() {
  const users = await getUsers()
  const orgs = await getOrgs()
  const events = await getEvents()
  console.log({"EVNT: ": events})

  return (
    <div className="p-6 space-y-6 scrollbar-hide">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <UsersTable users={users} />
        <OrganizationsTable organizations={orgs} />
        <EventListingsTable events={events}/>
      </div>
    </div>
  )
}
