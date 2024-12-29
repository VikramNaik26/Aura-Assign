import React, { Dispatch, SetStateAction, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useWindowSize } from 'usehooks-ts';
import { FilterOptions } from '../dashboard/page';
import { getFilteredEvents } from '@/actions/event';

interface FilterFormProps {
  filteredEvents: FilterOptions
  setFilteredEvents: Dispatch<SetStateAction<FilterOptions>>
}

export interface FilterParams {
  date: 'today' | 'tomorrow' | 'week' | 'custom';
  customDate?: string;
  priceRange: [number, number];
}

const FilterForm = ({
  filteredEvents,
  setFilteredEvents
}: FilterFormProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { width } = useWindowSize();

  const [formData, setFormData] = useState<FilterParams>({
    // category: 'sports',
    date: 'tomorrow',
    priceRange: [0, 2000],
    customDate: ''
  });

  const handleReset = () => {
    setFormData({
      // category: 'sports',
      date: 'tomorrow',
      priceRange: [0, 2000],
      customDate: ''
    });
    setFilteredEvents({
      filterApplied: false,
      events: [],
    })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const events = await getFilteredEvents({
      date: formData.date,
      priceRange: formData.priceRange,
      customDate: formData.date === 'custom' ? formData.customDate : formData.date
    })

    setFilteredEvents({
      filterApplied: true,
      events: events,
    })

    setIsSheetOpen(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      customDate: e.target.value,
      date: 'custom'
    }));
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger className="flex items-center">
        <SlidersHorizontal className="h-4 w-4 lg:mr-2" />
        <span className="hidden lg:inline">Filters</span>
      </SheetTrigger>

      <SheetContent side={width > 768 ? 'right' : 'bottom'} className="z-[9990]">
        <SheetHeader className="mb-4 space-y-0">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Customize your search
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className={width < 768 ? 'pb-20' : 'pb-auto'}>
          <div className="space-y-4 mb-6">
            <span className="font-medium text-left">Time & Date</span>
            <input
              type="date"
              value={formData.customDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
              {['today', 'tomorrow', 'week'].map((date) => (
                <Button
                  key={date}
                  type="button"
                  variant={formData.date === date ? "default" : "outline"}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      date: date as typeof formData.date,
                      customDate: date === 'custom' ? formData.customDate : ''
                    }));
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
                ₹{formData.priceRange[0]}-₹{formData.priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 2000]}
              max={5000}
              min={0}
              step={100}
              value={formData.priceRange}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                priceRange: value as [number, number]
              }))}
              className="py-4"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              RESET
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              APPLY
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default FilterForm;
