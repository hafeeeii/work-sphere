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

        const unreadCount = await prisma.notification.count({
            where: {
                tenantId: businessId,
                // OR = at least one of the conditions is must be true
                OR: [
                    { userId },
                    { userId: null },
                ],
                notificationsRead: {
                    // none = checks that no related record matches the condition.
                    none: {
                        userId: userId,
                    },
                },
                //  exclude notifications created by current user
                NOT: {
                    createdById: userId
                }
            },
        });

        return NextResponse.json({ unreadCount })
    } catch (err) {
        console.error(err, "Error");
        return NextResponse.json({ error: "Error fetching notifications count", status: 500 });
    }
}