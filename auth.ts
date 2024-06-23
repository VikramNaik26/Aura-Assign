import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getUserById } from "@/data/users"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const {
  handlers,
  signIn,
  signOut,
  auth
} = NextAuth({
  pages: {
    signIn: "/user/login",
    error: "/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow OAuth without email verification
      if (account?.provider !== "credentials") return true

      // prevent sign without email verification
      const existingUser = await getUserById(user.id)
      if (!existingUser || !existingUser.emailVerified) {
        return false
      }

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if (!twoFactorConfirmation) {
          return false
        }

        // Delete two factor confirmation for the next signin
        await db.twoFactorConfirmation.delete({
          where: {
            userId: existingUser.id
          }
        })

        return true
      }

      return true
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }

      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.role = existingUser.role
      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
})
