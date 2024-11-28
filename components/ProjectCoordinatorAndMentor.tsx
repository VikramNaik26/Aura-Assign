import Image from 'next/image'

const contributors = [
  { name: 'Prof. Sayeesh', role: 'Project Guide', image: '/sayeeshProfile.jpg' },
  { name: 'Dr. Lokesh M R', role: 'Project Coordinator', image: '/lokeshProfile.jpg' },
]

export default function ProjectCAM() {
  return (
    <section className="py-10 mx-auto">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Project Guide and Coordinator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-28 w-max justify-items-center items-center mx-auto">
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
