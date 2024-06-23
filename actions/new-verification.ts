"use server"

import { getOrgByEmail } from "@/data/organizations"
import { getUserByEmail } from "@/data/users"
import { getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"

export const newOrgVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)
  if (!existingToken) return { error: "Token does not exist" }

  const hasExpired = new Date() > new Date(existingToken.expires)
  if (hasExpired) return { error: "Token has expired" }
  const existingOrg = await getOrgByEmail(existingToken.email)
  if (!existingOrg) return { error: "Email does not exist" }

  await db.organization.update({
    where: {
      id: existingOrg.id
    },
    data: {
      emailVerified: new Date(),
      email: existingOrg.email
    }
  })

  await db.verificationToken.delete({
    where: {
      id: existingToken.id
    }
  })

  return { success: "Email verified" }
}

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token)
  if (!existingToken) return { error: "Token does not exist" }

  const hasExpired = new Date() > new Date(existingToken.expires)
  if (hasExpired) return { error: "Token has expired" }

  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) return { error: "Email does not exist" }

  await db.user.update({
    where: {
      id: existingUser.id
    },
    data: {
      emailVerified: new Date(),
      email: existingUser.email
    }
  })

  await db.verificationToken.delete({
    where: {
      id: existingToken.id
    }
  })

  return { success: "Email verified" }
}
