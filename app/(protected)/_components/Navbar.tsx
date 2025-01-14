import { Dispatch, SetStateAction } from "react"

import { OrgEvent } from "@/actions/event"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "./SearchInput"
import { UserButton } from "./UserButton"
import { ExtendedUser } from "@/next-auth"
import { FilterOptions, SortOption } from "../dashboard/page"

export interface NavbarProps {
  orgId?: string
  events: OrgEvent[]
  setEvents: Dispatch<SetStateAction<OrgEvent[]>>
  setHasSearchQuery: Dispatch<SetStateAction<boolean>>
  organizationOrUser?: ExtendedUser | undefined
  sortBy: SortOption,
  setSortBy: Dispatch<SetStateAction<SortOption>>
  filteredEvents: FilterOptions
  setFilteredEvents: Dispatch<SetStateAction<FilterOptions>>
}

export const Navbar = ({
  orgId,
  events,
  setEvents,
  setHasSearchQuery,
  organizationOrUser,
  sortBy,
  setSortBy,
  filteredEvents,
  setFilteredEvents
}: NavbarProps) => {
  return (
    <div className="lg:flex lg:flex-1 justify-between">
      {/* <div>
      <CurrentLocation />
      </div> */}
      <SearchInput
        orgId={orgId}
        events={events}
        setEvents={setEvents}
        setHasSearchQuery={setHasSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filteredEvents={filteredEvents}
        setFilteredEvents={setFilteredEvents}
      />
      <div className="hidden lg:block">
        <UserButton organizationOrUser={organizationOrUser} />
      </div>
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
