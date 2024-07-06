"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { EventSchema } from "@/schemas"
import { getOrgById } from "@/data/organizations"

export const createEvent = async (values: z.infer<typeof EventSchema>, orgId?: string) => {
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
    } = {
      name: values.name,
      description: values.description,
      date: date,
      time: date,
      imageUrl: values.imageUrl
    }

    if (organization?.id) {
      eventData.orgId = organization.id;
    }
    await db.event.create({
      data: eventData
    })

    return { success: 'Event Created' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.errors };
    } else {
      console.log(error)
    }
  }
}

export const getEvents = async (orgId?: string) => {
  const organization = orgId ? await getOrgById(orgId) : null

  const events = await db.event.findMany({
    where: { orgId: organization?.id }
  })
  return events
}
