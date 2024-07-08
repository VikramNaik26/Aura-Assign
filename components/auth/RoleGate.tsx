"use client"

import { UserRole } from "@prisma/client"

interface RoleGateProps {
  children: React.ReactNode
  role: UserRole
  allowedRole: UserRole
}

export const RoleGate = ({
  children,
  role,
  allowedRole
}: RoleGateProps) => {
  if (role !== allowedRole) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}
