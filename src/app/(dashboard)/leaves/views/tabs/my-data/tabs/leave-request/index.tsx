import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getBusinessInfo } from '@/lib/business'
import { getDaysCount, getFormattedDate } from '@/lib/date'
import { getOrCreateLeaveBalanceForUser } from '@/lib/leave'
import prisma from '@/lib/prisma'
import { cn } from '@/lib/utils'
import { LeaveStatus, LeaveType } from '@prisma/client'
import { redirect } from 'next/navigation'
import LeaveApplyForm from '../leave-summary/leave-apply-form'


export default async function LeaveRequestTab() {
  const business = await getBusinessInfo()

  if (!business.status || !business.data) {
    redirect('/login')
  }

  const year = new Date().getFullYear()

  // leave balances
  const leaveBalances = await getOrCreateLeaveBalanceForUser(business.data.businessId, business.data.userId, year)
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

  const leavesRequest = await prisma.leave.findMany({
    where: {
      tenantId: business.data.businessId,
      userId: business.data.userId,
      from: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    }
  })

  const getLeaveTypeName = (leaveTypeId: string) => {
    const leaveType = leaveTypes.find(type => type.id === leaveTypeId)
    return leaveType ? leaveType.name : 'N/A'
  }

  const getLeaveStatusClass = {
    [LeaveStatus.ACCEPTED]: 'bg-green-500',
    [LeaveStatus.DECLINED]: 'bg-red-500',
    [LeaveStatus.PENDING]: 'bg-yellow-500',
    [LeaveStatus.EXPIRED]: 'bg-gray-500'
  }

  return (
    <div className='flex flex-col items-end gap-6'>
      <LeaveApplyForm leaveTypes={updatedLeaveTypes} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Leave Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>No. of Days</TableHead>
            <TableHead>Date of Request</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leavesRequest.length > 0 ? (
            leavesRequest.map(leave => (
              <TableRow key={leave.id}>
                <TableCell>{getLeaveTypeName(leave.leaveTypeId)}</TableCell>
                <TableCell>
                  <Badge className={cn(getLeaveStatusClass[leave.status])}>{leave.status}</Badge>
                </TableCell>
                <TableCell>{getFormattedDate(leave.from)}</TableCell>
                <TableCell>{getFormattedDate(leave.to)}</TableCell>
                <TableCell>{getDaysCount(leave.from, leave.to)}</TableCell>
                <TableCell>{getFormattedDate(leave.createdAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center'>
                No leaves found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
