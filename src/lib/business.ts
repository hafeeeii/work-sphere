import 'server-only'
import prisma from './prisma'
import { cookies } from 'next/headers'
import { getValidSession } from './session'
import { Prisma } from '@prisma/client'

export async function fetchBusinessIdFromSubdomain(subdomain: string, userId: string) {
    const business = await prisma.tenant.findUnique({
        where: { subdomain },
        select: { id: true, name: true }
    })

    if (!business) return {
        status: false,
        message: 'Business not found',
        error: null,
        data: null
    }

    const tenantUser = await prisma.tenantUser.findUnique({
        where: { userId_tenantId: { tenantId: business?.id, userId } },
    })

    if (!tenantUser) return {
        status: false,
        message: 'Business not found',
        error: null,
        data: null
    }


    return {
        status: true,
        message: '',
        error: null,
        data: {
            businessId: business.id,
            businessName: business.name,
            userId
        }
    }
}

export async function getBusinessInfo() {
    const cookieStore = await cookies()
    const subdomain = cookieStore.get('subdomain')?.value
    const session = await getValidSession()

    if (!session.status) return {
        status: false,
        message: 'Session expired, please login again',
        error: null,
        data: null
    }

    const userId = session.data?.userId as string

    if (!subdomain) return {
        status: false,
        message: 'Subdomain not found',
        error: null,
        data: null
    }

    const business = await fetchBusinessIdFromSubdomain(subdomain, userId)


    if (!business?.data) return {
        status: false,
        message: 'Business not found',
        error: null,
        data: null
    }

    return business
}


export const defaultLeaveTypes = ['Sick Leave', 'Vacation Leave', 'Casual Leave', 'Earned Leave', 'Leave Without Pay', 'Sabbatical Leave']

export const createDefaultBusinessLeaveBalanceForUser = async (businessId: string, userId: string,tx:Prisma.TransactionClient) => {
    const defaultPolicy: Record<string, number> = {
        'Sick Leave': 14,
        'Vacation Leave': 14,
        'Casual Leave': 14,
        'Earned Leave': 14,
        'Leave Without Pay': 14,
        'Sabbatical Leave': 14
    }

    const leaveTypes = await tx.leaveType.findMany({
        where: {
            tenantId: businessId
        }
    })

    const balance = leaveTypes.map(type => ({
        leaveTypeId: type.id,
        userId,
        tenantId: businessId,
        available: defaultPolicy[type.name],
        booked: 0
    }))

    await tx.leaveBalance.createMany({
        data: balance,
        skipDuplicates: true
    })
}