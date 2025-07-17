'use client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

export default function YearPicker() {

  const currentYear = new Date().getFullYear() 
  const router = useRouter()
  const searchParams = new URLSearchParams(window.location.search)
  const from = searchParams.get('from')
  const defaultYear = (from ? new Date(from).getFullYear() : currentYear).toString()

  const years = Array.from({length: currentYear  - 2022}, (_,i) => (currentYear + 1) - i )

  const handleClick = (year: string) => {
    const searchParams = new URLSearchParams()
    const from = `${year}-01-01`
    const to = `${year}-12-31`
    searchParams.set('from', from)
    searchParams.set('to', to)
    router.push(`/leaves?${searchParams.toString()}`) 
  }

  return (
    <Select defaultValue={defaultYear} onValueChange={handleClick}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a year" />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup >
          {years.map((year) => {
            return (
              <SelectItem key={year} value={year.toString()} >
                {year}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
