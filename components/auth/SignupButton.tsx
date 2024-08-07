"use client"

import { useRouter } from "next/navigation"
import { ClassNameValue } from "tailwind-merge"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
  className: ClassNameValue
}

const SignupButton = ({
  children,
  mode = "redirect",
  asChild,
  className
}: LoginButtonProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push("/user/register")
  }

  if (mode === "modal") {
    return (
      <span>
        TODO: Implement modal
      </span>
    )
  }

  return (
    <Button
    variant="secondary"
      onClick={handleClick}
      className={cn("cursor-pointer bg-white text-black", className)}
      asChild={asChild}
    >
      {children}
    </Button>
  )
}

export default SignupButton
