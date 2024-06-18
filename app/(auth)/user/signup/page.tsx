import Image from "next/image"

import { AuthHeader } from "@/app/(auth)/_components/AuthHeader"
import { Bounded } from "@/components/Bounded"
import { LoginForm } from "@/components/auth/LoginForm"

const UserSignupPage = () => {
  return (
    <main className="flex h-full">
      <Bounded
        center
        className="flex-1 my-auto h-full"
        childClassName="h-full"
      >
        <AuthHeader />
        <LoginForm />
      </Bounded>
      <section className="flex-1">
        <Image
          src="/test.jpg"
          alt="image"
          width={600}
          height={1800}
          className="w-full h-full"
        />
      </section>
    </main >
  )
}

export default UserSignupPage
