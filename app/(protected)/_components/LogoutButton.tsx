"use client"

import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { logout } from "@/actions/logout"
import { Button } from "@/components/ui/button"
import { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
  children: React.ReactNode
  isProfile?: boolean
  className?: ClassNameValue
}

export const LogoutButton = ({
  children,
  isProfile = false,
  className
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
      variant={isProfile ? "outline" : "ghost"}
      onClick={onClick}
      className={cn(
        "cursor-pointer w-full",
        className
      )}
      disabled={isPending}
    >
      {children}
    </Button>
  )
}
