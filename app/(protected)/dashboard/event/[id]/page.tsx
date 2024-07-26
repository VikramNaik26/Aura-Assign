import { UserRole } from "@prisma/client"

import { getEventById } from "@/data/event"
import { UserTable } from "@/app/(protected)/_components/UserTable"
import { RoleGate } from "@/components/auth/RoleGate"
import { auth } from "@/auth"
import { EventDetails } from "@/app/(protected)/_components/EventDetails"

const Event = async ({ params }: { params: { id: string } }) => {
  const session = await auth()
  const event = await getEventById(params.id)

  if (!event) return null

  return (
    <section className="p-4 flex flex-col gap-6">
      <EventDetails event={event} />
      <RoleGate role={session?.user.role} allowedRole={UserRole.ORGANIZATION}>
        <UserTable event={event} />
      </RoleGate>
    </section>
  )
}

export default Event
