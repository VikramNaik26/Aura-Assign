"use client"

import { toast } from "sonner"
import { useTransition } from "react"

import { logout } from "@/actions/logout"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  children: React.ReactNode
}

export const LogoutButton = ({
  children
}: LogoutButtonProps) => {
  const [isPending, startTransition] = useTransition()

  const onClick = () => {
    startTransition(() => {
      logout()
        .then(() => {
          toast.success("Successfully logged out")
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
