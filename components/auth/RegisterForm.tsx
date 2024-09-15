"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { RegisterSchema } from "@/schemas"
import { register, registerOrg } from "@/actions/register"
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

interface RegisterFormProps {
  isOrg?: boolean
}

export const RegisterForm = ({
  isOrg = false,
}: RegisterFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      if (isOrg) {
        registerOrg(values)
          .then(data => {
            setError(data?.error)
            setSuccess(data?.success)
          })
      } else {
        register(values)
          .then(data => {
            setError(data?.error)
            setSuccess(data?.success)
          })
      }
    })
  }

  return (
    <CardWrapper
      headerLabel={isOrg ? "Create an organizational account" : "Create a new account"}
      backButtonLabel="Already have an account?"
      backButtonHref={isOrg ? "/org/login" : "/user/login"}
      showSocial={isOrg ? false : true}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isOrg ? "Organization Name" : "Full Name"}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={isOrg ? "Aura Assign" : "Vikram Naik"}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isOrg ? "Organization Email" : "Email"}</FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
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
            {
              isPending 
              ? (
              <Loader2 className="h-4 w-4 animate-spin" />
              )
                :"Register"
            }
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
