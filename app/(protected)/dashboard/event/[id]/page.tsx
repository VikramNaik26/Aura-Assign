import { UserRole } from "@prisma/client"

import { getEventById } from "@/data/event"
import { UserTable } from "@/app/(protected)/_components/UserTable"
import { RoleGate } from "@/components/auth/RoleGate"
import { auth } from "@/auth"

const Event = async ({ params }: { params: { id: string } }) => {
  const session = await auth()
  const event = await getEventById(params.id)

  if (!event) return null

  return (
    <>
      <div>{JSON.stringify(event, null, 2)}</div>
      <RoleGate role={session?.user.role} allowedRole={UserRole.ORGANIZATION}>
        <UserTable event={event} />
      </RoleGate>
    </>
  )
}

export default Event
