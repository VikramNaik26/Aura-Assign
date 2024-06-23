import { Suspense } from 'react'

import { NewVerificationForm } from '@/components/auth/NewVerificationForm'

const NewVerification = () => {
  return (
    <main className="w-full h-full flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <NewVerificationForm isOrg/>
      </Suspense>
    </main>
  )
}

export default NewVerification
