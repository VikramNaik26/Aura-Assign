'use client'

import {
  Search,
  ShoppingBasketIcon as Basketball,
  Music,
  Paintbrush,
  Utensils,
  ArrowUpDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  ChangeEvent,
  useState,
  useEffect,
} from 'react'
import qs from 'query-string'
import { useDebounceValue, useWindowSize } from 'usehooks-ts'
import { UserRole } from '@prisma/client'
import { format } from 'date-fns'

import { Input } from '@/components/ui/input'
import { NavbarProps } from './Navbar'
import { getEventByNameAndOrg } from '@/actions/event'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"
import { SortOption } from '../dashboard/page'
import FilterForm from './FilterForm'

export const SearchInput = (props: NavbarProps) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [debounceValue] = useDebounceValue(value, 500)

  const { width } = useWindowSize()

  const { role } = useCurrentRole()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = role === UserRole.USER
        ? await getEventByNameAndOrg(debounceValue)
        : await getEventByNameAndOrg(debounceValue, props.orgId)
      const url = qs.stringifyUrl({
        url: '/dashboard',
        query: {
          search: debounceValue
        },
      }, { skipNull: true, skipEmptyString: true })

      if ('error' in data) {
        console.error(data.error)
      } else {
        const updatedArray = data.map(obj => {
          const { orgId, ...rest } = obj
          return rest
        })

        router.push(url)

        props.setHasSearchQuery(true)
        props.setEvents(updatedArray.length ? updatedArray : [])
      }
    }

    if (debounceValue && props.orgId) {
      fetchData()
    } else if (!debounceValue) {
      props.setHasSearchQuery(false)
      const url = qs.stringifyUrl({
        url: '/dashboard',
        query: {}
      })
      router.push(url)

      props.setEvents(props.events)
    }
  }, [debounceValue, router])

  return (
    <div className='w-full relative pl-10 lg:pl-0 flex gap-4 items-center'>
      <Search className='absolute top-1/2 left-12 lg:left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
      <Input
        className='w-full max-w-[516px] pl-9'
        placeholder='Search events'
        onChange={handleChange}
        value={value}
      />

      {/* Sort Options */}
      <Select value={props.sortBy} onValueChange={(value) => {
        props.setSortBy(value as SortOption)
      }}>
        <SelectTrigger className="w-auto" isHiddenIcon={width < 1280 ? true : false}>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className='hidden xl:inline'>Sort By</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort Options</SelectLabel>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
            <SelectItem value="date-desc">Date (Newest)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <FilterForm filteredEvents={props.filteredEvents} setFilteredEvents={props.setFilteredEvents} />
    </div>
  )
}

SearchInput.Skeleton = function SearchInputSkeleton() {
  return (
    <div className='w-full relative'>
      <Search className='absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
      <Skeleton className='w-full sm:w-[400px] md:w-[460px] lg:w-[516px] h-10 pl-9' />
    </div>
  )
}
