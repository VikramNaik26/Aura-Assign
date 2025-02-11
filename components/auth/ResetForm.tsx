"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { ResetSchema } from "@/schemas"
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
import { FormSuccess } from "@/components/FormSuccess"
import { reset } from "@/actions/reset"

interface ResetFormProps {
  isOrg?: boolean
}

export const ResetForm = ({ isOrg = false }: ResetFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    }
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      reset(values)
        .then(data => {
          setError(data?.error)
          setSuccess(data?.success)
        })
    })
  }

  return (
    <CardWrapper
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref={isOrg ? "/org/login" : "/user/login"}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
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
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button
            type="submit"
            className="w-full"
          >
            Sent reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
