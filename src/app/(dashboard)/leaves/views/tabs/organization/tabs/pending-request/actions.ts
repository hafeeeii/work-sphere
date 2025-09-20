'use server'
import { checkPermission } from "@/lib/authz"
import { getBusinessInfo } from "@/lib/business"
import { getErrorMessage } from "@/lib/error"
import prisma from "@/lib/prisma"
import { LeaveStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"


export const approveLeave = async (prev: unknown, id: string) => {
    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            return business
        }

        const { businessId, userId, role, email } = business.data

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'create', 'leave-pending-request')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }



        const leave = await prisma.leave.findUnique({
            where: {
                id,
            },
        })

        if (!leave || leave.tenantId !== businessId) {
            return {
                status: false,
                message: 'Leave not found',
                error: null
            }
        }

        await prisma.leave.update({
            where: {
                id,
            },
            data: {
                status: LeaveStatus.APPROVED,
                approvedAt: new Date()
            }
        })


        revalidatePath('/leaves')

        return {
            status: true,
            message: 'Leave approved successfully',
            error: null
        }

    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        }

    }

}

export const rejectLeave = async (prev: unknown, id: string) => {
    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            return business
        }

        const { businessId, userId, role, email } = business.data

        const isAuthorized = checkPermission({ email, role, tenantId: businessId, userId }, 'update', 'leave-pending-request')
        if (!isAuthorized) {
            return {
                status: false,
                message: 'Not authorized',
                error: null
            }
        }



        const leave = await prisma.leave.findUnique({
            where: {
                id,
            },
        })


        if (leave?.tenantId !== businessId || !leave) {
            return {
                status: false,
                message: 'Leave not found',
                error: null
            }
        }

        const leaveDays = Math.floor((new Date(leave.to).getTime() - new Date(leave.from).getTime()) / (1000 * 60 * 60 * 24)) + 1
        const year = new Date(leave.from).getFullYear()

        await prisma.$transaction(async (tx) => {

            const { leaveTypeId } = await prisma.leave.update({
                where: {
                    id,
                },
                data: {
                    status: LeaveStatus.REJECTED,
                    rejectedAt: new Date()
                }
            })

            await tx.leaveBalance.update({
                where: {
                    tenantId_userId_leaveTypeId_year: {
                        tenantId: businessId,
                        userId,
                        leaveTypeId,
                        year
                    }
                },
                data: {
                    available: {
                        increment: leaveDays
                    }
                }
            })
        })


        revalidatePath('/leaves')

        return {
            status: true,
            message: 'Leave rejected successfully',
            error: null
        }

    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        }
    }

}