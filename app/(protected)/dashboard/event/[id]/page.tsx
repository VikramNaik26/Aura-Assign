import { getEventById } from "@/data/event"

const Event = async ({ params }: { params: { id: string } }) => {
  const event = await getEventById(params.id)
  return (
    <div>{JSON.stringify(event, null, 2)}</div>
  )
}

export default Event
