import React from 'react'

import AnimatedContent from './_components/AnimatedContent'
import { Bounded } from '@/components/Bounded'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

const Home = async () => {
  const session = await currentUser()

  if(session) {
    redirect("/dashboard")
  }

  return (
    <main className="bg-[#070815] min-h-[120dvh]">
      <Bounded
        className='px-4 first:pt-10 md:px-6 text-center h-full'
        childClassName='px-4 md:px-6'
      >
        <AnimatedContent />
      </Bounded>
    </main>
  )
}

export default Home
