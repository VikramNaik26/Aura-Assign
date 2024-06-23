import { Suspense } from "react"

import { NewPasswordForm } from "@/components/auth/NewPasswordForm"

const NewPassword = () => {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <NewPasswordForm />
      </Suspense>
    </main>
  )
}

export default NewPassword
