import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { Enrollments } from "@/actions/enrollment";
import { Status } from "@prisma/client";

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

export function getEnrollmentStatusText(
  enrollments: Enrollments[], 
  targetEventId?: string
): { text: string; status: Status | null } {
  const matchingEnrollment = enrollments.find(
    enrollment => enrollment.eventId === targetEventId
  )

  if (!matchingEnrollment) {
    return { text: "Enroll now!", status: null }
  }

  switch (matchingEnrollment.status) {
    case Status.APPROVED:
      return { text: "Accepted", status: Status.APPROVED }
    case Status.PENDING:
      return { text: "Pending", status: Status.PENDING }
    case Status.REJECTED:
      return { text: "Rejected", status: Status.REJECTED }
    default:
      return { text: "Enroll now!", status: null }
  }
}
