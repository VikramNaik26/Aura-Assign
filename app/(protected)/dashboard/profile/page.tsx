import { currentUser } from "@/lib/auth"
import { getUserProfileById } from "@/actions/users"
import { ProfileClient } from "./_components/ProfileClient"
import { getUserById } from "@/data/users"

export default async function ProfilePage() {
  const user = await currentUser()
  const userData = await getUserById(user?.id)
  const userProfile = await getUserProfileById(user?.id)

  if (!user) {
    return null // Or handle unauthorized access
  }

  return <ProfileClient user={userData} userProfile={userProfile} />
}


