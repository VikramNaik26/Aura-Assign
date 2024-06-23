import { Suspense } from "react"

import { AuthHeader } from "@/app/(auth)/_components/AuthHeader"
import { Bounded } from "@/components/Bounded"
import { LoginForm } from "@/components/auth/LoginForm"

const OrgLoginPage = () => {
  return (
    <main className="flex h-full">
      <section className="flex-1 bg-blue-50">
        TODO: add image
      </section>
      <Bounded
        center
        className="flex-grow my-auto h-full"
        childClassName="h-full"
      >
        <AuthHeader isOrg isLogin />
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm isOrg />
        </Suspense>
      </Bounded>
    </main>
  )
}

export default OrgLoginPage
