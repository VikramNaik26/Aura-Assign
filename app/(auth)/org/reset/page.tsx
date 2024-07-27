import { Suspense } from "react"

import { ResetForm } from "@/components/auth/ResetForm"

const ResetPage = () => {
  return (
    <main className="h-full w-full flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetForm isOrg />
      </Suspense>
    </main>
  )
}

export default ResetPage
