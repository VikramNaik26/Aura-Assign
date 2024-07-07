import Image from "next/image";

import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { BackButton } from "@/components/auth/BackButton";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: {
    id: string,
    name: string,
    description?: string | null,
    imageUrl?: string | null,
    date: Date,
    time: Date,
  } | null
}

export const EventCard = ({
  event
}: EventCardProps) => {
  return (
    <Card className="sm:max-w-[300px] max-sm:w-[100%] flex flex-col justify-between">
      <CardContent className="w-full max-w-[280px] max-h-[200px]">
        <Image
          src="/assets/nextTask.svg"
          alt="Event"
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="text-lg">{event?.name}</CardTitle>
        <CardDescription>{event?.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between px-2">
        <div className="flex">
          <Button size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <BackButton
          href="/event"
          label="More details"
          className="w-min text-gray-600"
        />
      </CardFooter>
    </Card>
  )
}
