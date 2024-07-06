import { useSession } from "next-auth/react"

export const useCurrentOrgORUser = () => {
  const { data } = useSession()
  return data?.user
}
