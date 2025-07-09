'use server'

import { getBusinessInfo } from "@/lib/business"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markAllAsRead() {
    try {
        const business = await getBusinessInfo()
        if (!business.status) {
            return business
        }
        const businessId = business.data?.businessId
        const userId = business.data?.userId

        if (!businessId || !userId) {
            return business
        }

        // to get relevant notification IDs

        const notifications = await prisma.notification.findMany({
            where: {
                tenantId: businessId,
                OR: [{ userId: userId }, { userId: null }]
            },
            select: {
                id: true
            }
        })

        if (notifications.length === 0) {
            return {
                status: true,
                message: 'Nothing to mark   ',
                error: null,
                data: null
            }
        }

        // prepare createMany data

        const createData = notifications.map((notif) => ({
            notificationId: notif.id,
            userId,
        }))

        await prisma.notificationRead.createMany({
            data: createData,
            skipDuplicates: true
        })

        revalidatePath('/notifications')

        return {
            status: true,
            message: 'All notifications marked as read',
            error: null,
            data: null
        }



    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
}