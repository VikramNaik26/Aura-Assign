"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
  isLink?: boolean
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
  isLink = false,
}: LoginButtonProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push("/auth/login")
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
      variant={isLink ? "link" : "default"}
    >
      {children}
    </Button>
  )
}

export default LoginButton

