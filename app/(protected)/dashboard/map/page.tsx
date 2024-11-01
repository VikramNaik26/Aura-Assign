import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('../../_components/LeafletMap'), {
  ssr: false,
})

const Map = () => {
  return (
    <section className='h-[110dvh] md:h-full'>
      <MapWithNoSSR />
    </section>
  )
}

export default Map
