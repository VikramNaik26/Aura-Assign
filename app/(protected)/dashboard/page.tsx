"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { getEventsByOrgId, OrgEvent } from "@/actions/event"
import { EventCard } from "../_components/EventCard"

const Dashboard = () => {
  const organization = useCurrentOrgORUser()

  const { data: events, error, isLoading } = useQuery<OrgEvent[]>({
    queryKey: ["events"],
    queryFn: () => {
      if (organization?.id) {
        return getEventsByOrgId(organization.id)
      } else {
        return Promise.reject(new Error("No organization ID found"))
      }
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>
  }


  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-4 py-6">
      {events && events.map((event) => {
        return <EventCard key={event.id} event={event} />
      })}
    </section>
  )
}

export default Dashboard
