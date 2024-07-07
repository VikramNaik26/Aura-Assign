"use client"

import Image from "next/image";
import { VisuallyHidden } from "@reach/visually-hidden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogClose
} from "@/components/ui/dialog"
import { BackButton } from "@/components/auth/BackButton";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventForm } from "./EventForm";
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser";
import { deleteEvent } from "@/actions/event";
import { FormError } from "@/components/FormError";

interface EventCardProps {
  event: {
    id: string,
    name: string,
    description?: string | null,
    imageUrl?: string | null,
    date: Date,
    time: Date,
  } | null
}

export const EventCard = ({
  event
}: EventCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")

  const closeDialog = () => setIsDialogOpen(false)

  const organization = useCurrentOrgORUser()

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

    const orgId = organization?.id

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
            closeDialog()
          }

          if (!data?.error) {
            toast.success("Event successfully deleted")
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
        <div className="flex min-w-[80px] gap-1">
          <Dialog>
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
              <EventForm closeDialog={() => { }} />
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className='w-full flex-1' asChild>
              <Button size="icon" variant="ghost">
                <Trash2 className="h-4 w-4" />
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
              <Card className="sm:min-w-[500px] -my-4">
                <CardHeader>
                  <CardTitle className="text-lg">{event?.name}</CardTitle>
                  <CardDescription>Are you sure you wanna delete this event?</CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-4">
                  <DialogClose>
                    <Button disabled={isPending} variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button disabled={isPending} variant="destructive" onClick={() => handleDelete(event?.id)}>
                    Delete
                  </Button>
                  <FormError message={error} />
                </CardFooter>
              </Card>
            </DialogContent>
          </Dialog>
        </div>
        <BackButton
          href="/event"
          label="More details"
          className="w-min text-gray-600"
        />
      </CardFooter>
    </Card >
  )
}
