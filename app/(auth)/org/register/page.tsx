import { AuthHeader } from "@/app/(auth)/_components/AuthHeader"
import { Bounded } from "@/components/Bounded"
import { RegisterForm } from "@/components/auth/RegisterForm"

const OrgSignupPage = () => {
  return (
    <main className="flex h-full">
      <Bounded
        center
        className="flex-grow my-auto h-full"
        childClassName="h-full"
      >
        <AuthHeader isOrg/>
        <RegisterForm isOrg/>
      </Bounded>
      <section className="flex-1 bg-blue-50">
        TODO: add image
      </section>
    </main>
  )
}

export default OrgSignupPage
