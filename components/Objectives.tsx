'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Briefcase, Users, Brain, TrendingUp, Heart, Compass, Shield, Wifi, BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface ObjectiveProps {
  title: string
  description: string
  icon: React.ElementType
}

const objectives: ObjectiveProps[] = [
  {
    title: "Flexible Work",
    description: "Provide adaptable opportunities for diverse schedules",
    icon: Briefcase
  },
  {
    title: "Autonomy",
    description: "Promote independence in work choices",
    icon: Users
  },
  {
    title: "Skill Development",
    description: "Foster entrepreneurship and personal growth",
    icon: Brain
  },
  {
    title: "Scalable Labor",
    description: "Offer flexible workforce solutions for businesses",
    icon: TrendingUp
  },
  {
    title: "Work-Life Balance",
    description: "Improve harmony between career and personal life",
    icon: Heart
  },
  {
    title: "Job Variety",
    description: "Increase diversity in work opportunities",
    icon: Compass
  },
  {
    title: "Economic Resilience",
    description: "Support adaptability in changing markets",
    icon: Shield
  },
  {
    title: "Remote Work",
    description: "Encourage growth of digital and distant work options",
    icon: Wifi
  },
  {
    title: "Economic Efficiency",
    description: "Enhance overall economic productivity",
    icon: BarChart3
  }
]

const ObjectiveCard: React.FC<ObjectiveProps> = ({ title, description, icon: Icon }) => (
  <div className="objective-card flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <Icon className="w-8 h-8 mb-2 text-blue-400" />
    <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
    <p className="text-sm text-center text-gray-300">{description}</p>
  </div>
)

const Objectives: React.FC = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.objective-card')
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.1,
        }
      )
    })
  }, { scope: container })

  return (
    <section ref={container} className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((objective, index) => (
            <ObjectiveCard key={index} {...objective} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Objectives
