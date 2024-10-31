import { cn } from "@/lib/utils"
import Image from "next/image"
import { ClassNameValue } from "tailwind-merge"

interface EmptyEnrollProps {
  className?: ClassNameValue,
  label?: string
  imagePath?: string
  subText?: string
  date?: string
}

export const EmptyEnroll = ({
  className,
  label,
  imagePath,
  subText,
  date
}: EmptyEnrollProps) => {
  return (
    <div className={
      cn("flex flex-col justify-center items-center h-full", className)
    }>
      <Image
        src="/assets/EnrollState.svg"
        alt="No events"
        height={240}
        width={240}
      />
      <h2 className="text-3xl font-bold">{label ?? "No Enrolled Events"}</h2>
      <p className="mt-2 text-lg text-muted-foreground">{subText ?? "Start by enrolling in an event"}</p>
    </div>
  )
}
