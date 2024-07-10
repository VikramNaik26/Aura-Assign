import { useSession } from "next-auth/react"

export const useCurrentOrgORUser = () => {
  const { data, status } = useSession({ required: true })

  return { data: data?.user, status }
}
