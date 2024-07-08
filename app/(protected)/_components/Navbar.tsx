import { Dispatch, SetStateAction } from "react"
import { SearchInput } from "./SearchInput"

import { OrgEvent } from "@/actions/event"

export interface NavbarProps {
  orgId?: string
  events: OrgEvent[]
  setEvents: Dispatch<SetStateAction<OrgEvent[]>>
  setHasSearchQuery: Dispatch<SetStateAction<boolean>>
}

export const Navbar = ({
  orgId,
  events,
  setEvents,
  setHasSearchQuery
}: NavbarProps) => {
  return (
    <div className="hidden lg:flex lg:flex-1">
      <SearchInput orgId={orgId} events={events} setEvents={setEvents} setHasSearchQuery={setHasSearchQuery} />
    </div>
  )
}
