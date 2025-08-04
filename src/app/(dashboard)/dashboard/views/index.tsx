import { StatsCard } from './stats-card'

import { checkPermission } from '@/lib/auth'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { LeaveStatus } from '@prisma/client'
import { Building, Clock, Mail, Users } from 'lucide-react'
import { redirect } from 'next/navigation'
import { ActivityFeed } from './activity-feed'
import { QuickActions } from './quick-action'

const Dashboard = async () => {
  const business = await getBusinessInfo()
  if (!business || !business.data) {
    return null
  }

  const tenantUser = await prisma.tenantUser.findUnique({
    where: {
      userId_tenantId: {
        tenantId: business.data.businessId,
        userId: business.data.userId
      }
    },
    include: {
      user: true
    }
  })

  if (!tenantUser) {
    return null
  }

  let isAllowedToView = false
  if (checkPermission(tenantUser, 'update', 'dashboard')) {
    isAllowedToView = true
  }

  if (!isAllowedToView) {
    redirect('/unauthorized')
  }

  const now = new Date()
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(startOfThisMonth.getTime() - 1)

  const employeeCount = await prisma.employee.count({
    where: {
      tenantId: business.data.businessId
    }
  })

  const employeeCountLastMonth = await prisma.employee.count({
    where: {
      tenantId: business.data.businessId,
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth
      }
    }
  })

  const pendingLeaveRequests = await prisma.leave.count({
    where: {
      tenantId: business.data.businessId,
      status: LeaveStatus.PENDING
    }
  })

  // request that start very soon
  const twoDaysFromNow = new Date()
  twoDaysFromNow.setDate(now.getDate() + 2)
  const urgentLeaveRequests = await prisma.leave.count({
    where: {
      tenantId: business.data.businessId,
      status: LeaveStatus.PENDING,
      from: {
        lte: twoDaysFromNow
      }
    }
  })

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(now.getDate() - 7)

  const lastSevenDaysPendingInvitation = await prisma.invite.count({
    where: {
      tenantId: business.data.businessId,
      createdAt: {
        gte: sevenDaysAgo
      }
    }
  })

  const departments = await prisma.department.count({
    where: {
      tenantId: business.data.businessId
    }
  })

  const currentMonth = now.getMonth()
  const quarterStartMonth = currentMonth - (currentMonth % 3)
  const startOfQuarter = new Date(now.getFullYear(), quarterStartMonth, 1)

  const newDepartmentsThisQuarter = await prisma.department.count({
    where: {
      tenantId: business.data.businessId,
      createdAt: {
        gte: startOfQuarter
      }
    }
  })

  let percentageChange = 0

  if (employeeCountLastMonth === 0) {
    percentageChange = employeeCount === 0 ? 0 : 100
  } else {
    percentageChange = ((employeeCount - employeeCountLastMonth) / employeeCountLastMonth) * 100
  }

  const formattedPercentageChange =
    percentageChange >= 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`

  return (
    <main className='mx-auto max-w-7xl px-6'>
      {/* Welcome Section */}
      <div className='mb-4'>
        <h2 className='mb-2 text-3xl font-bold text-foreground'>Welcome back, {tenantUser.user?.name} </h2>
        <p className='text-muted-foreground'>Here&apos;s what&apos;s happening at your workspace today.</p>
      </div>

      {/* Stats Grid */}
      <div className='mb-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Employees'
          value={employeeCount}
          icon={Users}
          trend={`${formattedPercentageChange} from last month`}
        />
        <StatsCard
          title='Pending Leave Requests'
          value={pendingLeaveRequests}
          icon={Clock}
          trend={`${urgentLeaveRequests} urgent requests`}
        />
        <StatsCard
          title='Active Invites'
          value={lastSevenDaysPendingInvitation}
          icon={Mail}
          trend='Sent in last 7 days'
        />
        <StatsCard
          title='Departments'
          value={departments}
          icon={Building}
          trend={`${newDepartmentsThisQuarter} new this quarter`}
        />
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <ActivityFeed />
        <QuickActions />
      </div>
    </main>
  )
}

export default Dashboard
