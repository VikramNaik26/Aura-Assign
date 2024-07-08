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

const Dashboard = () => {
  const [events, setEvents] = useState<OrgEvent[]>([])
  const [hasSearchQuery, setHasSearchQuery] = useState(false)

  const organizationOrUser = useCurrentOrgORUser()

  const { data, error, isLoading } = useQuery<OrgEvent[]>({
    queryKey: ["events"],
    queryFn: () => {
      if (organizationOrUser?.role === UserRole.USER) {
        return getEvents()
      }
      return getEventsByOrgId(organizationOrUser?.id)
    },
    enabled: !!organizationOrUser?.id,
  })

  useEffect(() => {
    if (events.length && hasSearchQuery) {
      setEvents(events)
    } else if (data && !hasSearchQuery) {
      setEvents(data)
    }
  }, [data, events, hasSearchQuery])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>
  }


  return (
    events?.length ? (
      <section className="px-4 py-6 h-full">
        <Navbar orgId={organizationOrUser?.id} events={events} setEvents={setEvents} setHasSearchQuery={setHasSearchQuery} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
          {events.map((event) => {
            return <EventCard key={event.id} event={event} />
          })}
        </div >
      </section>
    ) : (hasSearchQuery && !events.length) ? (
      <section className="px-4 py-6 h-full">
        <Navbar orgId={organizationOrUser?.id} events={events} setEvents={setEvents} setHasSearchQuery={setHasSearchQuery} />
        <p>No events found</p>
      </section>
    ) : (
      <EmptyEvent />
    )
  )
}

export default Dashboard
