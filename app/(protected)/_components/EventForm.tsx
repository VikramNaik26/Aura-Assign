"use client"

import * as z from "zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ClassNameValue } from "tailwind-merge"
import { UserRole } from "@prisma/client"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

import { EventSchema } from "@/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/FormError"
import { OrgEvent, createOrUpsertEvent } from "@/actions/event"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"
import { Textarea } from "@/components/ui/textarea"
import { RoleGate } from "@/components/auth/RoleGate"

interface EventFormProps {
  closeDialog?: () => void
  headerText?: string
  headerLabel?: string
  className?: ClassNameValue
  headerClassName?: ClassNameValue
  isEdit?: boolean
  eventObject?: OrgEvent
  isUpdate?: boolean
  handleDelete?: (id?: string) => void
}

export const EventForm = (props: EventFormProps) => {
  const closeDialog = props.closeDialog
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [isInputDisabled, setIsInputDisabled] = useState(props.isEdit)

  const { data: organization } = useCurrentOrgORUser()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (event: z.infer<typeof EventSchema>) => createOrUpsertEvent(event, organization?.id, props.eventObject?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: () => {
      setError('Something went wrong');
    },
  })

  const extractDateAndTime = (
    dateTime: Date | undefined
  ): {
    date: string, time: string
  } => {
    if (!dateTime) return { date: '', time: '' }
    try {
      return {
        date: format(dateTime, 'yyyy-MM-dd'),
        time: format(dateTime, 'HH:mm')
      }
    } catch (error) {
      console.error("Error parsing date and time:", error)
      return { date: '', time: '' }
    }
  }

  const { date, time } = extractDateAndTime(props.eventObject?.date)

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: props.eventObject?.name || "",
      description: props.eventObject?.description || "",
      imageUrl: props.eventObject?.imageUrl || "",
      date,
      time
    }
  })

  const onSubmit = (values: z.infer<typeof EventSchema>) => {
    setError("")

    startTransition(() => {
      mutation.mutateAsync(values)
        .then(data => {
          if (data?.error) {
            form.reset()
            setError(data?.error)
          }

          if (data?.success) {
            form.reset()
            if (closeDialog) {
              closeDialog()
            }
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
    <CardWrapper
      headerText={props.headerText || "Create Event"}
      headerLabel={props.headerLabel || "Enter the event details!"}
      className={cn("-my-4 w-full", props.className)}
      headerClassName={props.headerClassName}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:min-w-[440px]"
        >
          <div className="space-y-4">
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter title here"
                        type="text"
                        disabled={isPending || isInputDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter description here"
                        disabled={isPending || isInputDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!props.isEdit && (
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event image</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter image"
                          type="text"
                          disabled={isPending || isInputDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-16">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          disabled={isPending || isInputDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          disabled={isPending || isInputDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          </div>
          <FormError message={error} />
          <div className="flex gap-6">
            <RoleGate role={organization?.role} allowedRole={UserRole.ORGANIZATION}>
              {props.isEdit ? (
                <>
                  <Button
                    type="button"
                    className="px-6"
                    onClick={() => setIsInputDisabled(!isInputDisabled)}
                  >
                    {isInputDisabled ? "Edit" : "Save"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (props.handleDelete && props.eventObject) {
                        props.handleDelete?.(props.eventObject?.id)
                        history.back()
                      } else {
                        toast.error("Something went wrong")
                      }
                    }}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  className="w-full"
                >
                  {
                    props.isUpdate && !isPending
                      ? "Update"
                      : isPending
                        ? <Loader2 className="h-4 animate-spin" />
                        : "Create"
                  }
                </Button>
              )}
            </RoleGate>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
}

