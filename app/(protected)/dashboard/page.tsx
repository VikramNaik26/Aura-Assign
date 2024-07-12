"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { getEvents, getEventsByOrgId, OrgEvent } from "@/actions/event"
import { EventCard } from "../_components/EventCard"
import { EmptyEvent } from "../_components/EmptyEvent"
import { Navbar } from "../_components/Navbar"
import { UserRole } from "@prisma/client"
import { EmptySearch } from "../_components/EmptySearch"

const Dashboard = () => {
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [hasSearchQuery, setHasSearchQuery] = useState(false)

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

  useEffect(() => {
    if (events.length && hasSearchQuery) {
      setEvents(events)
    } else if (data && !hasSearchQuery) {
      setEvents(data)
    }
  }, [data, events, isLoading, hasSearchQuery, organizationOrUser])

  if (isLoading || status === "loading") {
    return (
      <section className="px-4 py-6 h-full">
        <Navbar.Skeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
          <EventCard.Skeleton />
          <EventCard.Skeleton />
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
      <section className="px-4 py-6 h-full">
        <Navbar orgId={organizationOrUser?.id} organizationOrUser={organizationOrUser} events={events} setEvents={setEvents} setHasSearchQuery={setHasSearchQuery} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
          {events.map((event) => {
            return <EventCard key={event.id} event={event} />
          })}
        </div >
      </section>
    ) : (hasSearchQuery && !events.length) ? (
      <section className="px-4 py-6 h-full">
        <Navbar orgId={organizationOrUser?.id} organizationOrUser={organizationOrUser} events={events} setEvents={setEvents} setHasSearchQuery={setHasSearchQuery} />
        <EmptySearch />
      </section>
    ) : (
      <EmptyEvent />
    )
  )
}

export default Dashboard

