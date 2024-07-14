"use server"

import * as z from "zod"

import { db } from "@/lib/db"
import { EnrollmentSchema } from "@/schemas"
import { getUserById } from "@/data/users"
import { getEventById } from "@/data/event"

type Result<T> = { success: T } | { error: string; details?: any }

const updateUserProfile = async (
  userId: string,
  profileData: z.infer<typeof EnrollmentSchema>['userProfile']
) => {
  const {
    phoneNumber,
    dateOfBirth,
    gender,
    streetAddress,
    city,
    state,
    postalCode,
    country
  } = profileData

  return db.userProfile.upsert({
    where: { userId },
    update: {
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      streetAddress,
      city,
      state,
      postalCode,
      country
    },
    create: {
      userId,
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      streetAddress,
      city,
      state,
      postalCode,
      country
    }
  })
}

const createOrUpdateEnrollmentRecord = async (
  userId: string,
  eventId: string,
  enrollmentData: Omit<z.infer<typeof EnrollmentSchema>, 'userProfile'>
) => {
  const existingEnrollment = await db.enrollment.findFirst({
    where: { userId, eventId }
  })

  if (existingEnrollment) {
    return db.enrollment.update({
      where: { id: existingEnrollment.id },
      data: enrollmentData
    })
  } else {
    return db.enrollment.create({
      data: {
        userId,
        eventId,
        ...enrollmentData
      }
    })
  }
}

export const createOrUpdateEnrollment = async (
  values: z.infer<typeof EnrollmentSchema>,
  userId?: string,
  eventId?: string
): Promise<Result<string>> => {
  try {
    if (!userId || !eventId) {
      return { error: 'User ID and Event ID are required' }
    }

    const user = await getUserById(userId)
    if (!user) {
      return { error: 'User not found' }
    }

    const event = await getEventById(eventId)
    if (!event) {
      return { error: 'Event not found' }
    }

    const { userProfile, ...enrollmentData } = values

    await updateUserProfile(userId, userProfile)
    await createOrUpdateEnrollmentRecord(userId, eventId, enrollmentData)

    return { success: 'Enrollment created or updated successfully' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Validation failed', details: error.errors }
    } else {
      console.error('Unexpected error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }
}

export interface Enrollments {
  id: string
  userId: string
  eventId: string
  jobDetails: string | null
}

export const getEnrollmentsByUserId = async (userId?: string) => {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { userId },
    })

    return enrollments as Enrollments[]
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    throw new Error('Cannot find enrollments')
  }
}
