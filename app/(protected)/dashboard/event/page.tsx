"use client"

import { useQuery } from "@tanstack/react-query"

import { Enrollments, getEnrollmentsByUserId } from "@/actions/enrollment"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsSkeleton,
  TabsTrigger
} from "@/components/ui/tabs"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { OrgEvent, getEventById } from "@/actions/event"
import { EventCard } from "../../_components/EventCard"
import { EmptyEnroll } from "../../_components/EmptyEnroll"

const Events = () => {
  const { data: organizationOrUser, status } = useCurrentOrgORUser()

  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery<Enrollments[]>({
    queryKey: ["enrollments", organizationOrUser?.id],
    queryFn: () => {
      return getEnrollmentsByUserId(organizationOrUser?.id)
    },
    enabled: !!organizationOrUser?.id
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

  if (isLoadingEnrollments || status === "loading") {
    return (
      <section className="px-4 py-6 h-full">
        <TabsSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
          <EventCard.Skeleton isList />
          <EventCard.Skeleton isList />
          <EventCard.Skeleton isList />
          <EventCard.Skeleton isList />
        </div >
      </section>
    )
  }

  return (
    <section className="w-full h-full">
      <Tabs defaultValue="enrolled" className="w-full h-full text-center py-6 sm:text-left">
        <TabsList className="w-[80%] sm:w-auto">
          <TabsTrigger className="w-full" value="enrolled">Enrolled</TabsTrigger>
          <TabsTrigger className="w-full" value="past">Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value="enrolled">
          {!enrolledEvents?.length && isLoadingEnrollments === undefined ? (
            <EmptyEnroll />
          ) : (
            <div
              className="flex flex-col max-sm:ml-0 w-full overflow-x-scroll sm:overflow-x-hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-4 lg:py-6 scrollbar-hide"
            >
              {enrolledEvents?.map((event) => {
                return <EventCard key={event.id} event={event} enrollments={enrollments} isLoadingEnrollments={isLoadingEnrollments} hasSearchQuery />
              })}
            </div>
          )
          }
        </TabsContent>
        <TabsContent value="past" className="h-full">
          <section className="w-full h-full">
            <EmptyEnroll
              className="-mt-6"
              label="No past events"
            />
          </section>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default Events
