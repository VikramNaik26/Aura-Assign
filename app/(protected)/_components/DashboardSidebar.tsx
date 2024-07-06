'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { LayoutDashboard, Plus, Star } from 'lucide-react'
import { VisuallyHidden } from '@reach/visually-hidden'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'
import { EventForm } from './EventForm'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

export const DashboardSidebar = () => {
  const searchParams = useSearchParams()
  const favorites = searchParams.get('favorites')

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
  const closeDialog = () => setDialogOpen(false)

  return (
    <aside className="hidden w-[206px] lg:flex flex-col space-y-6 pt-5 px-1">
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
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className='w-full' asChild>
            <Button
              size='lg'
              className='font-normal justify-start w-full px-2'
              onClick={() => { console.log('clicked') }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create an event!
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 w-auto bg-transparent border-none">
            <DialogHeader>
              <DialogTitle asChild>
                <VisuallyHidden>Create an event</VisuallyHidden>
              </DialogTitle>
              <DialogDescription asChild>
                <VisuallyHidden>Fill out the form to create a new event</VisuallyHidden>
              </DialogDescription>
            </DialogHeader>
            <EventForm closeDialog={closeDialog}/> 
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? 'ghost' : 'secondary'}
          asChild
          size='lg'
          className='font-normal justify-start w-full px-2'
        >
          <Link href='/'>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Event List
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