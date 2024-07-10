import { useSession } from "next-auth/react"

export const useCurrentRole = () => {
  const { data: session, status } = useSession({ required: true })

  return { role: session?.user?.role, status }
}
