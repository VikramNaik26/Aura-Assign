import Image from "next/image"

import { OrgEvent } from "@/actions/event"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { EventForm } from "./EventForm"
import { Button } from "@/components/ui/button"

interface EventDetailsProps {
  event: OrgEvent
}

export const EventDetails = ({
  event
}: EventDetailsProps) => {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 items-stretch min-w-80">
      <EventForm
        className="w-full my-0 min-h-full flex flex-col"
        headerText="Event Details"
        headerLabel="Description of the event"
        headerClassName="items-start"
        isEdit
      />
      <EventImage />
    </div>
  )
}

const EventImage = () => {
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
      <div className="flex gap-2 mt-8 justify-end">
        <Button variant="secondary">
          Change
        </Button>
        <Button variant="default">
          Delete
        </Button>
      </div>
    </CardWrapper>
  )
}

