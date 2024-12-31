import { UserRole } from "@prisma/client"
import { notFound } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { getUsers } from "@/actions/users"
import { currentRole } from "@/lib/auth"

export default async function UsersPage() {
  const users = await getUsers()
  const role = await currentRole()

  if (role !== UserRole.ADMIN) {
    notFound()
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all users in your platform
          </p>
        </div>
      </div>
      <DataTable data={users} columns={columns} toolbar filename="users" />
    </div>
  )
}


