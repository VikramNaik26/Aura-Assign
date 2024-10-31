import { OrgEvent } from "@/actions/event"
import { EventForm } from "./EventForm"
import { EventImage } from "./EventImage"
import Image from "next/image"

interface EventDetailsProps {
  event: OrgEvent
}

export const EventDetails = ({
  event
}: EventDetailsProps) => {
  return (
    <div className="flex flex-col sm:flex-row-reverse gap-4 items-stretch justify-end w-full">
      <div className="w-full md:max-w-[350px] sm:aspect-auto">
        <Image
          alt="Product image"
          className="w-full rounded-md object-cover sm:max-w-[400px]"
          height="300"
          src="/assets/EventImageOne.svg"
          width="300"
        />
      </div>
      <EventForm
        className="w-full my-0 min-h-full flex flex-col"
        headerText="Event Details"
        headerLabel="Description of the event"
        headerClassName="items-start"
        isEdit
        eventObject={event}
      />
    </div>
  )
}
