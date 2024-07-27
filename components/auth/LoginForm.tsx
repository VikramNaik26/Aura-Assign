"use client"

import Link from "next/link"
import * as z from "zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { LoginSchema } from "@/schemas"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/FormError"
import { FormSuccess } from "@/components/FormSuccess"
import { login, orgLogin } from "@/actions/login"

interface LoginFormProps {
  isOrg?: boolean
}

export const LoginForm = ({
  isOrg = false,
}: LoginFormProps) => {
  const searchParams = useSearchParams()
  const urlError = (
    searchParams?.get("error") === "OAuthAccountNotLinked"
  )
    ? "Email already in use with different provider!"
    : ""

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      if (isOrg) {
        orgLogin(values)
          .then(data => {
            if (data?.error) {
              form.reset()
              setError(data?.error)
            }

            if (data?.success) {
              form.reset()
              setSuccess(data?.success)
            }

            if (!data?.error) {
              toast.success("Organization login successful")
            }
          })
          .then(() => {
            toast.success("Organzation successfully logged in")
          })
          .catch(() => {
            setError("Something went wrong")
          })
      } else {
        login(values)
          .then(data => {
            if (data?.error) {
              form.reset()
              setError(data?.error)
            }

            if (data?.success) {
              form.reset()
              setSuccess(data?.success)
            }

            if (data?.twoFactor) {
              setShowTwoFactor(true)
            }

            if (!data?.error) {
              toast.success("User login successful")
            }
          })
          .then(() => {
            toast.success("User successfully logged in")
          })
          .catch(() => {
            setError("Something went wrong")
          })
      }
    })
  }

  return (
    <CardWrapper
      headerText="Welcome back!"
      headerLabel="Enter your login credentials"
      backButtonLabel="Don't have an account?"
      backButtonHref={isOrg ? "/org/register" : "/user/register"}
      showSocial={isOrg ? false : true}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        disabled={isPending}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isOrg ? "Organizational Email" : "Email"}</FormLabel>
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
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href={isOrg ? "/org/reset" : "/user/reset"}>
                          Forgot password?
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormSuccess message={success} />
          <FormError message={error || urlError} />
          <Button
            type="submit"
            className="w-full"
          >
            {
              isPending ?
                "Processing..."
                : showTwoFactor
                  ? "Confirm"
                  : "Login"
            }
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

