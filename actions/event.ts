"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { EventSchema } from "@/schemas"

export const createEvent = async (values: z.infer<typeof EventSchema>) => {
  console.log(values)
  return { success: 'Event Created'}
  // await db.event.create({
  //   data: {
  //     name: "Test event",
  //     description: "This is a test event",
  //     date: new Date(),
  //     time: new Date(),
  //   }
  // })
}
