'use client'

import { useState } from "react"
import Image from "next/image"
import { User, Mail, Phone, Calendar, MapPin, Edit } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/app/(protected)/_components/LogoutButton"
import { ExitIcon } from "@radix-ui/react-icons"
import { EditProfileForm } from "./EditProfileForm"
import { UserProfile, User as UserType } from "@prisma/client"
import { ExtendedUserWithProfile } from "@/actions/enrollment"
import { format } from "date-fns"

interface ProfileClientProps {
  user: UserType | null
  userProfile: UserProfile | null
}

export function ProfileClient({ user, userProfile }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <EditProfileForm
              user={user}
              userProfile={userProfile}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative h-24 w-24">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-4xl">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
          <p className="text-muted-foreground">{user?.role}</p>
          <div className="flex gap-4 mt-4">
            <LogoutButton isProfile>
              <ExitIcon className="h-4 w-4 mr-2" />
              Logout
            </LogoutButton>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsEditing(true)}
            >
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
              <span>{userProfile?.phoneNumber || "Not provided"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {userProfile?.dateOfBirth
                  ? format(new Date(userProfile.dateOfBirth), "MM/dd/yyyy")
                  : "Not provided"}
              </span>
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{userProfile?.gender || "Not provided"}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="mr-2 h-4 w-4 mt-1" />
              <div>
                {userProfile?.streetAddress ? (
                  <>
                    <p>{userProfile.streetAddress}</p>
                    <p>{`${userProfile.city || ""}, ${userProfile.state || ""} ${userProfile.postalCode || ""
                      }`}</p>
                    <p>{userProfile.country}</p>
                  </>
                ) : (
                  <span>Address not provided</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

