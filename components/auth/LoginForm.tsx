import { CardWrapper } from "@/components/auth/CardWrapper"

export const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel="Create a new account"
      backButtonLabel="Have an account?"
      backButtonHref="/user/login"
      showSocial
    >
      Login Form!
    </CardWrapper>
  )
}
