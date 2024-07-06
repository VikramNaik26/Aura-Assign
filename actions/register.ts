"use server"

import * as z from "zod"
import bcrypt from "bcryptjs"

import { RegisterSchema } from "@/schemas"
import { db } from "@/lib/db"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { getOrgByEmail } from "@/data/organizations"
import { getUserByEmail } from "@/data/users"

export const registerOrg = async (values: z.infer<typeof RegisterSchema>) => {
  const salt = 10
  const validateFields = RegisterSchema.safeParse(values)

  if (!validateFields.success) {
    return { error: "Invalid Fields" }
  }

  const { email, name, password } = validateFields.data
  const hashPassword = await bcrypt.hash(password, salt)

  const existingUser = await getOrgByEmail(email)

  if (existingUser) return { error: "Email already in use" }

  await db.organization.create({
    data: {
      email,
      name,
      password: hashPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)
  // await sendVerificationEmail(
  //   verificationToken.email,
  //   verificationToken.token,
  //   true
  // )

  return { success: "Confirmation email sent" }
}

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const salt = 10
  const validateFields = RegisterSchema.safeParse(values)

  if (!validateFields.success) {
    return { error: "Invalid Fields" }
  }

  const { email, name, password } = validateFields.data
  const hashPassword = await bcrypt.hash(password, salt)

  const existingUser = await getUserByEmail(email)

  if (existingUser) return { error: "Email already in use" }

  await db.user.create({
    data: {
      email,
      name,
      password: hashPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)
  // await sendVerificationEmail(
  //   verificationToken.email,
  //   verificationToken.token,
  //   false
  // )

  return { success: "Confirmation email sent" }
}
