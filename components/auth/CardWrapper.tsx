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
  headerText?: string
  headerLabel: string
  backButtonLabel?: string
  backButtonHref?: string
  showSocial?: boolean
  className?: ClassNameValue
  headerClassName?: ClassNameValue
}

export const CardWrapper = ({
  children,
  headerText,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  className,
  headerClassName
}: CardWrapperProps) => {
  return (
    <Card className={cn("w-full max-sm:border-none max-sm:shadow-none sm:w-[440px] shadow-md my-auto", className)}>
      <CardHeader>
        <Header headerText={headerText} label={headerLabel} headerClassName={headerClassName} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      {(backButtonHref && backButtonLabel) && (
        <CardFooter>
          <BackButton
            href={backButtonHref}
            label={backButtonLabel}
          />
        </CardFooter>
      )}
    </Card>
  )
}
