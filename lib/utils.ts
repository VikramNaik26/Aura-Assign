import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { Enrollments } from "@/actions/enrollment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasEventId(enrollments: Enrollments[], targetEventId?: string) {
  return enrollments.some(enrollment => enrollment.eventId === targetEventId)
}

export const truncateAddress = (maxLength: number, str?: string): string => {
  if (!str) return '-'
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}
