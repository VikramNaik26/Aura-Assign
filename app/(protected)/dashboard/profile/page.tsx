import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUserProfileById } from "@/actions/users"
import { currentUser } from "@/lib/auth"
import { LogoutButton } from "../../_components/LogoutButton"
import { ExitIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const Profile = async () => {
  const user = await currentUser()
  const userProfile = await getUserProfileById(user?.id)

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-4xl">{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
          <p className="text-muted-foreground">{user?.role}</p>
          <div className="flex gap-4">
            <LogoutButton isProfile>
              <ExitIcon className="h-4 w-4 mr-2" />
              Logout
            </LogoutButton >
            <Button variant="outline" className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              <span>{userProfile?.phoneNumber}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{userProfile?.dateOfBirth?.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{userProfile?.gender}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="mr-2 h-4 w-4 mt-1" />
              <div>
                <p>{userProfile?.streetAddress}</p>
                <p>{`${userProfile?.city}, ${userProfile?.state} ${userProfile?.postalCode}`}</p>
                <p>{userProfile?.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
