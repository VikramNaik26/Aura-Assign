"use client"

import { useQuery } from "@tanstack/react-query"

import { ExtendedUserWithProfile, getEnrollmentsForEvent } from "@/actions/enrollment"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OrgEvent } from "@/actions/event"
import { Skeleton } from "@/components/ui/skeleton"
import { truncateAddress } from "@/lib/utils"

interface UserTableProps {
  event: OrgEvent
}

export const UserTable = ({
  event
}: UserTableProps) => {

  const { data: enrolledUsers, error, isLoading } = useQuery<ExtendedUserWithProfile[]>({
    queryKey: ["enrolled-users", event?.id],
    queryFn: () => getEnrollmentsForEvent(event?.id),
    enabled: !!event,
    refetchInterval: 5000
  })

  if (isLoading) {
    return (
      <EnrolledUsersTableSkeleton />
    )
  }

  if (error) {
    return (
      <div className="w-full px-4 p-8">
        Something went wrong
      </div>
    )
  }

  if (!enrolledUsers?.length) {
    return (
      <div className="w-full px-4 p-8">
        No enrolled users
      </div>
    )
  }

  return (
    <CardWrapper
      headerText="Enrolled Users"
      headerLabel="List of users enrolled to this event"
      className="w-full"
      headerClassName="items-start ml-4 text-sm"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Users</TableHead>
            <TableHead className="hidden sm:table-cell">Gender</TableHead>
            <TableHead className="hidden sm:table-cell">Date of Birth</TableHead>
            <TableHead className="hidden md:table-cell">Phone number</TableHead>
            <TableHead className="hidden md:table-cell">Street address</TableHead>
            <TableHead className="hidden md:table-cell">City & State</TableHead>
            <TableHead className="hidden md:table-cell">Postal code</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrolledUsers?.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="font-medium">{user.name}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {user.email}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{user.gender}</TableCell>
              <TableCell className="hidden sm:table-cell">{user?.dateOfBirth?.toLocaleDateString() ?? "-"}</TableCell>
              <TableCell className="hidden md:table-cell">{user?.phoneNumber ?? "-"}</TableCell>
              <TableCell className="hidden md:table-cell">{truncateAddress(16, user?.streetAddress ?? "-")}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="font-medium">{user?.city ?? "-"}</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {user?.state ?? "-"}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{user?.postalCode ?? "-"}</TableCell>
              <TableCell className="text-right">
                <Badge className="text-xs" variant="secondary">
                  Accepted
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardWrapper>
  )
}

const TableSkeleton = () => (
  <div className="w-full rounded-lg overflow-hidden">
    {[...Array(2)].map((_, index) => (
      <div key={index} className="flex items-center justify-between px-4">
        <Skeleton className="h-16 w-1/4 mb-4" />
        <Skeleton className="h-16 w-1/6 mb-4 hidden sm:block" />
        <Skeleton className="h-16 w-1/6 mb-4 hidden sm:block" />
        <Skeleton className="h-16 w-1/6 mb-4 hidden md:block" />
        <Skeleton className="h-16 w-1/6 mb-4 hidden md:block" />
        <Skeleton className="h-16 w-1/6 mb-4 hidden md:block" />
        <Skeleton className="h-16 w-1/6 mb-4 hidden md:block" />
        <Skeleton className="h-16 w-12 mb-4 text-right" />
      </div>
    ))}
  </div>
)

const EnrolledUsersTableSkeleton = () => (
  <div className="w-full px-6 py-4">
    <Skeleton className="h-24 w-1/4 mb-8 px-4 ml-4" />
    <TableSkeleton />
  </div>
)

