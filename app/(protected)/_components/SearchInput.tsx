'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  ChangeEvent,
  useState,
  useEffect,
} from 'react'
import qs from 'query-string'
import { useDebounceValue } from 'usehooks-ts'
import { UserRole } from '@prisma/client'

import { Input } from '@/components/ui/input'
import { NavbarProps } from './Navbar'
import { getEventByNameAndOrg } from '@/actions/event'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { Skeleton } from '@/components/ui/skeleton'

export const SearchInput = (props: NavbarProps) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [debounceValue] = useDebounceValue(value, 500)

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
    <div className='w-screen sm:w-full relative'>
      <Search className='absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
      <Input
        className='w-screen sm:w-full max-w-[516px] pl-9'
        placeholder='Search events'
        onChange={handleChange}
        value={value}
      />
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
