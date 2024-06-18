import LoginButton from "@/components/auth/LoginButton"

export const AuthHeader = () => {
  return (
    <div className="self-start flex justify-around items-center w-full">
      <h2 className="">Aura Assign</h2>
      <LoginButton
        isLink
        loginHref="/org/login"
      >
        Organization login
      </LoginButton>
    </div>
  )
}
