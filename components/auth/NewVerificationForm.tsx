"use client"

import { useSearchParams } from "next/navigation"

import { CardWrapper } from "@/components/auth/CardWrapper"
import { useCallback, useEffect, useState } from "react"
import { newOrgVerification, newVerification } from "@/actions/new-verification"
import { FormSuccess } from "@/components/FormSuccess"
import { FormError } from "@/components/FormError"

let onlyOneRender = false

interface NewVerificationFormProps {
  isOrg?: boolean
}

export const NewVerificationForm = ({
  isOrg = false
}: NewVerificationFormProps) => {
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

    if (isOrg) {
      newOrgVerification(token)
        .then(data => {
          setSuccess(data?.success)
          setError(data?.error)
        })
        .catch(() => {
          setError("Something went wrong")
        })
    } else {
      newVerification(token)
        .then(data => {
          setSuccess(data?.success)
          setError(data?.error)
        })
        .catch(() => {
          setError("Something went wrong")
        })
    }
  }, [token, success, error, isOrg])

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
      backButtonHref={isOrg ? "/org/login" : "/user/login"}
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
