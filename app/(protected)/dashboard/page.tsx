"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { UserRole } from "@prisma/client"

import { getUsers } from "@/actions/users"

const Dashboard = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    // enabled: !!session,
  })

  return (
    <section>Dashboard</section>
  )
}

export default Dashboard
