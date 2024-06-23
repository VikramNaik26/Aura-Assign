import LoginButton from "@/components/auth/LoginButton"

interface AuthHeaderProps {
  isOrg?: boolean
}
export const AuthHeader = ({
  isOrg = false,
}: AuthHeaderProps) => {
  return (
    <div className="self-start flex justify-around items-center w-full">
      <h2 className="">Aura Assign</h2>
      <LoginButton
        isLink
        loginHref={isOrg ? "/user/register" : "/org/register"}
      >
        {isOrg ? "User registration" : "Organization registration"}
      </LoginButton>
    </div>
  )
}
