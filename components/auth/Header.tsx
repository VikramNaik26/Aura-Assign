import { Poppins } from "next/font/google";
import { ClassNameValue } from "tailwind-merge";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

interface HeaderProps {
  headerText?: string
  label?: string
  headerClassName?: ClassNameValue
}

export const Header = ({
  headerText,
  label,
  headerClassName
}: HeaderProps) => {
  return (
    <div className={cn("w-full flex flex-col gap-y-4 items-center justify-center", headerClassName)}>
      <h1 className={cn(
        "text-3xl font-semibold",
        font.className
      )}>
        {headerText ? headerText : "Get started"}
      </h1>
      {label && (
        <p className="text-muted-foreground text-sm">
          {label}
        </p>
      )}
    </div>
  )
}
