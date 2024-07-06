"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { UserRole } from "@prisma/client"

import { getUsers } from "@/actions/users"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"

const Dashboard = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    // enabled: !!session,
  })

  const user = useCurrentOrgORUser()

  return (
    <section>{JSON.stringify(user)}</section>
  )
}

export default Dashboard
