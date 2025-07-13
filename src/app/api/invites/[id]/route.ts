
import { getBusinessInfo } from '@/lib/business';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Invite ID missing" });
    }

    try {

        const business = await getBusinessInfo()

        if (!business.status) {
            return NextResponse.json(business, { status: 401 });
        }

        const businessId = business.data?.businessId as string

        const invite = await prisma.invite.findUnique({
            where: {
                id: id,
                tenantId: businessId
            }
        })
        if (!invite || invite.tenantId !== businessId) {
            return NextResponse.json({ error: "Invite not found" });
        }
        return NextResponse.json(invite);
    } catch (error) {
        console.error(error, "Error");
        return NextResponse.json({ error: "Error fetching invite:" });
    }
}
