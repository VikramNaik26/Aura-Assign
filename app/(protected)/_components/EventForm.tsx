"use client"

import * as z from "zod"
import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ClassNameValue } from "tailwind-merge"
import { PaymentBasis, UserRole } from "@prisma/client"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Loader2, MapPin, ImageIcon, X } from "lucide-react"
import dynamic from 'next/dynamic'
import Image from "next/image"

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent
} from "@/components/ui/select"

// Dynamically import the Map component with SSR disabled
const MapComponent = dynamic(() => import('./EventMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-md border flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
})

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

interface Location {
  address: string
  lat: number
  lng: number
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const EventForm = (props: EventFormProps) => {
  const closeDialog = props.closeDialog
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [isInputDisabled, setIsInputDisabled] = useState(props.isEdit)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(props.eventObject?.location || null)
  const [imagePreview, setImagePreview] = useState<string | null>(props.eventObject?.imageUrl || null)
  const [isUploading, setIsUploading] = useState(false)

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

  const uploadImage = async (file: File): Promise<string> => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size must be less than 5MB")
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Image upload failed')
    }
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      setIsUploading(true)
      const url = await uploadImage(file)
      setImagePreview(url)
      form.setValue('imageUrl', url)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    form.setValue('imageUrl', '')
  }

  const extractDateAndTime = (
    dateTime: Date | undefined
  ): { date: string, time: string } => {
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
      payment: props.eventObject?.payment || 0,
      paymentBasis: props.eventObject?.paymentBasis || PaymentBasis.PER_DAY,
      imageUrl: props.eventObject?.imageUrl || "",
      date,
      time,
      location: props.eventObject?.location || {
        address: "",
        lat: 0,
        lng: 0
      }
    }
  })

  const onSubmit = async (values: z.infer<typeof EventSchema>) => {
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

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location)
    form.setValue('location', location)
  }

  return (
    <CardWrapper
      headerText={props.headerText || "Create Event"}
      headerLabel={props.headerLabel || "Enter the event details!"}
      className={cn("-my-4 w-full max-sm:w-[94dvw] max-sm:mb-4 mx-auto", props.className)}
      headerClassName={props.headerClassName}
    >
      <div className="max-h-[80vh] overflow-y-auto scrollbar-hide">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mx-4"
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
                <div className="flex flex-col gap-3 lg:flex-row lg:gap-12">
                  <FormField
                    control={form.control}
                    name="payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter Payment here"
                            type="number"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            disabled={isPending || isInputDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentBasis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Basis</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isPending || isInputDisabled}
                          >
                            <SelectTrigger isHiddenIcon={organization.role === UserRole.USER}>
                              <SelectValue placeholder="Select payment basis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={PaymentBasis.PER_HOUR}>Per Hour</SelectItem>
                              <SelectItem value={PaymentBasis.PER_DAY}>Per Day</SelectItem>
                              <SelectItem value={PaymentBasis.PER_WEEK}>Per Week</SelectItem>
                              <SelectItem value={PaymentBasis.PER_MONTH}>Per Month</SelectItem>
                              <SelectItem value={PaymentBasis.PER_YEAR}>Per Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!props.isEdit && (
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isPending || isInputDisabled || isUploading}
                                className="hidden"
                                id="image-upload"
                              />
                              <label
                                htmlFor="image-upload"
                                className={cn(
                                  "flex text-sm items-center gap-2 px-4 py-2 rounded-md border cursor-pointer hover:bg-secondary transition-colors",
                                  (isPending || isInputDisabled || isUploading) && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                <ImageIcon className="h-4 w-4" />
                                {isUploading ? "Uploading..." : "Upload Image"}
                              </label>
                              {imagePreview && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={removeImage}
                                  disabled={isPending || isInputDisabled || isUploading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {imagePreview && (
                              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src={imagePreview}
                                  alt="Event preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <Input
                              type="hidden"
                              {...field}
                            />
                          </div>
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
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Location</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <MapComponent
                            selectedLocation={selectedLocation}
                            onLocationSelect={handleLocationSelect}
                            disabled={isPending || isInputDisabled}
                          />
                          {selectedLocation && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{selectedLocation.address}</span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <div className="flex flex-col gap-4 w-full">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isUploading}
                    >
                      {
                        isUploading ? "Uploading..." :
                          props.isUpdate && !isPending ? "Update" :
                            isPending ? <Loader2 className="h-4 animate-spin" /> :
                              "Create"
                      }
                    </Button>
                    <Button
                      type="button"
                      className="w-full"
                      variant="outline"
                      onClick={closeDialog}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </RoleGate>
            </div>
          </form>
        </Form>
      </div>
    </CardWrapper>
  )
}
