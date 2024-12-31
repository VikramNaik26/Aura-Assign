"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { UserRole } from "@prisma/client"

import {
  getEventById,
  getEvents,
  getEventsByOrgId,
  getNearbyEvents,
  getNearbyOrgEvents,
  OrgEvent
} from "@/actions/event"
import { EventCard } from "../_components/EventCard"
import { EmptyEvent } from "../_components/EmptyEvent"
import { Navbar } from "../_components/Navbar"
import { EmptySearch } from "../_components/EmptySearch"
import { Enrollments, getEnrollmentsByUserId } from "@/actions/enrollment"
import { RoleGate } from "@/components/auth/RoleGate"
import { EmptyEnroll } from "../_components/EmptyEnroll"
import { StepForward, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar } from "../_components/Sidebar"
import { Button } from "@/components/ui/button"
import useRedirectIfAdmin from "@/hooks/useRedirectIfAdmin"

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';
export type FilterOptions = {
  filterApplied: boolean
  events: OrgEvent[]
}

const Dashboard = () => {
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [hasSearchQuery, setHasSearchQuery] = useState(false)
  const searchParams = useSearchParams()
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [sortedEvents, setSortedEvents] = useState<OrgEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<FilterOptions>({
    filterApplied: false,
    events: [],
  })

  const { organizationOrUser, status } = useRedirectIfAdmin()

  useEffect(() => {
    if (events.length > 0) {
      const sorted = [...events].sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          case 'date-asc':
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          case 'date-desc':
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          default:
            return 0
        }
      })
      setSortedEvents(sorted)
    }
  }, [sortBy, events])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          console.error("Error fetching location:", error)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }, [])

  const { data: nearByEvents, isLoading: isLoadingNearByEvents } = useQuery<OrgEvent[]>({
    queryKey: ["nearby-events"],
    queryFn: () => {
      if (organizationOrUser.role === UserRole.ORGANIZATION) {
        return getNearbyOrgEvents(latitude, longitude, 100, organizationOrUser?.id)
      }
      return getNearbyEvents(latitude, longitude)
    },
    enabled: true
  })

  const { data, error, isLoading } = useQuery<OrgEvent[]>({
    queryKey: ["events", organizationOrUser?.id],
    queryFn: () => {
      if (organizationOrUser?.role === UserRole.ORGANIZATION) {
        return getEventsByOrgId(organizationOrUser?.id)
      } else {
        return getEvents()
      }
    },
    enabled: status === "authenticated"
  })

  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery<Enrollments[]>({
    queryKey: ["enrollments", organizationOrUser?.id],
    queryFn: () => {
      return getEnrollmentsByUserId(organizationOrUser?.id)
    },
    enabled: !!organizationOrUser?.id && !!events,
  })

  const { data: enrolledEvents } = useQuery<OrgEvent[]>({
    queryKey: ["enrolled-events", enrollments],
    queryFn: async () => {
      if (!enrollments || enrollments.length === 0) return []

      const events = await Promise.all(enrollments.map(async (enrollment) => {
        const event = await getEventById(enrollment.eventId)
        if (event && !("error" in event)) {
          return event
        }
        return null
      }))

      return events.filter(event => event !== null) as OrgEvent[]
    },
    enabled: !!enrollments && !!enrollments.length
  })

  useEffect(() => {
    setIsLoadingEvents(true)
    const isEnrolled = searchParams.get('enrolled') === 'true'

    if (isEnrolled) {
      setEvents(enrolledEvents as OrgEvent[])
      setIsLoadingEvents(false)
    } else if (events && events.length && hasSearchQuery) {
      setEvents(events)
      setIsLoadingEvents(false)
    } else if (data && !hasSearchQuery) {
      setEvents(data)
      setIsLoadingEvents(false)
    }
  }, [data, events, isLoading, hasSearchQuery, organizationOrUser, enrolledEvents, searchParams])

  if (isLoading || status === "loading") {
    return (
      <section className="px-4 py-6 h-full">
        <Navbar.Skeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
          <EventCard.Skeleton />
          <EventCard.Skeleton />
          <EventCard.Skeleton />
          <EventCard.Skeleton />
        </div >
      </section>
    )
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>
  }

  return (
    <>
      <Sidebar organizationOrUser={organizationOrUser} />
      {filteredEvents.filterApplied ? (
        filteredEvents.events.length === 0 ? (
          <section className="px-2 py-6 h-full w-full">
            <Navbar
              orgId={organizationOrUser?.id}
              organizationOrUser={organizationOrUser}
              events={events}
              setEvents={setEvents}
              setHasSearchQuery={setHasSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredEvents={filteredEvents}
              setFilteredEvents={setFilteredEvents}
            />
            <Button variant="link" className="py-1 mt-3 hover:text-red-500" onClick={() => setFilteredEvents({ ...filteredEvents, filterApplied: false })}>
              <span className="text-xs">Remove Filter</span>
              <X className="inline ml-1" size={12} fill="currentColor" />
            </Button>
            <EmptyEvent isUser />
          </section>
        ) : (
          <section className="px-2 py-6 h-full w-full">
            <Navbar
              orgId={organizationOrUser?.id}
              organizationOrUser={organizationOrUser}
              events={events}
              setEvents={setEvents}
              setHasSearchQuery={setHasSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredEvents={filteredEvents}
              setFilteredEvents={setFilteredEvents}
            />
            <Button variant="link" className="py-1 mt-3 hover:text-red-500" onClick={() => setFilteredEvents({ ...filteredEvents, filterApplied: false })}>
              <span className="text-xs">Remove Filter</span>
              <X className="inline ml-1" size={12} fill="currentColor" />
            </Button>
            <div
              className={cn(
                `flex overflow-x-scroll sm:overflow-x-hidden w-screen sm:w-full sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-4 lg:py-6 scrollbar-hide max-sm:-ml-8`,
                hasSearchQuery && 'flex-col max-sm:ml-0 w-full'
              )}
            >
              {filteredEvents.events.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  hasSearchQuery={hasSearchQuery}
                  enrollments={enrollments}
                  isLoadingEnrollments={isLoadingEnrollments}
                />
              ))}
            </div>
          </section>
        )
      ) : events?.length ? (
        <section className="px-2 py-6 h-full w-full">
          <Navbar
            orgId={organizationOrUser?.id}
            organizationOrUser={organizationOrUser}
            events={events}
            setEvents={setEvents}
            setHasSearchQuery={setHasSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredEvents={filteredEvents}
            setFilteredEvents={setFilteredEvents}
          />
          {!hasSearchQuery && (
            <div className="flex justify-between mt-6 sm:hidden">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <span className="text-sm text-muted-foreground">
                See all
                <StepForward className="inline ml-1" size={12} fill="currentColor" />
              </span>
            </div>

          )}
          <div
            className={cn(
              `flex overflow-x-scroll sm:overflow-x-hidden w-screen sm:w-full sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-4 lg:py-6 scrollbar-hide max-sm:-ml-8`,
              hasSearchQuery && 'flex-col max-sm:ml-0 w-full'
            )}
          >
            {
              sortedEvents.length > 0 ? sortedEvents.map((event) => {
                if (hasSearchQuery) {
                  return <EventCard key={event.id} event={event} hasSearchQuery={hasSearchQuery} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} />
                }
                return <EventCard key={event.id} event={event} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} />
              }) :
                events.map((event) => {
                  if (hasSearchQuery) {
                    return <EventCard key={event.id} event={event} hasSearchQuery={hasSearchQuery} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} />
                  }
                  return <EventCard key={event.id} event={event} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} />
                })
            }
          </div>
          {!hasSearchQuery && (
            <div className="flex justify-between mt-4 sm:hidden">
              <h2 className="text-xl font-semibold">Nearby Events</h2>
              <span className="text-sm text-muted-foreground">
                See all
                <StepForward className="inline ml-1" size={12} fill="currentColor" />
              </span>
            </div>
          )}
          <div
            className={cn(
              `flex overflow-x-scroll sm:overflow-x-hidden w-screen sm:w-full grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-4 lg:py-6 scrollbar-hide max-sm:-ml-8 sm:hidden pb-20`,
              hasSearchQuery && 'flex-col max-sm:ml-0 w-full'
            )}
          >
            {nearByEvents && !hasSearchQuery && nearByEvents.map((event) => {
              return <EventCard key={event.id} event={event} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} />
            })}
          </div>
        </section>
      ) : (hasSearchQuery && !events.length) ? (
        <section className="px-4 py-6 h-full">
          <Navbar
            orgId={organizationOrUser?.id}
            organizationOrUser={organizationOrUser}
            events={events}
            setEvents={setEvents}
            setHasSearchQuery={setHasSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredEvents={filteredEvents}
            setFilteredEvents={setFilteredEvents}
          />
          <EmptySearch />
        </section>
      ) : searchParams.get('enrolled') === 'true'
        ? <EmptyEnroll />
        : organizationOrUser.role === UserRole.ORGANIZATION && !isLoadingEvents ? (
          <RoleGate role={organizationOrUser.role} allowedRole={UserRole.ORGANIZATION}>
            <section className="px-4 py-6 h-full">
              <Navbar
                orgId={organizationOrUser?.id}
                organizationOrUser={organizationOrUser}
                events={events}
                setEvents={setEvents}
                setHasSearchQuery={setHasSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filteredEvents={filteredEvents}
                setFilteredEvents={setFilteredEvents}
              />
              <EmptyEvent />
            </section>
          </RoleGate>
        ) : !isLoadingEvents && (
          <section className="px-4 py-6 h-full">
            <Navbar
              orgId={organizationOrUser?.id}
              organizationOrUser={organizationOrUser}
              events={events}
              setEvents={setEvents}
              setHasSearchQuery={setHasSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredEvents={filteredEvents}
              setFilteredEvents={setFilteredEvents}
            />
            <EmptyEvent isUser />
          </section>
        )}
    </>
  )
}

export default Dashboard


