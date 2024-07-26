import { OrgEvent } from "@/actions/event"
import { EventForm } from "./EventForm"
import { EventImage } from "./EventImage"

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
