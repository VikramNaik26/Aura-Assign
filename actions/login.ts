"use server"

import * as z from "zod"
import { AuthError } from "next-auth"

import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { getUserByEmail } from "@/data/users"
import {
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens"
import {
  sendVerificationEmail,
  sendTwoFactorTokenEmail
} from "@/lib/mail"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getOrgByEmail } from "@/data/organizations"

export const orgLogin = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)

  if (!validateFields.success) {
    return { error: "Invalid Fields" }
  }

  const { email, password } = validateFields.data

  const existingOrg = await getOrgByEmail(email)

  if (!existingOrg || !existingOrg.email || !existingOrg.password) {
    return { error: "Email does not exist" }
  }

  if (!existingOrg.emailVerified) {
    const verificationToken = await generateVerificationToken(existingOrg.email)
    await sendVerificationEmail(
      existingOrg.email,
      verificationToken.token,
      true
    )

    return { success: "Confirmation email sent!" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
    return { success: "Organization Successfully logged in" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }

        case "CallbackRouteError":
          return { error: "Invalid credentials" }

        default:
          return { error: "Something went wrong" }
      }
    }

    throw error
  }
}

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values)

  if (!validateFields.success) {
    return { error: "Invalid Fields" }
  }

  const { email, password, code } = validateFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)
    await sendVerificationEmail(
      existingUser.email,
      verificationToken.token
    )

    return { success: "Confirmation email sent!" }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

      if (!twoFactorToken) {
        return { error: "Invalid code" }
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code" }
      }

      const hasExpired = new Date() > new Date(twoFactorToken.expires)
      if (hasExpired) {
        return { error: "Code has expired" }
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id
        }
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id
          }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)

      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token
      )

      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
    return { success: "User Successfully logged in" }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }

        case "CallbackRouteError":
          return { error: "Invalid credentials" }

        default:
          return { error: "Something went wrong" }
      }
    }

    throw error
  }
}
