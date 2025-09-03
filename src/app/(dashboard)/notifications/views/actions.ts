'use server'

import { getBusinessInfo } from "@/lib/business"
import { getErrorMessage } from "@/lib/error"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markAllAsRead() {
    try {
        const business = await getBusinessInfo()
        if (!business.status || !business.data) {
            return business
        }
       
        const {businessId,userId, role} = business.data

        if (!businessId || !userId) {
            return business
        }

        // to get relevant notification IDs

        const notifications = await prisma.notification.findMany({
            where: {
                tenantId: businessId,
                OR: [{ userId: userId }, {
                    AND:[{
                        userId: null,
                        targetRoles:{has:role}
                    }]
                }]
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
            }
        }

        // prepare createMany data

        const createData = notifications.map((notif) => ({
            notificationId: notif.id,
            userId,
            tenantId:businessId
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
        }



    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        }
    }
}