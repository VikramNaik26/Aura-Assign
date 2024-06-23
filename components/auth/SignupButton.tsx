"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
}

const SignupButton = ({
  children,
  mode = "redirect",
  asChild
}: LoginButtonProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push("/user/signup")
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
      onClick={handleClick}
      className="cursor-pointer"
      asChild={asChild}
    >
      {children}
    </Button>
  )
}

export default SignupButton
