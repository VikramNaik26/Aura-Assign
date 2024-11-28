"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { EventSchema } from "@/schemas"
import { getOrgById } from "@/data/organizations"

export interface OrgEvent {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  date: Date
  time: Date
  location?: { address: string; lat: number; lng: number }
}

export const createOrUpsertEvent = async (
  values: z.infer<typeof EventSchema>,
  orgId?: string,
  eventId?: string
) => {
  try {
    const organization = orgId ? await getOrgById(orgId) : null

    const date = new Date(values.date)
    const [hours, minutes] = values.time.split(':').map(Number)
    date.setHours(hours, minutes)

    if (isNaN(date.getTime())) {
      return { error: 'Invalid Date and Time combination' }
    }

    const eventData: {
      name: string
      description: string | undefined
      date: Date
      time: Date
      imageUrl?: string
      orgId?: string
      address: string
      latitude: number
      longitude: number
    } = {
      name: values.name,
      description: values.description,
      date: date,
      time: date,
      imageUrl: values.imageUrl,
      address: values.location.address,
      latitude: values.location.lat,
      longitude: values.location.lng
    }

    if (organization?.id) {
      eventData.orgId = organization.id;
    }

    if (eventId) {
      await db.event.update({
        where: { id: eventId },
        data: eventData
      });
      return { success: 'Event Successfully Updated' };
    } else {
      await db.event.create({
        data: eventData
      });
      return { success: 'Event Successfully Created' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.errors };
    } else {
      console.log(error)
    }
  }
}

export const getEvents = async () => {
  try {
    const events = await db.event.findMany()
    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    throw new Error('Cannot find events')
  }
}

export const getEventsByOrgId = async (orgId?: string): Promise<OrgEvent[]> => {
  try {
    const organization = orgId ? await getOrgById(orgId) : null

    const events = await db.event.findMany({
      where: { orgId: organization?.id },
    })

    return events
  } catch (error) {
    console.error("Error fetching events:", error);

    throw new Error("Failed to fetch events. Please try again later.");
  }
}

export interface DeleteEventParams {
  id: string
  orgId?: string
}

export const deleteEvent = async ({ id, orgId }: DeleteEventParams) => {
  if (!id) {
    return { error: 'Missing id' }
  }

  const organization = orgId ? await getOrgById(orgId) : null

  if (!organization) {
    return { error: 'Missing organization' }
  }

  try {
    await db.event.delete({ where: { id } })

    return { success: 'Event Successfully Deleted' }
  } catch (error) {
    return { error: 'Cannot delete event' }
  }
}

export const getEventByNameAndOrg = async (name: string, orgId?: string) => {
  try {
    const event = await db.event.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        orgId: orgId
      },
    })

    return event
  } catch (error) {
    console.error('Error fetching event:', error)
    return { error: 'Cannot find event' }
  }
}

export const getEventById = async (id?: string) => {
  try {
    const event = await db.event.findUnique({ where: { id } })
    return event
  } catch (error) {
    console.error('Error fetching event:', error)
    return { error: 'Cannot find event' }
  }
}
