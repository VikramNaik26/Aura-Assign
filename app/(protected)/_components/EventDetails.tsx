"use client"

import Image from "next/image"
import { VisuallyHidden } from "@reach/visually-hidden"
import { CircleCheckBig, Loader2 } from "lucide-react"
import { UserRole } from "@prisma/client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { OrgEvent, deleteEvent, getEventById } from "@/actions/event"
import { EventForm } from "./EventForm"
import { RoleGate } from "@/components/auth/RoleGate"
import { EnrollForm } from "./EnrollForm"
import { useCurrentRole } from "@/hooks/useCurrentRole"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { hasEventId } from "@/lib/utils"
import { Enrollments, getEnrollmentsByUserId } from "@/actions/enrollment"

interface EventDetailsProps {
  event: OrgEvent
}

type DialogState = {
  editDialog: boolean
  deleteDialog: boolean
  enrollDialog: boolean
}

export const EventDetails = ({
  event
}: EventDetailsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<DialogState>({
    editDialog: false,
    deleteDialog: false,
    enrollDialog: false
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")

  const router = useRouter()

  const closeEditDialog = () => setIsDialogOpen(prev => ({ ...prev, editDialog: false }))
  const closeDeleteDialog = () => setIsDialogOpen(prev => ({ ...prev, deleteDialog: false }))
  const closeEnrollDialog = () => setIsDialogOpen(prev => ({ ...prev, enrollDialog: false }))

  const { role } = useCurrentRole()

  const queryClient = useQueryClient()

  const organizationOrUser = useCurrentOrgORUser()

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

  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery<Enrollments[]>({
    queryKey: ["enrollments", organizationOrUser?.data?.id],
    queryFn: () => {
      return getEnrollmentsByUserId(organizationOrUser?.data?.id)
    },
    enabled: !!organizationOrUser?.data?.id
  })

  return (
    <>
      <div className="flex flex-col sm:flex-row-reverse gap-4 min-h-full">
        <div className="w-full md:max-w-[350px] sm:aspect-auto">
          <Image
            alt="Product image"
            className="w-full rounded-md object-cover sm:max-w-[400px]"
            height="300"
            src="/assets/EventImageOne.svg"
            width="300"
          />
        </div>
        <EventForm
          className="w-full my-0 min-h-full flex flex-col"
          headerText="Event Details"
          headerLabel="Description of the event"
          headerClassName="items-start"
          isEdit
          eventObject={event}
          handleDelete={handleDelete}
        />
      </div>
      <RoleGate role={role} allowedRole={UserRole.USER}>
        <Dialog open={isDialogOpen.enrollDialog} onOpenChange={() => setIsDialogOpen({ ...isDialogOpen, enrollDialog: !isDialogOpen.enrollDialog })}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="m-3 sm:max-w-60" disabled={isLoadingEnrollments || hasEventId(enrollments as Enrollments[], event?.id)}>
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
          <DialogContent className="p-0 auto bg-transparent border-none z-[99999]">
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
      <div className="min-h-20">
      </div>
    </>
  )
}
