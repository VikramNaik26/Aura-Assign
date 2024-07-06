"use server"

import { db } from "@/lib/db"

export const getUsers = async () => {
  return await db.user.findMany()
}
