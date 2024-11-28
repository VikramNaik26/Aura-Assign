"use client"

import { ChevronLeftIcon } from "lucide-react"

export const BackButtonInAppBar = () => {
  return (
    <div 
      className="flex gap-2 lg:hidden fixed sm:static top-4 left-4 bg-white/40 p-1 rounded"
      onClick={() => window.history.back()}
    >
      <ChevronLeftIcon className="h-6 w-6" />
      <span className="hidden sm:inline">Back</span>
      <span className="sr-only">go to previous page</span>
    </div>
  )
}

