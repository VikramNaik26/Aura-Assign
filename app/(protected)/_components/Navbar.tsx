import { Dispatch, SetStateAction } from "react"
import { SearchInput } from "./SearchInput"

import { OrgEvent } from "@/actions/event"
import { Skeleton } from "@/components/ui/skeleton"

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

Navbar.Skeleton = function NavbarSkeleton() {
  return (
    <div className="w-full py-2 sm:flex sm:items-center sm:justify-between">
      <div className="sm:hidden">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="hidden sm:block w-full max-w-[516px]">
        <SearchInput.Skeleton />
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}
