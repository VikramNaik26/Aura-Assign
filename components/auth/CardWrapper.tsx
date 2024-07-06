"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter
} from "@/components/ui/card"
import { Header } from "@/components/auth/Header"
import { Social } from "@/components/auth/Social"
import { BackButton } from "@/components/auth/BackButton"
import { cn } from "@/lib/utils"
import { ClassNameValue } from "tailwind-merge"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel?: string
  backButtonHref?: string
  showSocial?: boolean
  className?: ClassNameValue
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  className
}: CardWrapperProps) => {
  return (
    <Card className={cn("w-[440px] shadow-md my-auto", className)}>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        {(backButtonHref && backButtonLabel) && (
          <BackButton
            href={backButtonHref}
            label={backButtonLabel}
          />
        )}
      </CardFooter>
    </Card>
  )
}
