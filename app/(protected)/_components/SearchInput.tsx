'use client'

import { Search, SlidersHorizontal, ShoppingBasketIcon as Basketball, Music, Paintbrush, Utensils, ArrowUpDown } from 'lucide-react'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SortOption } from '../dashboard/page'

export const SearchInput = (props: NavbarProps) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [debounceValue] = useDebounceValue(value, 500)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { width } = useWindowSize()

  const { role } = useCurrentRole()

  const [selectedCategory, setSelectedCategory] = useState<string>('sports')
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'week' | 'custom'>('tomorrow')
  const [priceRange, setPriceRange] = useState([20, 120])
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined)

  const categories = [
    { id: 'sports', icon: Basketball, label: 'Sports' },
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'art', icon: Paintbrush, label: 'Art' },
    { id: 'food', icon: Utensils, label: 'Food' },
    { id: 'food2', icon: Utensils, label: 'Food' },
  ]

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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className='flex items-center'>
          <SlidersHorizontal className='h-4 w-4 lg:mr-2' />
          <span className='hidden lg:inline'>Filters</span>
        </SheetTrigger>
        <SheetContent side={width > 768 ? 'right' : 'bottom'} className='z-[9990]'>
          <SheetHeader className='mb-4 space-y-0'>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Customize your search
            </SheetDescription>
          </SheetHeader>
          <div className={width < 768 ? 'pb-20' : 'pb-auto'}>
            <div className="space-y-4 mb-6">
              <span className="font-medium text-left">Time & Date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {selectedDate === 'custom' && calendarDate
                      ? format(calendarDate, 'PPP')
                      : 'Choose from calendar'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-[9999]"
                  onClick={(e) => e.stopPropagation()}
                  align="start"
                  side="bottom"
                >
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={(date) => {
                      setCalendarDate(date)
                      setSelectedDate('custom')
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="flex gap-2">
                {['today', 'tomorrow', 'week'].map((date) => (
                  <Button
                    key={date}
                    variant={selectedDate === date ? "default" : "outline"}
                    onClick={() => {
                      setSelectedDate(date as typeof selectedDate)
                      setCalendarDate(undefined) // Clear calendar date when selecting preset
                    }}
                    className="flex-1"
                  >
                    {date.charAt(0).toUpperCase() + date.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mx-2">
              <div className="flex justify-between">
                <span className="font-medium">Select price range</span>
                <span className="text-blue-600 font-medium">
                  ${priceRange[0]}-${priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={[20, 120]}
                max={200}
                min={0}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedCategory('sports')
                  setSelectedDate('tomorrow')
                  setPriceRange([20, 120])
                  setCalendarDate(undefined)
                }}
              >
                RESET
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  console.log({
                    category: selectedCategory,
                    date: selectedDate === 'custom' ? calendarDate : selectedDate,
                    priceRange,
                  })
                  setIsSheetOpen(false)
                }}
              >
                APPLY
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
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
