import { Skeleton } from '@/components/ui/skeleton'
import { TabsSkeleton } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const loading = () => {
  return (
    <section className="px-4 py-6 h-full">
      <TabsSkeleton />
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
