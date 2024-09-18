import { Settings2, User2 } from "lucide-react"
import { ExitIcon } from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import { LogoutButton } from "./LogoutButton"
import { Button } from "@/components/ui/button"
import { ExtendedUser } from "@/next-auth"
import { useRouter } from "next/navigation"

interface UserButtonProps {
  organizationOrUser?: ExtendedUser | undefined
}

export const UserButton = ({ organizationOrUser }: UserButtonProps) => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-4 justify-between items-center mr-4">
        <Avatar>
          <AvatarImage src={organizationOrUser?.image ?? undefined} />
          <AvatarFallback>
            <User2 />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm w-max font-semibold">{organizationOrUser?.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 mt-2" align="end">
        <Button className="w-full" variant="ghost" onClick={() => router.push('dashboard/profile')}>
          <DropdownMenuItem className="w-full">
            <User2 className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
        </Button>
        <Button className="w-full" variant="ghost">
          <DropdownMenuItem className="w-full">
            <Settings2 className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </Button>
        <LogoutButton>
          <DropdownMenuItem className="w-full">
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent >
    </DropdownMenu >
  )
}
