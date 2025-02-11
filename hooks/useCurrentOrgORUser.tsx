import { useSession } from "next-auth/react"

import { ExtendedUser } from "@/next-auth"

export const useCurrentOrgORUser = () => {
  const { data, status, update } = useSession({ required: true })

  return { data: data?.user as ExtendedUser, status, update }
}
