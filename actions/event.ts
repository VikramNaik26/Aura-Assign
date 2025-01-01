"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { EventSchema } from "@/schemas"
import { getOrgById } from "@/data/organizations"
import { PaymentBasis } from "@prisma/client"
import { FilterParams } from "@/app/(protected)/_components/FilterForm"
import { getEnrollmentsForEvent } from "./enrollment"
import { sendEventCancellationEmail } from "@/lib/mail"

export interface OrgEvent {
  id: string
  name: string
  description?: string | null
  imageUrl?: string | null
  date: Date
  time: Date
  payment: number
  orgId?: string | null
  paymentBasis?: PaymentBasis | null
  location?: {
    address: string
    lat: number
    lng: number
  }
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
      payment: number
      paymentBasis?: PaymentBasis
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
      payment: values.payment,
      paymentBasis: values.paymentBasis,
      imageUrl: values.imageUrl,
      address: values.location.address,
      latitude: values.location.lat,
      longitude: values.location.lng
    }

    if (organization?.id) {
      eventData.orgId = organization.id
    }

    if (eventId) {
      await db.event.update({
        where: { id: eventId },
        data: eventData
      })
      return { success: 'Event Successfully Updated' }
    } else {
      await db.event.create({
        data: eventData
      })
      return { success: 'Event Successfully Created' }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.errors }
    } else {
      console.log(error)
    }
  }
}

const transformEvent = (event: any) => {
  const transformedEvent = {
    ...event,
    location: {
      address: event.address,
      lat: event.latitude,
      lng: event.longitude,
    },
  }
  delete (transformedEvent as any).address
  delete (transformedEvent as any).latitude
  delete (transformedEvent as any).longitude
  return transformedEvent
}

export const getEvents = async () => {
  try {
    const events = await db.event.findMany({
      where: {
        AND: [
          { date: { gte: new Date() } },
          { time: { gte: new Date() } },
        ]
      }
    })
    return events.map(transformEvent)
  } catch (error) {
    console.error("Error fetching events:", error)
    throw new Error("Cannot find events")
  }
}

// Haversine formula to calculate distance between two lat/lng points
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

export const getNearbyEvents = async (userLat?: number | null, userLng?: number | null, maxDistance: number = 100) => {
  try {
    // Fetch all events
    const events = await db.event.findMany({
      where: {
        AND: [
          { date: { gte: new Date() } },
          { time: { gte: new Date() } },
        ]
      }
    })

    // Transform and filter events
    const nearbyEvents = events
      .map(transformEvent) // Use the existing transform function
      .filter(event => {
        // Check if event has valid location
        if (!event.location || !event.location.lat || !event.location.lng) {
          return false
        }

        if (!userLat) {
          userLat = 12.92309956737475
        }
        if (!userLng) {
          userLng = 74.8128171745646
        }
        // Calculate distance
        const distance = calculateDistance(
          userLat,
          userLng,
          event.location.lat,
          event.location.lng
        )

        // Return events within max distance
        return distance <= maxDistance
      })
    return nearbyEvents
  } catch (error) {
    console.error("Error fetching nearby events:", error)
    throw new Error("Cannot find nearby events")
  }
}

export const getNearbyOrgEvents = async (userLat?: number | null, userLng?: number | null, maxDistance: number = 100, orgId?: string) => {
  try {
    // Fetch all events
    const events = await db.event.findMany({
      where: {
        AND: [
          { date: { gte: new Date() } },
          { time: { gte: new Date() } },
          { orgId: orgId }
        ]
      }
    })

    // Transform and filter events
    const nearbyEvents = events
      .map(transformEvent) // Use the existing transform function
      .filter(event => {
        // Check if event has valid location
        if (!event.location || !event.location.lat || !event.location.lng) {
          return false
        }

        if (!userLat) {
          userLat = 12.92309956737475
        }
        if (!userLng) {
          userLng = 74.8128171745646
        }
        // Calculate distance
        const distance = calculateDistance(
          userLat,
          userLng,
          event.location.lat,
          event.location.lng
        )

        // Return events within max distance
        return distance <= maxDistance
      })
    return nearbyEvents
  } catch (error) {
    console.error("Error fetching nearby events:", error)
    throw new Error("Cannot find nearby events")
  }
}

