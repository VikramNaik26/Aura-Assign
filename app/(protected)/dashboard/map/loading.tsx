import { Loader2 } from "lucide-react"

const loading = () => {
  return (
    <section className="px-4 py-6 h-full flex justify-center items-center w-full">
      <Loader2 className="w-6 h-6 animate-spin" />
    </section>
  )
}

export default loading
