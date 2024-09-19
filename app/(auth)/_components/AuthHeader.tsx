import LoginButton from "@/components/auth/LoginButton"

interface AuthHeaderProps {
  isOrg?: boolean
  isLogin?: boolean
}

export const AuthHeader = ({
  isOrg = false,
  isLogin = false
}: AuthHeaderProps) => {
  return (
    <div className="self-start flex px-2 md:px-16 py-4 justify-between items-center w-full">
      <h2 className="">Aura Assign</h2>
      <LoginButton
        isLink
        loginHref={
          isOrg && isLogin
            ? "/user/login" : isLogin
              ? "/org/login" : isOrg
                ? "/user/register" : "/org/register"
        }
      >
        {
          isOrg && isLogin ?
            "User Login" : isLogin ?
              "Organization Login" : isOrg ?
                "User registration" : "Organization registration"
        }
      </LoginButton>
    </div>
  )
}