export const getEventsByOrgId = async (orgId?: string): Promise<OrgEvent[]> => {
  try {
    const organization = orgId ? await getOrgById(orgId) : null
    const events = await db.event.findMany({
      where: {
        AND: [
          { orgId: organization?.id },
          { date: { gte: new Date() } },
          { time: { gte: new Date() } }
        ]
      }
    })
    return events.map(transformEvent)
  } catch (error) {
    console.error("Error fetching events:", error)
    throw new Error("Failed to fetch events. Please try again later.")
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

  const event = await getEventById(id)
  if (!event) {
    return { error: 'Event not found' }
  }

  const eventDate = new Date(event.date);
  const currentDate = new Date();

  if (currentDate > new Date(eventDate.getTime() - 24 * 60 * 60 * 1000)) {
    return { error: 'Event cannot be deleted on or before the day it is scheduled' };
  }

  const enrolledUsers = await getEnrollmentsForEvent(id)

  try {
    if (enrolledUsers.length > 0) {
      // First send emails to all enrolled users
      const emailPromises = enrolledUsers.map(user =>
        sendEventCancellationEmail(event, user)
      );

      // Wait for all emails to be sent
      await Promise.all(emailPromises);
    }

    // Then delete the event
    await db.event.delete({ where: { id } })

    return { success: 'Event Successfully Deleted' }
  } catch (error) {
    return { error: 'Failed to delete event or send cancellation notifications' }
  }
}

export const getEventByNameAndOrg = async (name: string, orgId?: string) => {
  try {
    const events = await db.event.findMany({
      where: {
        AND: [
          {
            name: {
              contains: name,
              mode: 'insensitive'
            }
          },
          // Only include orgId condition if it exists
          ...(orgId ? [{ orgId }] : [])
        ]
      },
    })

    return events
  } catch (error) {
    console.error('Error fetching event:', error)
    return { error: 'Cannot find event' }
  }
}

export const getEventById = async (id?: string): Promise<OrgEvent> => {
  try {
    if (!id) {
      throw new Error("Event ID is required");
    }

    // Fetch the event by ID
    const event = await db.event.findUnique({ where: { id } });

    if (!event) {
      throw new Error("Event not found");
    }

    // Transform the event data
    const transformedEvent = transformEvent(event);

    // Ensure the event has valid location details (optional based on requirements)
    /* if (
      !transformedEvent.location ||
      !transformedEvent.location.lat ||
      !transformedEvent.location.lng
    ) {
      throw new Error("Event does not have a valid location");
    } */

    return transformedEvent;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Cannot fetch the event");
  }
};

export const getFilteredEvents = async (filterOptions: FilterParams) => {
  try {
    const { date, customDate, priceRange } = filterOptions;
    const [minPrice, maxPrice] = priceRange;

    // Get current date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get date a week from now
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    // Base filter with price range
    const baseFilter = {
      payment: {
        gte: minPrice,
        lte: maxPrice,
      }
    };

    // Add date filter based on selection
    let dateFilter = {};
    switch (date) {
      case 'today':
        dateFilter = {
          date: {
            gte: today,
            lt: tomorrow,
          }
        };
        break;

      case 'tomorrow':
        dateFilter = {
          date: {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          }
        };
        break;

      case 'week':
        dateFilter = {
          date: {
            gte: today,
            lt: weekFromNow,
          }
        };
        break;

      case 'custom':
        if (customDate) {
          const selectedDate = new Date(customDate);
          selectedDate.setHours(0, 0, 0, 0);
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);

          dateFilter = {
            date: {
              gte: selectedDate,
              lt: nextDay,
            }
          };
        }
        break;
    }

    // Combine filters
    const filter = {
      AND: [
        baseFilter,
        dateFilter,
      ]
    };

    const events = await db.event.findMany({
      where: filter,
      orderBy: {
        date: 'asc',
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching filtered events:", error);
    throw new Error("Failed to fetch events. Please try again later.");
  }
};
