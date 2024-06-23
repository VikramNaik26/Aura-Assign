import { auth, signOut } from "@/auth"

const Dashboard = async () => {
  const session = await auth()

  return (
    <div>
      {JSON.stringify(session)}
      <form action={async () => {
        "use server"

        await signOut()
      }}>
        <button type="submit">
          sign out
        </button>
      </form>
    </div>
  )
}

export default Dashboard
