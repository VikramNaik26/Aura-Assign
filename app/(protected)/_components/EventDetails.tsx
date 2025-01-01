"use client"

import Image from "next/image"
import { VisuallyHidden } from "@reach/visually-hidden"
import { CircleCheckBig, CircleX, Clock, Loader2 } from "lucide-react"
import { Organization, Status, UserRole } from "@prisma/client"
import { useEffect, useState, useTransition } from "react"
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

import { OrgEvent, deleteEvent } from "@/actions/event"
import { EventForm } from "./EventForm"
import { RoleGate } from "@/components/auth/RoleGate"
import { EnrollForm } from "./EnrollForm"
import { useCurrentRole } from "@/hooks/useCurrentRole"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { getEnrollmentStatusText, hasEventId } from "@/lib/utils"
import { Enrollments, getEnrollmentsByUserId } from "@/actions/enrollment"
import { getOrgData } from "@/data/organizations"
import { DialogPortal } from "@radix-ui/react-dialog"

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
            history.back()
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

  const { data: orgData, isLoading: isOrgDataLoading } = useQuery<Organization | null>({
    queryKey: ["orgData", event?.orgId],
    queryFn: () => getOrgData(event.orgId)
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row-reverse gap-4 min-h-full">
        <div className="w-full md:max-w-[350px] sm:aspect-auto">
          <Image
            alt="Product image"
            className="w-full h-60 rounded-md object-cover sm:max-w-[400px]"
            height="300"
            src={(event?.imageUrl && event?.imageUrl) || "/assets/EventImageOne.svg"}
            width="300"
          />
          {!isOrgDataLoading && orgData && (
            <div className="p-4 rounded-md mb-4">
              <h3 className="font-semibold mb-2">Organization Details</h3>
              <p>Name: {orgData.name}</p>
              <p>Email: {orgData.email}</p>
            </div>
          )}
        </div>
        <EventForm
          className="w-full my-0 min-h-full flex flex-col"
          headerText="Event Details"
          headerLabel="Description of the event"
          headerClassName="items-start"
          isEdit
          eventObject={event}
          handleDelete={handleDelete}
          isPending={isPending}
        />
      </div>
      <RoleGate role={role} allowedRole={UserRole.USER}>
        <Dialog open={isDialogOpen.enrollDialog} onOpenChange={() => setIsDialogOpen({ ...isDialogOpen, enrollDialog: !isDialogOpen.enrollDialog })}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="sm:max-w-60 max-sm:mx-12" disabled={isLoadingEnrollments || hasEventId(enrollments as Enrollments[], event?.id)}>
              {isLoadingEnrollments
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : (() => {
                  const { text, status } = getEnrollmentStatusText(
                    enrollments as Enrollments[],
                    event?.id
                  )

                  return (
                    <span className="flex justify-center items-center">
                      {text}
                      {status === Status.PENDING && <Clock className="ml-2 h-4 w-4" />}
                      {status === Status.REJECTED && <CircleX className="ml-2 h-4 w-4" />}
                      {status === Status.APPROVED && <CircleCheckBig className="ml-2 h-4 w-4" />}
                    </span>
                  )
                })()
              }
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogContent className="p-0 auto bg-transparent border-none z-[9999]">
              <DialogHeader>
                <DialogTitle asChild>
                  <VisuallyHidden>Enroll to an event</VisuallyHidden>
                </DialogTitle>
                <DialogDescription asChild>
                  <VisuallyHidden>Enroll to an event</VisuallyHidden>
                </DialogDescription>
              </DialogHeader>
              <EnrollForm eventId={event?.id} closeDialog={closeEnrollDialog} />
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </RoleGate>
      <RoleGate role={role} allowedRole={UserRole.USER}>
        <div className="min-h-20">
        </div>
      </RoleGate>
    </>
  )
}
