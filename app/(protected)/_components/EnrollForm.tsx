"use client"

import * as z from "zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { EnrollmentSchema } from "@/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/FormError"
import { createOrUpdateEnrollment } from "@/actions/enrollment"
import { toast } from "sonner"
import { useCurrentOrgORUser } from "@/hooks/useCurrentOrgORUser"

interface EnrollFormProps {
  eventId?: string
  closeDialog: () => void
}

export const EnrollForm = (props: EnrollFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")

  const { data: user, status } = useCurrentOrgORUser()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ enrollment, userId, eventId }: {
      enrollment: z.infer<typeof EnrollmentSchema>,
      userId?: string,
      eventId?: string
    }) => createOrUpdateEnrollment(enrollment, userId, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolled-events'] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrolled-users'] })
    },
    onError: () => {
      setError('Something went wrong');
    },
  })

  const form = useForm<z.infer<typeof EnrollmentSchema>>({
    resolver: zodResolver(EnrollmentSchema),
    defaultValues: {
      userProfile: {
        name: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: undefined,
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      jobDetails: ""
    }
  })

  const onSubmit = (values: z.infer<typeof EnrollmentSchema>) => {
    setError("")

    type Result<T> = { success: T; error?: never } | { error: string; details?: any; success?: never }

    function isSuccess<T>(result: Result<T>): result is { success: T } {
      return 'success' in result;
    }

    function isError(result: Result<any>): result is { error: string; details?: any } {
      return 'error' in result;
    }

    startTransition(() => {
      mutation.mutateAsync({
        enrollment: values,
        userId: user?.id,
        eventId: props.eventId
      })
        .then(data => {
          if (isError(data)) {
            form.reset()
            setError(data.error)
          } else if (isSuccess(data)) {
            form.reset()
            setError("")
            props.closeDialog()
            toast.success("Enrolled successfully")
          }
        })
    })
  }

  if (status === "loading") {
    return <div>Loading</div>
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <CardWrapper
        headerText="Enroll in an event"
        headerLabel="Enter the details below to enroll in an event"
        className="sm:w-[80dvw] sm:-ml-12 md:min-w-[680px] md:-ml-32 max-w-[800px] bg-white rounded-lg shadow-lg"
      >
        <div className="max-h-[80vh] overflow-y-auto scrollbar-hide">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="userProfile.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fullname</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Vikram Naik"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="vikramnaik@gmail.com"
                            type="email"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="1234567890"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[99999]" position="popper">
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="YYYY-MM-DD"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="userProfile.streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="D no 123344, House name"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Mangaluru"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Karnataka"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="575030"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userProfile.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="India"
                            type="text"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormError message={error} />
              <div className="flex flex-col gap-4 md:flex-row">
                <Button
                  type="submit"
                  className="w-full"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Enroll"
                  )}
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  onClick={props.closeDialog}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardWrapper>
    </div>
  )
}

