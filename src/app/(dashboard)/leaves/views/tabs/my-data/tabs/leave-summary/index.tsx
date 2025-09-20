import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import YearPicker from '@/components/ui/year-picker'
import { getBusinessInfo } from '@/lib/business'
import { getDaysCount } from '@/lib/date'
import { getOrCreateLeaveBalanceForUser } from '@/lib/leave'
import prisma from '@/lib/prisma'
import { LeaveStatus, LeaveType } from '@prisma/client'
import { format } from 'date-fns'
import { ArrowRight, CalendarIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import LeaveApplyForm from './leave-apply-form'

export default async function LeaveSummaryTab({ searchParams }: { searchParams: { [key: string]: string } }) {
  const currentYear = new Date().getFullYear()
  const from = searchParams.from || `${currentYear}-01-01`
  const to = searchParams.to || `${currentYear}-12-31`
  const year = new Date(from).getFullYear()
  const business = await getBusinessInfo()

  if (!business.status || !business.data) {
    redirect('/login')
  }

  const [leaveBalances, leaveTypes, pastLeaves, upcomingLeaves] = await Promise.all([
    // leave balances
    getOrCreateLeaveBalanceForUser(business.data.businessId, business.data.userId, year),
    // leave types
    prisma.leaveType.findMany({
      where: {
        tenantId: business.data.businessId
      }
    }),
    // past leaves
    prisma.leave.findMany({
      where: {
        tenantId: business.data.businessId,
        userId: business.data.userId,
        status: LeaveStatus.APPROVED,
        to: {
          lt: new Date(),
          gte: new Date(from)
        },
        from: {
          lte: new Date(to)
        }
      },
      include: {
        leaveType: {
          select: {
            name: true
          }
        }
      }
    }),
    // upcoming leaves
    await prisma.leave.findMany({
      where: {
        tenantId: business.data.businessId,
        userId: business.data.userId,
        status: LeaveStatus.APPROVED,
        from: {
          gte: new Date(),
          lte: new Date(to)
        },
        to: {
          gte: new Date(from),
          lte: new Date(to)
        }
      },
      include: {
        leaveType: {
          select: {
            name: true
          }
        }
      }
    })
  ])

  const limitedLeaves = leaveBalances.slice(0, 6)

  const updatedLeaveTypes = leaveTypes.reduce((acc, type) => {
    const balance = leaveBalances.find(b => b.leaveTypeId === type.id)
    if (!(balance?.available === 0 && balance.available !== null)) {
      acc.push(type)
    }
    return acc
  }, [] as Array<LeaveType>)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-end gap-2'>
        <YearPicker />
        <LeaveApplyForm leaveTypes={updatedLeaveTypes} />
      </div>
      {/* Leave Types */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
        {limitedLeaves.map((type, idx) => (
          <Card key={idx}>
            <CardContent className='space-y-2'>
              {/* <div className={cn('text-3xl', type.color)}>{type.icon}</div> */}
              <div className='text-sm font-semibold'>{type.leaveType?.name}</div>
              {type.available !== null && (
                <div className='text-sm'>
                  Available <span className='font-semibold text-green-400'>{type.available}</span>
                </div>
              )}
              <div className='text-sm'>
                Booked <span className='font-semibold text-red-400'>{type.booked}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Upcoming Leave */}
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold'>Upcoming Leaves & Holidays</h3>
        </CardHeader>
        <CardContent>
          {upcomingLeaves.length > 0 ? (
            upcomingLeaves.map((leave, i) => (
              <div key={i} className='mb-2 flex items-center gap-4'>
                <div className='flex min-w-[280px] items-center gap-1 text-sm'>
                  <CalendarIcon size={16} />
                  {format(new Date(leave.from), 'dd-MMM-yyyy, EEE')} <ArrowRight size={16} className='mx-4' />{' '}
                  {format(new Date(leave.to), 'dd-MMM-yyyy, EEE')}
                </div>
                <Badge>{leave.leaveType?.name}</Badge>
                <span className='text-xs'>
                  {' '}
                  {getDaysCount(leave.from, leave.to)} {getDaysCount(leave.from, leave.to) == 1 ? 'day' : 'days'}
                </span>
              </div>
            ))
          ) : (
            <div className='my-4 text-center text-sm text-gray-400'>No Upcoming Leaves</div>
          )}
        </CardContent>
      </Card>

      {/* Past Leaves */}
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold'>Past Leaves & Holidays</h3>
        </CardHeader>
        <CardContent className='h-full w-full overflow-x-auto'>
          {pastLeaves.length > 0 ? (
            pastLeaves.map((leave, i) => (
              <div key={i} className='mb-2 flex items-center gap-4'>
                <div className='flex min-w-[280px] items-center gap-1 text-sm'>
                  <CalendarIcon size={16} />
                  {format(new Date(leave.from), 'dd-MMM-yyyy, EEE')} <ArrowRight size={16} className='mx-4' />{' '}
                  {format(new Date(leave.to), 'dd-MMM-yyyy, EEE')}
                </div>
                <Badge className='text-nowrap'>{leave.leaveType?.name}</Badge>
                <span className='text-nowrap text-xs'>
                  {getDaysCount(leave.from, leave.to)} {getDaysCount(leave.from, leave.to) == 1 ? 'day' : 'days'}
                </span>
              </div>
            ))
          ) : (
            <div className='my-4 text-center text-sm text-gray-400'>No Past Leaves</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
