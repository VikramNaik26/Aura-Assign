'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import { MoveRight } from 'lucide-react'

import usePrefersReducedMotion from '@/hooks/usePreferedReduceMotion'
import SignupButton from '@/components/auth/SignupButton'

const AnimatedContent = () => {
  const container = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  gsap.registerPlugin(useGSAP)

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        gsap.set(
          '.hero__heading, .hero__body, .hero__button, .hero__image, .hero__glow',
          { opacity: 1 },
        )
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      tl.fromTo(
        '.hero__heading',
        { scale: 0.5 },
        { scale: 1, opacity: 1, duration: 1.4 },
      )
      tl.fromTo(
        '.hero__body',
        { y: 20 },
        { y: 0, opacity: 1, duration: 1.2 },
        '-=0.6',
      )

      tl.fromTo(
        '.hero__button',
        { scale: 1.5 },
        { scale: 1, opacity: 1, duration: 1.3 },
        '-=0.8',
      )
      tl.fromTo(
        '.hero__image',
        { y: 100 },
        { y: 0, opacity: 1, duration: 1.3 },
        '+=0.3',
      )
      tl.fromTo(
        '.hero__glow',
        { scale: 0.5 },
        { scale: 1, opacity: 1, duration: 1.8 },
        '-=1',
      )
    },
    { scope: container },
  )

  return (
    <div className="relative h-full" ref={container}>
      <h1 className="hero__heading text-balanced text-4xl font-medium opacity-0 md:text-5xl text-white">
        Aura Assign
        <br />
        <span className='text-3xl md:text-4xl'>
          The Premier Platform for Vibrant Side Hustles
        </span>
      </h1>
      <div className="hero__body mx-auto mt-6 max-w-md text-balance text-slate-300 opacity-0">
        A web application designed to seamlessly connect individuals seeking occasional work opportunities with organizations in need of temporary human resources.
      </div>
      <SignupButton
        className="hero__button mt-8 opacity-0 text-xs"
      >
        Get Started for free
        <MoveRight size="16" className='ml-2' />
      </SignupButton>
      <div className="hero__image glass-container mt-16 w-fit mx-auto opacity-0">
        <div className="hero__glow absolute -inset-10 -z-10 bg-blue-500/30 opacity-0 blur-2xl filter" />
        <Image
          src="/assets/heroDesktop.svg"
          alt="Empty"
          height={1000}
          width={1000}
        />
      </div>
    </div>
  )
}
export default AnimatedContent

