"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
  isLink?: boolean
  loginHref?: string
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
  isLink = false,
  loginHref = "/user/login",
}: LoginButtonProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(loginHref)
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

