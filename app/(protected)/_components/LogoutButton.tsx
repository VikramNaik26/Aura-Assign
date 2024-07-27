"use client"

import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { logout } from "@/actions/logout"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  children: React.ReactNode
}

export const LogoutButton = ({
  children
}: LogoutButtonProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const onClick = () => {
    startTransition(() => {
      logout()
       .then(() => {
          router.push("/user/login")
          location.reload()
        })
        .catch((error) => {
          toast.error("Failed to logout")
          console.error(error)
        })
    })
  }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="cursor-pointer w-full"
      disabled={isPending}
    >
      {children}
    </Button>
  )
}
