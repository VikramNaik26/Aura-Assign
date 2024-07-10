import Image from "next/image"

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/assets/searchState.svg"
        alt="Empty"
        width={160}
        height={160}
      />
      <h2 className="text-2xl font-semibold mt-6">
        No results found
      </h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try searching for something else
      </p>
    </div>
  )
}
