import { AuthHeader } from "@/app/(auth)/_components/AuthHeader"
import { Bounded } from "@/components/Bounded"
import { RegisterForm } from "@/components/auth/RegisterForm"

const UserSignupPage = () => {
  return (
    <main className="flex h-full">
      <Bounded
        center
        className="flex-grow my-auto h-full"
        childClassName="h-full"
      >
        <AuthHeader />
        <RegisterForm />
      </Bounded>
      <section className="flex-1 bg-blue-50 hidden lg:block">
      </section>
    </main >
  )
}

export default UserSignupPage
