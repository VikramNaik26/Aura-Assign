"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { getUsers } from "@/actions/users"

const Dashboard = () => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    // enabled: !!session,
  })

  return (
    <>
      <section>Dashboard</section>
      <section>
        <ul>
          {users?.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default Dashboard
