import * as z from "zod"

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters are required"
  }),
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
})

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Password is required"
  }),
  code: z.optional(z.string())
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters are required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
})

export const EventSchema = z.object({
  name: z.string({
    message: "Name is required"
  }),
  description: z.optional(z.string()),
  imageUrl: z.optional(z.string()),
  time: z.string().regex(timeRegex, {
    message: "Time must be in HH:mm format"
  }),
  date: z.string().date()
})
