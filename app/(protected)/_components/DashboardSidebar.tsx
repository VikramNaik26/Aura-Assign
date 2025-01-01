'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { CircleCheckBig, LayoutDashboard, LineChart, MapPinned, Radar } from 'lucide-react'
import { UserRole } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EventDialog } from './EventDialog'
import { RoleGate } from "@/components/auth/RoleGate"
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { Skeleton } from '@/components/ui/skeleton'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

export const DashboardSidebar = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const enrolled = searchParams.get('enrolled')
  const nearby = searchParams.get('nearby')

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
  const closeDialog = () => setDialogOpen(false)

  const { role, status } = useCurrentRole()

  if (status === 'loading') {
    return (
      <DashboardSidebar.Skeleton />
    )
  }

  return (
    <aside className="hidden w-[206px] lg:flex flex-col space-y-6 pt-5 px-1">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={60}
            height={60}
          />
          <span className={cn('font-semibold text-sm', font.className)}>
            Aura Assign
          </span>
        </div>
      </Link>
      <RoleGate role={role} allowedRole={UserRole.ORGANIZATION}>
        <div className="space-y-1 w-full">
          <EventDialog isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen} closeDialog={closeDialog} />
        </div>
      </RoleGate>
      <div className="space-y-1 w-full">
        <Button
          variant={enrolled || nearby || pathname === '/dashboard/map' || pathname === '/dashboard/analytics' ? 'ghost' : 'secondary'}
          asChild
          size='lg'
          className='font-normal justify-start w-full px-2'
        >
          <Link href='/dashboard'>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Event List
          </Link>
        </Button>
      </div>
      <RoleGate role={role} allowedRole={UserRole.USER}>
        <div className="space-y-1 w-full">
          <Button
            variant={enrolled ? 'secondary' : 'ghost'}
            asChild
            size='lg'
            className='font-normal justify-start w-full px-2'
          >
            <Link href={{
              pathname: '/dashboard',
              query: { enrolled: true },
            }}>
              <CircleCheckBig className="w-4 h-4 mr-2" />
              Enrolled events
            </Link>
          </Button>
        </div>
      </RoleGate>
      <div className="space-y-1 w-full">
        <Button
          variant={nearby ? 'secondary' : 'ghost'}
          asChild
          size='lg'
          className='font-normal justify-start w-full px-2'
        >
          <Link href={{
            pathname: '/dashboard',
            query: { nearby: true },
          }}>
            <Radar className="w-4 h-4 mr-2" />
            Nearby Events
          </Link>
        </Button>
      </div>
      <div className="space-y-1 w-full">
        <Button
          variant={pathname === '/dashboard/map' ? 'secondary' : 'ghost'}
          asChild
          size='lg'
          className='font-normal justify-start w-full px-2'
        >
          <Link href='/dashboard/map'>
            <MapPinned className="w-4 h-4 mr-2" />
            Map
          </Link>
        </Button>
      </div>
      <div className="space-y-1 w-full">
        <Button
          variant={pathname === '/dashboard/analytics' ? 'secondary' : 'ghost'}
          asChild
          size='lg'
          className='font-normal justify-start w-full px-2'
        >
          <Link href='/dashboard/analytics'>
            <LineChart className="w-4 h-4 mr-2" />
            Analytics
          </Link>
        </Button>
      </div>
    </aside>
  )
}

DashboardSidebar.Skeleton = function DashboardSidebarSkeleton() {
  return (
    <aside className="hidden w-[206px] lg:flex flex-col space-y-6 pt-5 px-1">
      <div className="flex items-center gap-x-2">
        <Skeleton className="w-[34px] h-[34px] rounded" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="space-y-1 w-full">
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="space-y-1 w-full">
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="space-y-1 w-full">
        <Skeleton className="h-12 w-full" />
      </div>
    </aside>
  )
}
