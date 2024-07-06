'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { LayoutDashboard, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

export const DashboardSidebar = () => {
  const searchParams = useSearchParams()
  const favorites = searchParams.get('favorites')

  return (
    <aside className="hidden w-[206px] lg:flex flex-col space-y-6 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image
            src="/logo.svg"
            alt="logo"
            width={34}
            height={34}
          />
          <span className={cn('font-semibold text-sm', font.className)}>
            Aura Assign
          </span>
        </div>
      </Link>
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? 'ghost' : 'secondary'}
          asChild
          size='lg'
          className='font-normal justify-start w-full px-2'
        >
          <Link href='/'>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Organizations
          </Link>
        </Button>
      </div>
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? 'secondary' : 'ghost'}
          asChild
          size='lg'
          className='font-normal justify-start w-full px-2'
        >
          <Link href={{
            pathname: '/',
            query: { favorites: true },
          }}>
            <Star className="w-4 h-4 mr-2" />
            Users
          </Link>
        </Button>
      </div>
    </aside>
  )
}
