"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { UserRole } from "@prisma/client"

import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { getEventById, getEvents, getEventsByOrgId, OrgEvent } from "@/actions/event"
import { EventCard } from "../_components/EventCard"
import { EmptyEvent } from "../_components/EmptyEvent"
import { Navbar } from "../_components/Navbar"
import { EmptySearch } from "../_components/EmptySearch"
import { Enrollments, getEnrollmentsByUserId } from "@/actions/enrollment"
import { RoleGate } from "@/components/auth/RoleGate"
import { EmptyEnroll } from "../_components/EmptyEnroll"
import { StepForward } from "lucide-react"
import { cn } from "@/lib/utils"

const Dashboard = () => {
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [hasSearchQuery, setHasSearchQuery] = useState(false)
  const searchParams = useSearchParams()

  const { data: organizationOrUser, status } = useCurrentOrgORUser()

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
    const isEnrolled = searchParams.get('enrolled') === 'true'

    if (isEnrolled) {
      setEvents(enrolledEvents as OrgEvent[])
    } else if (events && events.length && hasSearchQuery) {
      setEvents(events)
    } else if (data && !hasSearchQuery) {
      setEvents(data)
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
    events?.length ? (
      <section className="px-2 py-6 h-full w-full">
        <Navbar
          orgId={organizationOrUser?.id}
          organizationOrUser={organizationOrUser}
          events={events}
          setEvents={setEvents}
          setHasSearchQuery={setHasSearchQuery}
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
          {events.map((event) => {
            if (hasSearchQuery) {
              return <EventCard key={event.id} event={event} hasSearchQuery={hasSearchQuery} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} />
            }
            return <EventCard key={event.id} event={event} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} />
          })}
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
      </section>
    ) : (hasSearchQuery && !events.length) ? (
      <section className="px-4 py-6 h-full">
        <Navbar
          orgId={organizationOrUser?.id}
          organizationOrUser={organizationOrUser}
          events={events}
          setEvents={setEvents}
          setHasSearchQuery={setHasSearchQuery}
        />
        <EmptySearch />
      </section>
    ) : searchParams.get('enrolled') === 'true'
      ? <EmptyEnroll />
      : organizationOrUser.role === UserRole.ORGANIZATION ? (
        <RoleGate role={organizationOrUser.role} allowedRole={UserRole.ORGANIZATION}>
          <EmptyEvent />
        </RoleGate>
      ) : (
        <section className="px-4 py-6 h-full">
          <Navbar
            orgId={organizationOrUser?.id}
            organizationOrUser={organizationOrUser}
            events={events}
            setEvents={setEvents}
            setHasSearchQuery={setHasSearchQuery}
          />
          <EmptyEvent isUser />
        </section>
      )
  )
}

export default Dashboard

