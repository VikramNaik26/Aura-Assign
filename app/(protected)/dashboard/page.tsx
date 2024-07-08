"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { getEventsByOrgId, OrgEvent } from "@/actions/event"
import { EventCard } from "../_components/EventCard"
import { EmptyEvent } from "../_components/EmptyEvent"
import { Navbar } from "../_components/Navbar"

const Dashboard = () => {
  const [events, setEvents] = useState<OrgEvent[]>([])

  const organization = useCurrentOrgORUser()

  const { data, error, isLoading } = useQuery<OrgEvent[]>({
    queryKey: ["events"],
    queryFn: () => {
      return getEventsByOrgId(organization?.id)
    },
    enabled: !!organization?.id,
  })

  useEffect(() => {
    if (events.length) {
      setEvents(events)
    } else if (data) {
      setEvents(data)
    }
  }, [data, events])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>
  }


  return (
    events?.length ? (
      <section className="px-4 py-6 h-full">
        <Navbar orgId={organization?.id} events={events} setEvents={setEvents} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
          {events.length ? (
            events.map((event) => {
              return <EventCard key={event.id} event={event} />
            })
          ) : (
            <div>No results found</div>
          )}
        </div >
      </section>
    ) : (
      <EmptyEvent />
    )
  )
}

export default Dashboard
