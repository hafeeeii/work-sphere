import { Card, CardContent } from '@/components/ui/card'
import { getBusinessInfo } from '@/lib/business'
import { getOrCreateLeaveBalanceForUser } from '@/lib/leave'
import prisma from '@/lib/prisma'
import { LeaveType } from '@prisma/client'
import LeaveApplyForm from '../leave-summary/leave-apply-form'

export default async function LeaveBalanceTab() {
  const business = await getBusinessInfo()
  if (!business.status || !business.data) {
    return null
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
    <div className='space-y-2 p-2'>
      {leaveBalances.map((value, idx) => (
        <Card key={idx} className='shadow-sm'>
          <CardContent className='flex flex-col items-center gap-2 px-4 py-2 sm:items-stretch sm:justify-between lg:flex-row lg:items-center'>
            <div className='flex flex-col items-center justify-between gap-4 text-nowrap sm:flex-row lg:w-3/4 lg:justify-start'>
              <div className='lg:w-1/2'>
                <div className='text-sm font-medium'>{value.leaveType?.name}</div>
              </div>
              <div className='space-y-1 text-center text-sm sm:text-start'>
                {value.available !== null && (
                  <div className='text-xs font-medium'>
                    <span className='text-muted-foreground'>Available : </span>
                    <span className='text-green-400'>
                      {value.available} {value.available === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                )}
                <div className='text-xs font-medium'>
                  <span className='text-muted-foreground'>Booked : </span>
                  <span className='text-red-400'>
                    {value.booked} {value.booked === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            </div>

            <div className='md:self-end lg:self-auto'>
              <LeaveApplyForm leaveTypes={updatedLeaveTypes} leaveTypeId={value.leaveTypeId} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
