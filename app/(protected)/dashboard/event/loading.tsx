import { Skeleton } from '@/components/ui/skeleton'

const loading = () => {
  return (
    <section className="px-4 py-6 h-full">
      <div className="w-full mx-auto">
        <div className="inline-flex space-x-2 justify-center sm:justify-start w-full">
          <Skeleton className="h-10 w-32 sm:w-24" />
          <Skeleton className="h-10 w-32 sm:w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-6" >
        <div className="aspect-[186/65] sm:aspect-[100/127] rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="aspect-[186/65] sm:aspect-[100/127] rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="aspect-[186/65] sm:aspect-[100/127] rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="aspect-[186/65] sm:aspect-[100/127] rounded-lg overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      </div >
    </section>
  )
}

export default loading
