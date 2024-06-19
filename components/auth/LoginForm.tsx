import { CardWrapper } from "@/components/auth/CardWrapper"

export const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="create an account"
      backButtonHref="/user/register"
      showSocial
    >
      Login Form!
    </CardWrapper>
  )
}
