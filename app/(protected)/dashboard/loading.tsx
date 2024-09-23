"use client"

import { Navbar } from "../_components/Navbar"
import { EventCard } from "../_components/EventCard"

const loading = () => {
  return (
    <section className="px-4 py-6 h-full">
      <Navbar.Skeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
        <EventCard.Skeleton />
        <EventCard.Skeleton />
        <EventCard.Skeleton />
        <EventCard.Skeleton />
      </div >
    </section>
  )
}

export default loading
