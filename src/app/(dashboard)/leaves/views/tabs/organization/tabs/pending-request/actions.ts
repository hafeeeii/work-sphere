'use server'
import { getBusinessInfo } from "@/lib/business"
import prisma from "@/lib/prisma"
import { LeaveStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"


export const approveLeave = async (prev: unknown, id: string) => {
    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            throw new Error(business.message)
        }

        const { businessId } = business.data


        const leave = await prisma.leave.findUnique({
            where: {
                id,
            },
        })

        if (!leave || leave.tenantId !== businessId) {
            throw new Error('Leave not found')
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
        }

    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: err?.message || 'Data base error occurred',
        }

    }

}

export const rejectLeave = async (prev: unknown, id: string) => {
    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            throw new Error(business.message)
        }

        const { businessId } = business.data


        const leave = await prisma.leave.findUnique({
            where: {
                id,
            },
        })

        if (leave?.tenantId !== businessId || !leave) {
            throw new Error('Leave not found')
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
        }

    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: err?.message || 'Data base error occurred',
        }
    }

}