import { UserRole } from '@prisma/client'
import { Compass, Plus, MapPin, User2, Calendar } from 'lucide-react'

import { RoleGate } from '@/components/auth/RoleGate'
import Link from 'next/link'

export const BottomNavbar = () => {

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-gray-200 p-2 z-10 shadow-[0_-4px_8px_0_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <nav className="flex-1 flex justify-around items-center [&>button]:w-16">
          <Link
            href="/dashboard"
            className="flex flex-col items-center p-1"
          >
            <Compass className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Explore</span>
          </Link>
          <Link
            href="/dashboard/events"
            className="flex flex-col items-center p-1"
          >
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Events</span>
          </Link>
          {/*
            <button className="bg-blue-500 text-white rounded-full p-4 -mt-8 shadow-lg">
            <Plus className="h-8 w-8" />
            </button>
          */}
          <Link
            href="/dashboard/map"
            className="flex flex-col items-center p-1"
          >
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Map</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex flex-col items-center p-1"
          >
            <User2 className="h-5 w-5 text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
