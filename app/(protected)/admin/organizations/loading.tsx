import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      {/* Header Section */}
      <div className="flex items-center justify-between space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Filter Input */}
      <Skeleton className="h-10 w-full max-w-md" />

      {/* Table Skeleton */}
      <div className="space-y-2">
        {/* Table Header */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-6" /> {/* Checkbox */}
          <Skeleton className="h-5 w-1/4" /> {/* Name */}
          <Skeleton className="h-5 w-1/4" /> {/* Email */}
          <Skeleton className="h-5 w-1/6" /> {/* Role */}
          <Skeleton className="h-5 w-1/6" /> {/* Created At */}
          <Skeleton className="h-5 w-6" /> {/* Actions */}
        </div>
        {/* Table Rows */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 py-2 border-b border-muted-foreground/20"
          >
            <Skeleton className="h-5 w-6" /> {/* Checkbox */}
            <Skeleton className="h-5 w-1/4" /> {/* Name */}
            <Skeleton className="h-5 w-1/4" /> {/* Email */}
            <Skeleton className="h-5 w-1/6" /> {/* Role */}
            <Skeleton className="h-5 w-1/6" /> {/* Created At */}
            <Skeleton className="h-5 w-6" /> {/* Actions */}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-8 w-32" /> {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" /> {/* Previous */}
          <Skeleton className="h-8 w-8" /> {/* Page */}
          <Skeleton className="h-8 w-8" /> {/* Next */}
        </div>
      </div>
    </div>
  );
}

