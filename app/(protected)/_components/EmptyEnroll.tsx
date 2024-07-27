import Image from "next/image"

export const EmptyEnroll = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Image
        src="/assets/EnrollState.svg"
        alt="No events"
        height={240}
        width={240}
      />
      <h2 className="text-3xl font-bold">No Enrolled Events</h2>
      <p className="mt-2 text-lg text-muted-foreground">Start by enrolling in an event</p>
    </div>
  )
}
