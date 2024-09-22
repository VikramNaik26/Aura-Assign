import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('../../_components/Map'), {
  ssr: false,
})

const Map = () => {
  return (
    <section>
      <MapWithNoSSR />
    </section>
  )
}

export default Map
