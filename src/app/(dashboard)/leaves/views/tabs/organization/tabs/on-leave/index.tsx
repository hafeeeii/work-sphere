import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getBusinessInfo } from '@/lib/business'
import { getDaysCount, getFormattedDate } from '@/lib/date'
import prisma from '@/lib/prisma'
import { Leave, LeaveStatus } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function OnLeaveTab() {
  const business = await getBusinessInfo()

  if (!business.status || !business.data) {
    redirect('/login')
  }

  const year = new Date().getFullYear()
  const from = `${year}-01-01`
  const to = `${year}-12-31`

  const leaves = await prisma.leave.findMany({
    where: {
      tenantId: business.data.businessId,
      from: {
        gte: new Date(from)
      },
      to: {
        lte: new Date(to)
      },
      status: LeaveStatus.APPROVED
    },
    include: {
      leaveType: {
        select: {
          name: true
        }
      },
      user: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      from: 'desc'
    }
  })

  const groupByDate = leaves.reduce(
    (acc, leave) => {
      const dateKey = getFormattedDate(leave.from)
      if (!acc[dateKey]) {
        acc[dateKey] = [leave]
      } else {
        acc[dateKey].push(leave)
      }

      return acc
    },
    {} as Record<string, (Leave & { leaveType: { name: string }; user: { name: string } })[]>
  )

  const data = Object.entries(groupByDate)

  return (
  <div className='flex flex-col h-full '>
      <Accordion type='single' collapsible className='w-full'>
      {data.length > 0 ? (
        data.map(([date, leaves]) => (
          <AccordionItem value={date} key={date}>
            <AccordionTrigger className='flex items-center justify-between hover:no-underline'>
              <div>{date}</div>
              <div className='text-sm text-muted-foreground'>
                {leaves.length} {leaves.length === 1 ? 'leave' : 'leaves'}
              </div>
            </AccordionTrigger>
            <AccordionContent className='space-y-4 overflow-x-auto text-nowrap'>
              {leaves.map(leave => (
                <div key={leave.id} className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-4'>
                    <div>{leave.user.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {leave.leaveType.name} ({getFormattedDate(leave.from)} - {getFormattedDate(leave.to)})
                    </div>
                  </div>
                  <div>
                    <div className='text-sm'>
                      {getDaysCount(leave.from, leave.to)} {getDaysCount(leave.from, leave.to) === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <div>
          <p className='mt-20 text-center text-sm text-muted-foreground'>No leaves found</p>
        </div>
      )}
    </Accordion>
  </div>
  )
}
