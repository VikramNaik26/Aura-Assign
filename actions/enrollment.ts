"use server"

import * as z from "zod"
import { DefaultSession } from "next-auth"
import { Status } from "@prisma/client"

import { db } from "@/lib/db"
import { EnrollmentSchema } from "@/schemas"
import { getUserById } from "@/data/users"
import { getEventById } from "@/data/event"
import { getUserProfileById } from "./users"

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
  status: Status
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

export interface UserFromDB {
  id: string
  name: string | null
  email: string | null
  password: string | null
  emailVerified: Date | null
  image: string | null
  role: "USER" | "ADMIN" | "ORGANIZATION"
  isTwoFactorEnabled: boolean
}

export interface UserProfile {
  phoneNumber: string | null
  dateOfBirth: Date | null
  gender: string | null
  streetAddress: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
}

export type MergedUser = Omit<UserFromDB, 'password'> & UserProfile

export type ExtendedUserWithProfile = MergedUser & DefaultSession["user"] & {
  status: Status
  enrollmentId: string
  // Add any additional fields here that are not in UserFromDB, UserProfile, or DefaultSession["user"]
}

function mergeUserData(user: UserFromDB, profile: UserProfile | null, status: Status, enrollmentId: string): ExtendedUserWithProfile {
  const { password, ...userWithoutPassword } = user

  return {
    ...userWithoutPassword,
    phoneNumber: profile?.phoneNumber ?? null,
    dateOfBirth: profile?.dateOfBirth ?? null,
    gender: profile?.gender ?? null,
    streetAddress: profile?.streetAddress ?? null,
    city: profile?.city ?? null,
    state: profile?.state ?? null,
    postalCode: profile?.postalCode ?? null,
    country: profile?.country ?? null,
    status,
    enrollmentId
    // Add any fields from DefaultSession["user"] if needed
    // Add custom fields here
  }
}

export const getEnrollmentsForEvent = async (eventId?: string): Promise<ExtendedUserWithProfile[]> => {
  try {
    const enrollments = await db.enrollment.findMany({
      where: { eventId },
    })

    const users = await Promise.all(
      enrollments.map(async (enrollment) => {
        const user = await getUserById(enrollment.userId) as UserFromDB | null
        const userProfile = await getUserProfileById(enrollment.userId)
        if (!user) return null

        return mergeUserData(user, userProfile, enrollment.status, enrollment.id)
      })
    )

    return users.filter((user): user is ExtendedUserWithProfile => user !== null)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    throw error
  }
}

export const setEnrollmentStatus = async (enrollmentId: string, status: Status): Promise<void> => {
  try {
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: { status }
    })
  } catch (error) {
    console.error('Error updating enrollment:', error)
    throw error
  }
}

export const getEnrollmentById = async (enrollmentId: string): Promise<Enrollments | null> => {
  try {
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
    })
    return enrollment
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    throw error
  }
}
