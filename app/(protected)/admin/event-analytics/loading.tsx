
import { Skeleton } from "@/components/ui/skeleton";

export default function CombinedAnalyticsSkeleton() {
  return (
    <div className="space-y-6 p-8">
      {/* Header Section */}
      <div>
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-6 w-2/3" />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border p-4 shadow-sm flex flex-col space-y-2"
          >
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Combined Growth Chart */}
        <div className="rounded-lg border p-4 shadow-sm space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-48 w-full" />
        </div>

        {/* User and Organization Roles Distribution Chart */}
        <div className="rounded-lg border p-4 shadow-sm space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

