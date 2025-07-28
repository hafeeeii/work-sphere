'use server'
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

        const { businessId } = business.data


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

        const { businessId } = business.data


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

        await prisma.leave.update({
            where: {
                id,
            },
            data: {
                status: LeaveStatus.REJECTED,
                rejectedAt: new Date()
            }
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