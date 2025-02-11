import { Dispatch, SetStateAction } from 'react'
import { VisuallyHidden } from '@reach/visually-hidden'
import { MapPin, Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { EventForm } from './EventForm'
import { cn } from '@/lib/utils'

interface EventDialogProps {
  isDialogOpen: boolean,
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  closeDialog: () => void
  dashboard?: boolean
}

export const EventDialog = ({
  isDialogOpen,
  setDialogOpen,
  closeDialog,
  dashboard = false,
}: EventDialogProps) => {
  const pathname = usePathname()

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger className={cn("w-full", dashboard && 'w-min')} asChild>
        <Button
          size='lg'
          disabled={pathname === '/dashboard/map'}
          variant={dashboard ? 'secondary' : 'default'}
          className={cn(
            'font-normal justify-start w-full px-2',
            dashboard && 'w-min p-3 mb-4',
          )}
        >
          {pathname === '/dashboard/map' ? <MapPin className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {pathname === '/dashboard/map' ? 'Map view!' : 'Create an event'}
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
        <EventForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  )
}
