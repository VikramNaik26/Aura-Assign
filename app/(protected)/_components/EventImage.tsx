import Image from "next/image"
import { UserRole } from "@prisma/client"

import { CardWrapper } from "@/components/auth/CardWrapper"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { RoleGate } from "@/components/auth/RoleGate"

export const EventImage = async () => {
  const session = await auth()
  return (
    <CardWrapper
      headerText="Event Image"
      headerLabel="Image describing the event"
      className="max-md:w-full overflow-hidden my-0 p-0"
      headerClassName="items-start"
    >
      <div className="grid gap-2">
        <Image
          alt="Product image"
          className="aspect-square w-full rounded-md object-cover"
          height="300"
          src="/assets/nextTask.svg"
          width="300"
        />
      </div>
      <RoleGate role={session?.user.role} allowedRole={UserRole.ORGANIZATION}>
        <div className="flex gap-2 mt-8 justify-end">
          <Button variant="secondary">
            Change
          </Button>
          <Button variant="default">
            Delete
          </Button>
        </div>
      </RoleGate>
    </CardWrapper>
  )
}

