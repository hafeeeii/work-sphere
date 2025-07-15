'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export default function FilterSection() {
  const currentYear = new Date().getFullYear()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(currentYear, 0, 1),
    to: new Date(currentYear, 11, 31)
  })
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn('h-10 w-full justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'PPP')} - {format(dateRange.to, 'PPP')}
              </>
            ) : (
              format(dateRange.from, 'PPP')
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Calendar
          mode='range'
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          className='rounded-lg border shadow-sm'
        />
      </PopoverContent>
    </Popover>
  )
}
