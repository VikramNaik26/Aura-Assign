"use server"

import { db } from "@/lib/db"

export const getEventById = async (id?: string) => {
  try {
    const event = await db.event.findUnique({
      where: { id }
    })

    if (!event) {
      return null
    }

    const transformedEvent = {
      ...event,
      location: {
        address: event.address,
        lat: event.latitude,
        lng: event.longitude,
      },
    }

    delete (transformedEvent as any).address;
    delete (transformedEvent as any).latitude;
    delete (transformedEvent as any).longitude;

    return transformedEvent
  } catch (error) {
    return null
  }
}
