import Image from 'next/image'

const contributors = [
  { name: 'Vikram Balachadra Naik', role: 'Team Lead', image: '/vikramProfile.jpg' },
  { name: 'Pavan Shettigar', role: 'Team Member', image: '/pavanProfile.jpg' },
  { name: 'Rahil Yusuf Abubakkar', role: 'Team Member', image: '/rahilProfile.jpg' },
  { name: 'Pranush R Shetty', role: 'Team Member', image: '/pranushProfile.jpg' }
]

export default function Contributors() {
  return (
    <section className="py-10" id='team'>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contributors.map((contributor, index) => (
            <div key={index} className="text-center">
              <Image
                src={contributor.image}
                alt={contributor.name}
                width={100}
                height={100}
                className="rounded-full mx-auto mb-4 object-cover max-h-[100px]"
              />
              <h3 className="text-xl font-semibold text-white mb-1">{contributor.name}</h3>
              <p className="text-gray-400">{contributor.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
