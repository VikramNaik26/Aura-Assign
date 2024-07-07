"use client"

import Link from "next/link"
import { ClassNameValue } from "tailwind-merge"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  href: string
  label: string
  className?: ClassNameValue
}

export const BackButton = ({
  href,
  label,
  className
}: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className={cn("font-normal w-full", className)}
      size="sm"
      asChild
    >
      <Link className="text-xs" href={href}>
        {label}
      </Link>
    </Button>
  )
}
