import React from 'react'

import AnimatedContent from './_components/AnimatedContent'
import { Bounded } from '@/components/Bounded'

const Home = () => {
  return (
    <main className="bg-[#070815] min-h-[120dvh]">
      <Bounded
        className='px-4 py-14 first:pt-10 md:px-6 md:py-20 lg:py-24 text-center h-full'
        childClassName='px-4 py-14 first:pt-10 md:px-6 md:py-20 lg:py-24'
      >
        <AnimatedContent />
      </Bounded>
    </main>
  )
}

export default Home
