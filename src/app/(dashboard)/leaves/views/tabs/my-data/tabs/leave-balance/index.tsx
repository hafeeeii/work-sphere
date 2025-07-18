import { Card, CardContent } from '@/components/ui/card'
import { getBusinessInfo } from '@/lib/business'
import { getOrCreateLeaveBalanceForUser } from '@/lib/leave'
import prisma from '@/lib/prisma'
import { LeaveType } from '@prisma/client'
import { redirect } from 'next/navigation'
import LeaveApplyForm from '../leave-summary/leave-apply-form'

export default async function LeaveBalanceTab() {
  const business = await getBusinessInfo()
  if (!business.status || !business.data) {
    redirect('/login')
  }

  const { businessId, userId } = business.data

  const leaveBalances = await getOrCreateLeaveBalanceForUser(businessId, userId, new Date().getFullYear())

  // leave types
  const leaveTypes = await prisma.leaveType.findMany({
    where: {
      tenantId: business.data.businessId
    }
  })

  const updatedLeaveTypes = leaveTypes.reduce((acc, type) => {
    const balance = leaveBalances.find(b => b.leaveTypeId === type.id)
    if (!(balance?.available === 0 && balance.available !== null)) {
      acc.push(type)
    }
    return acc
  }, [] as Array<LeaveType>)

  return (
    <div className='space-y-2 p-6'>
      {leaveBalances.map((value, idx) => (
        <Card key={idx} className='shadow-sm'>
          <CardContent className='flex items-center justify-between p-4'>
            <div className='flex items-center gap-4 w-3/4'>
              {/* <div className={cn("w-10 h-10 rounded-full flex items-center justify-center")}>
              </div> */}
              <div className='w-1/2'>
                <div className='text-sm font-semibold'>{value.leaveType?.name}</div>
              </div>
            <div className='space-y-1 text-sm'>
              {value.available !== null && (
                <div>
                  <span className='text-muted-foreground'>Available </span>
                  <span className='font-semibold text-green-400'>
                    {value.available} {value.available === 1 ? 'day' : 'days'}
                  </span>
                </div>
              )}
              <div>
                <span className='text-muted-foreground'>Booked </span>
                <span className='font-semibold text-red-400'>
                  {value.booked} {value.booked === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
            </div>
            <LeaveApplyForm leaveTypes={updatedLeaveTypes} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
