import { Prisma } from '@prisma/client'
// import 'server-only'
import prisma from './prisma'



export const defaultLeaveTypes = ['Sick Leave', 'Vacation Leave', 'Casual Leave', 'Earned Leave', 'Leave Without Pay', 'Sabbatical Leave']

export const createDefaultBusinessLeaveBalanceForUser = async (businessId: string, userId: string, tx: Prisma.TransactionClient, year = new Date().getFullYear()) => {
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
        booked: 0,
        year
    }))

    await tx.leaveBalance.createMany({
        data: balance,
        skipDuplicates: true,
    })
}

export const getOrCreateLeaveBalanceForUser = async (
    businessId: string,
    userId: string,
    year: number
) => {
    try {
        const currentYear = new Date().getFullYear()
        if (year > (currentYear + 1)) {
            return []
        }
        const existing = await prisma.leaveBalance.findMany({
            where: {
                userId,
                tenantId: businessId,
                year
            },
            include: {
                leaveType: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                leaveType: {
                    name: 'asc'
                }
            }
        })


        if (existing.length > 0) return existing

        const created = await prisma.$transaction(async (tx) => {
            await createDefaultBusinessLeaveBalanceForUser(businessId, userId, tx, year)

            return await tx.leaveBalance.findMany({
                where: {
                    userId,
                    tenantId: businessId,
                    year
                },
                include: {
                    leaveType: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    leaveType: {
                        name: 'asc'
                    }
                }
            })
        })

        return created
    } catch (error) {
        console.error(error, 'error')
        return []
    }
}