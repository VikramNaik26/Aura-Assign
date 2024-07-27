"use client"

import { useState } from "react"
import Image from "next/image"

import { EventDialog } from "./EventDialog"

export const EmptyEvent = () => {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
  const closeDialog = () => setDialogOpen(false)

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Image
        src="/assets/EmptyState.svg"
        alt="No events"
        height={240}
        width={240}
      />
      <EventDialog dashboard={true} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} closeDialog={closeDialog} />
      <h2 className="text-3xl font-bold">Create your first event</h2>
      <p className="mt-2 text-lg text-muted-foreground">Start by creating a event for your organization</p>
    </div>
  )
}
