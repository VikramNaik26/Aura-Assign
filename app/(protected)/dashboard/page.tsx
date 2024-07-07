"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { getEvents } from "@/actions/event"
import { EventCard } from "../_components/EventCard"

const Dashboard = () => {
  const organization = useCurrentOrgORUser()

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(organization?.id),
  })

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-4 py-6">
      {events && events.map((event) => {
        console.log(event)
        return <EventCard key={event.id} event={event} />
      })}
    </section>
  )
}

export default Dashboard
