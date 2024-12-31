import { UserRole } from "@prisma/client"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, getOrgs } from "@/actions/users"
import { currentRole } from "@/lib/auth"
import { CombinedGrowthChart } from "@/components/admin/CombinedGrowthChart"
import { UserRolesChart } from "@/components/admin/UserRolesChart"
import { UserActivityChart } from "@/components/admin/UserActivityChart"
import { NewVsReturningChart } from "@/components/admin/NewVsReturningChart"

export default async function CombinedAnalyticsPage() {
  const users = await getUsers()
  const organizations = await getOrgs()
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    notFound()
  }

  // Calculate user statistics
  const totalUsers = users.length
  const totalOrganizations = organizations.length
  const activeUsers = users.filter(user => user.lastLoginAt &&
    new Date(user.lastLoginAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length
  const newUsers = users.filter(user =>
    new Date(user.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length
  const newOrganizations = organizations.filter(org =>
    new Date(org.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Combined Analytics</h2>
          <p className="text-muted-foreground">
            Detailed analytics about your platform&apos;s users and organizations
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrganizations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Organizations (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newOrganizations}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CombinedGrowthChart users={users} organizations={organizations} />
        <UserRolesChart users={users} organizations={organizations} />
        <UserActivityChart users={users} />
        <NewVsReturningChart users={users} />
      </div>
    </div>
  )
}


