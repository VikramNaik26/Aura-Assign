"use client"

import { useSearchParams } from "next/navigation"

import { CardWrapper } from "@/components/auth/CardWrapper"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/new-verification"
import { FormSuccess } from "@/components/FormSuccess"
import { FormError } from "@/components/FormError"

let onlyOneRender = false

export const NewVerificationForm = () => {
  const [success, setSuccess] = useState<string | undefined>("")
  const [error, setError] = useState<string | undefined>("")

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError("Missing token")
      return
    }

    newVerification(token)
      .then(data => {
        setSuccess(data?.success)
        setError(data?.error)
      })
      .catch(() => {
        setError("Something went wrong")
      })
  }, [token, success, error])

  useEffect(() => {
    if (!onlyOneRender) {
      onSubmit()
      onlyOneRender = true
    }
  }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !! !error && "Verifying your email. Please wait..."}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={error} />
        )}
      </div>
    </CardWrapper>
  )
}
