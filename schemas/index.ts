import { PaymentBasis } from "@prisma/client";
import * as z from "zod"

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
const Gender = z.enum(["Male", "Female", "Other"])
const dateOfBirthRegex = /^\d{4}-\d{2}-\d{2}$/;

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
  name: z.string().min(3, {
    message: "Name is required"
  }),
  description: z.optional(z.string()),
  payment: z.number().nonnegative({
    message: "Payment must be a non-negative number"
  }),
  paymentBasis: z.enum(Object.values(PaymentBasis) as [PaymentBasis, ...PaymentBasis[]], {
    message: "Payment basis must be a valid enum value"
  }),
  imageUrl: z.optional(z.string()),
  time: z.string().regex(timeRegex, {
    message: "Time must be in HH:mm format"
  }),
  date: z.string().date().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
  location: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number()
  })
})

export const UserProfileSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required"
  }),
  email: z.string().email({
    message: "Email is required"
  }),
  phoneNumber: z.optional(z.string()),
  dateOfBirth: z.string().refine(val => dateOfBirthRegex.test(val), {
    message: "Date of birth must be in YYYY-MM-DD format"
  }),
  gender: z.optional(Gender),
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string()
})

export const EnrollmentSchema = z.object({
  userProfile: UserProfileSchema,
  jobDetails: z.string().optional()
})
