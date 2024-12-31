"use server"

import { db } from "@/lib/db";

export const getOrgByEmail = async (email: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: { email }
    })

    return organization
  } catch (error) {
    return null
  }
}

export const getOrgById = async (id?: string) => {
  try {
    const organization = await db.organization.findUnique({
      where: { id }
    })

    return organization
  } catch (error) {
    return null
  }
}

export const getOrgData = async (id?: string | null) => {
  if (!id) {
    return null
  }

  try {
    const organization = await db.organization.findUnique({
      where: { id }
    })

    return organization
  } catch (error) {
    return null
  }
}
