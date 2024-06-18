import { cn } from "@/lib/utils"

interface BoundedProps {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
  center?: boolean
  childClassName?: string
}

export const Bounded = ({
  as: Comp = 'section',
  className,
  children,
  center,
  childClassName,
  ...restProps
}: BoundedProps) => {
  return (
    <Comp
      className={cn(
        'px-4 py-14 first:pt-10 md:px-6 md:py-20 lg:py-24',
        className,
      )}
      {...restProps}
    >
      <div className={cn(
        center && "mx-auto flex w-full max-w-6xl flex-col items-center",
        childClassName
      )}>
        {children}
      </div>
    </Comp>
  )
}
