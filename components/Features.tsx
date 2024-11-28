import { Users, Calendar, MonitorSmartphone, LocateIcon } from 'lucide-react'

const features = [
  {
    icon: <LocateIcon className="h-6 w-6" />,
    title: 'Location-Based Jobs',
    description: 'Suggests opportunities based on the user’s geographic location.'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Community Connections',
    description: 'Connect with a vibrant community of side hustlers and organizations.'
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Flexible Scheduling',
    description: 'Choose gigs that fit your schedule and lifestyle.'
  },
  {
    icon: <MonitorSmartphone className="h-6 w-6" />,
    title: 'Cross-Platform Access',
    description: 'Accessible via web, desktop, Android, and iOS platforms.'
  }
]

export default function Features() {
  return (
    <section className="py-20" id='features'>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
