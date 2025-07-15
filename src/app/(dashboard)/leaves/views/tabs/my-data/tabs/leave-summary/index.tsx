import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight, CalendarIcon } from 'lucide-react'
import FilterSection from './filter-section'
import prisma from '@/lib/prisma'
import { getBusinessInfo } from '@/lib/business'
import { redirect } from 'next/navigation'



const upcomingLeaves = [
  {
    from: '14-Jul-2025, Mon',
    to: '15-Jul-2025, Tue',
    type: 'Casual Leave',
    days: 2,
    color: 'bg-blue-500'
  }
]

const pastLeaves = [
  {
    date: '08-Jul-2025, Tue',
    type: 'Leave Without Pay',
    days: 1,
    color: 'bg-red-500'
  },
  {
    date: '01-Jul-2025, Tue',
    type: 'Leave Without Pay',
    days: 1,
    color: 'bg-red-500'
  }
]

export default async function LeaveSummaryTab({searchParams}:{searchParams:{[key:string]:string}}) {
    // const currentYear = new Date().getFullYear()
    // const from = searchParams.from || `${currentYear}-01-01`
    // const to =  searchParams.to ||`${currentYear}-12-31`
    console.log(searchParams)

    const business = await getBusinessInfo()

    if (!business.status || !business.data ) {
      redirect('/login')
    }

    const leaveBalances = await prisma.leaveBalance.findMany({
      where: {
        tenantId: business.data.businessId
      },
      include:{
        leaveType:{
          select: {
            name: true
          }
        }
      }
    })

    const limitedLeaves = leaveBalances.slice(0,6)

  return (
    <div className='space-y-6 '>
      <div className='flex justify-end items-center gap-2'>
        <div className='grid w-1/3 '>
        <FilterSection/>
        </div>

        <Button>Apply Leave</Button>
      </div>
      {/* Leave Types */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
        {limitedLeaves.map(type => (
          <Card key={type.id}>
            <CardContent className='space-y-2 p-4'>
              {/* <div className={cn('text-3xl', type.color)}>{type.icon}</div> */}
              <div className='text-sm font-medium text-gray-500'>{type.leaveType?.name}</div>
              {type.available !== null && (
                <div className='text-sm'>
                  Available <span className='font-semibold text-green-600'>{type.available}</span>
                </div>
              )}
              <div className='text-sm'>
                Booked <span className='font-semibold text-red-600'>{type.booked}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Leave */}
      <Card>
        <CardContent>
          <h3 className='text-lg font-semibold'>Upcoming Leaves & Holidays</h3>
          {upcomingLeaves.map((leave, i) => (
            <div key={i} className='flex items-center gap-4 bg-muted pt-3'>
              <div className='flex items-center gap-1 text-sm text-gray-600'>
                <CalendarIcon size={16} className='text-gray-500' />
                {leave.from} <ArrowRight size={16} /> {leave.to}
              </div>
              <Badge className={cn(leave.color, 'text-white')}>{leave.type}</Badge>
              <span className='text-xs text-muted-foreground'>{leave.days} days</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Leaves */}
      <Card>
        <CardContent>
          <h3 className='text-lg font-semibold'>Past Leaves & Holidays</h3>
          {pastLeaves.map((leave, i) => (
            <div key={i} className='flex items-center gap-4 bg-muted pt-3'>
              <div className='flex items-center gap-1 text-sm text-gray-600'>
                <CalendarIcon size={16} className='text-gray-500' />
                {leave.date}
              </div>
              <Badge className={cn(leave.color, 'text-white')}>{leave.type}</Badge>
              <span className='text-xs text-muted-foreground'>{leave.days} day</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
