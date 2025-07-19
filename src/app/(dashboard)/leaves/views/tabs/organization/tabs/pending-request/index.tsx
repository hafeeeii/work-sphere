import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getBusinessInfo } from '@/lib/business'
import { getDaysCount, getFormattedDate } from '@/lib/date'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import React from 'react'
import ActionButtons from './action-buttons'
import { Badge } from '@/components/ui/badge'
import { LeaveStatus } from '@prisma/client'

export default async function PendingRequestTab() {
  const business = await getBusinessInfo()
  if (!business.status || !business.data) {
    redirect('/login')
  }
  const { businessId } = business.data
  const leaveRequests = await prisma.leave.findMany({
    where: {
      tenantId: businessId,
      status: LeaveStatus.PENDING
    },
    include: {
      user: {
        select: {
          name: true
        }
      },
      leaveType: {
        select: {
          name: true
        }
      }
    }
  })
  return (
    <div className='space-y-4'>
      {leaveRequests.length > 0 ? (
        leaveRequests.map((val, idx) => (
          <div key={idx} className='flex items-center gap-4 rounded-lg border px-4 py-4 shadow-sm'>
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className='flex-1'>
              <div className='flex gap-2 mb-1'>
                <p className='text-base font-medium'>{val.user?.name}</p>
                <Badge variant={'outline'}>{val.leaveType?.name}</Badge>
              </div>

              <p className='text-sm text-muted-foreground'>Requested on {getFormattedDate(val.createdAt)}</p>
            </div>

            <div className='flex-1'>
              <p className='text-sm text-muted-foreground'>{`${getFormattedDate(val.from)} - ${getFormattedDate(val.to)} (${getDaysCount(val.from, val.to)} Days) `}</p>
            </div>

            <ActionButtons id={val.id} />
          </div>
        ))
      ) : (
        <div className='flex items-center justify-center h-full py-10'>
          <p className='text-sm text-muted-foreground'>No Pending Requests</p>
        </div>
      )}
    </div>
  )
}
