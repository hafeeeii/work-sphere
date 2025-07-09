import { getBusinessInfo } from "@/lib/business";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";


export const GET = async () => {
    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return NextResponse.json(business, { status: 401 });
        }
        const businessId = business.data?.businessId
        const userId = business.data?.userId

        if (!businessId || !userId) {
            return NextResponse.json({ error: "Error fetching notifications count", status: 401 });
        }

        const count = await prisma.notification.findMany({
            where: {
                tenantId: businessId,
                OR: [
                    { userId },
                    { userId: null }
                ]
            },
            include: {
                notificationRead: {
                    where: {
                        userId
                    },
                }
            }
        })

        const unreadCount = count.filter((notif) => notif.notificationRead.length === 0).length
        return NextResponse.json({ unreadCount })
    } catch (err) {
        console.error(err, "Error");
        return NextResponse.json({ error: "Error fetching notifications count", status: 500 });
    }
}