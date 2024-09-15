"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { VisuallyHidden } from "@reach/visually-hidden"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { UserRole } from "@prisma/client"
import { Edit, Loader2, Trash2, CircleCheckBig } from "lucide-react"

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogClose
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from "@/components/auth/BackButton"
import { Button } from "@/components/ui/button"
import { EventForm } from "./EventForm"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { useCurrentRole } from "@/hooks/useCurrentRole"
import { deleteEvent } from "@/actions/event"
import { FormError } from "@/components/FormError"
import { RoleGate } from "@/components/auth/RoleGate"
import { EnrollForm } from "./EnrollForm"
import { Enrollments } from "@/actions/enrollment"
import { hasEventId } from "@/lib/utils"

interface EventCardProps {
  event: {
    id: string,
    name: string,
    description?: string | null
    imageUrl?: string | null
    date: Date,
    time: Date,
  } | undefined
  enrollments?: Enrollments[]
  isLoadingEnrollments?: boolean
}

type DialogState = {
  editDialog: boolean
  deleteDialog: boolean
  enrollDialog: boolean
}

export const EventCard = ({
  event,
  enrollments,
  isLoadingEnrollments = false,
}: EventCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<DialogState>({
    editDialog: false,
    deleteDialog: false,
    enrollDialog: false
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")

  const closeEditDialog = () => setIsDialogOpen(prev => ({ ...prev, editDialog: false }))
  const closeDeleteDialog = () => setIsDialogOpen(prev => ({ ...prev, deleteDialog: false }))
  const closeEnrollDialog = () => setIsDialogOpen(prev => ({ ...prev, enrollDialog: false }))

  const organizationOrUser = useCurrentOrgORUser()

  const { role } = useCurrentRole()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, orgId }: { id: string; orgId: string }) => deleteEvent({ id, orgId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: () => {
      setError('Something went wrong')
    },
  })

  const handleDelete = (id?: string) => {
    setError("")

    const orgId = organizationOrUser.data?.id

    if (!id || !orgId) {
      setError("Id missing")
      return
    }

    startTransition(() => {
      mutation.mutateAsync({ id, orgId })
        .then(data => {
          if (data?.error) {
            setError(data?.error)
          }

          if (data?.success) {
            closeDeleteDialog()
          }

          if (!data?.error) {
            toast.success(data?.success)
          }
        })
        .catch(() => {
          setError("Something went wrong")
        })
    })
  }

  return (
    <Card className="sm:max-w-[300px] max-sm:w-[100%] flex flex-col justify-between">
      <CardContent className="w-full max-w-[280px] max-h-[200px]">
        <Image
          src="/assets/nextTask.svg"
          alt="Event"
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="text-lg">{event?.name}</CardTitle>
        <CardDescription>{event?.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between px-2">
        <RoleGate role={role} allowedRole={UserRole.ORGANIZATION}>
          <div className="flex min-w-[80px] gap-1">
            <Dialog
              open={isDialogOpen.editDialog}
              onOpenChange={(open) => setIsDialogOpen(prev => ({ ...prev, editDialog: open }))}
            >
              <DialogTrigger className='w-full flex-1' asChild>
                <Button size="icon" variant="ghost">
                  <Edit className="h-4 w-4" />
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
                <EventForm
                  closeDialog={closeEditDialog}
                  eventObject={event}
                  isUpdate
                  headerText="Edit Event"
                  headerLabel="Update your event details"
                />
              </DialogContent>
            </Dialog>
            <Dialog
              open={isDialogOpen.deleteDialog}
              onOpenChange={(open) => setIsDialogOpen(prev => ({ ...prev, deleteDialog: open }))}
            >
              <DialogTrigger className='w-full flex-1' asChild>
                <Button size="icon" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 w-auto bg-transparent border-none">
                <DialogHeader>
                  <DialogTitle asChild>
                    <VisuallyHidden>Delete an event</VisuallyHidden>
                  </DialogTitle>
                  <DialogDescription asChild>
                    <VisuallyHidden>This will permanently Delete an event</VisuallyHidden>
                  </DialogDescription>
                </DialogHeader>
                <Card className="sm:min-w-[500px] -my-4">
                  <CardHeader>
                    <CardTitle className="text-lg">{event?.name}</CardTitle>
                    <CardDescription>Are you sure you wanna delete this event?</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-4">
                    <DialogClose asChild>
                      <Button disabled={isPending} variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isPending} onClick={() => handleDelete(event?.id)}>
                      Delete
                    </Button>
                    <FormError message={error} />
                  </CardFooter>
                </Card>
              </DialogContent>
            </Dialog>
          </div>
        </RoleGate>
        <BackButton
          href={`dashboard/event/${event?.id}`}
          label="More details"
          className="w-min text-gray-600"
        />
        <RoleGate role={role} allowedRole={UserRole.USER}>
          <Dialog open={isDialogOpen.enrollDialog} onOpenChange={() => setIsDialogOpen({ ...isDialogOpen, enrollDialog: !isDialogOpen.enrollDialog })}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="mr-3" disabled={isLoadingEnrollments || hasEventId(enrollments as Enrollments[], event?.id)}>
                {isLoadingEnrollments
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : hasEventId(enrollments as Enrollments[], event?.id)
                    ? <span className="flex justify-center items-center">
                      Enrolled
                      <CircleCheckBig className="ml-2 h-4 w-4" />
                    </span>
                    : "Enroll now!"
                }
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 auto bg-transparent border-none">
              <DialogHeader>
                <DialogTitle asChild>
                  <VisuallyHidden>Create an event</VisuallyHidden>
                </DialogTitle>
                <DialogDescription asChild>
                  <VisuallyHidden>Fill out the form to create a new event</VisuallyHidden>
                </DialogDescription>
              </DialogHeader>
              <EnrollForm eventId={event?.id} closeDialog={closeEnrollDialog} />
            </DialogContent>
          </Dialog>
        </RoleGate>
      </CardFooter>
    </Card >
  )
}

EventCard.Skeleton = function EventCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  )
}
