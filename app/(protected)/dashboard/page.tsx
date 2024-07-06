"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { getEvents } from "@/actions/event"

const Dashboard = () => {
  const organization = useCurrentOrgORUser()

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(organization?.id),
  })

  return (
    <section>
      {events && events.map((event) => (
        <div key={event.id}>
          <h1>{event.name}</h1>
          <p>{event.description}</p>
        </div>
      ))}
    </section>
  )
}

export default Dashboard
