"use server"

import { db } from "@/lib/db"

export const getUsers = async () => {
  return await db.user.findMany()
}

export const getUserProfileById = async (userId?: string) => {
  return await db.userProfile.findUnique({
    where: { userId }
  })
}
