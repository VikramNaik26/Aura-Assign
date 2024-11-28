import React from 'react'
import { usePathname } from 'next/navigation'
import { Compass, MapPin, User2, Calendar, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  icon: LucideIcon
  label: string
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, label }) => {
  const pathname = usePathname()
  const isActive = pathname === href
  const fillColor = isActive ? 'gray' : 'transparent'
  const color = isActive ? 'white' : 'gray'

  return (
    <Link
      href={href}
      className="flex flex-col items-center p-1"
    >
      <Icon
        className={cn(
          "h-5 w-5",
          isActive && "h-6 w-6"
        )}
        color={color}
        fill={fillColor}
        strokeWidth={isActive ? 1.6 : 1.5}
      />
      <span className={`text-xs mt-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>{label}</span>
    </Link>
  )
}

export const BottomNavbar: React.FC = () => {
  return (
    <div className="fixed z-[9999] bottom-0 left-0 right-0 bg-white border-gray-200 p-2 shadow-[0_-4px_8px_0_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <nav className="flex-1 flex justify-around items-center [&>a]:w-16">
          <NavLink href="/dashboard" icon={Compass} label="Explore" />
          <NavLink href="/dashboard/event" icon={Calendar} label="Events" />
          <NavLink href="/dashboard/map" icon={MapPin} label="Map" />
          <NavLink href="/dashboard/profile" icon={User2} label="Profile" />
        </nav>
      </div>
    </div>
  )
}
