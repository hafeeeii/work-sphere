
import { getBusinessInfo } from '@/lib/business';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Work Location ID missing" });
    }

    try {

        const business = await getBusinessInfo()

        if (!business.status) {
            return NextResponse.json(business, { status: 401 });
        }

        const businessId = business.data?.businessId
        const workLocation = await prisma.workLocation.findUnique({
            where: {
                id: id,
                tenantId:businessId
            }
        })
        if (!workLocation) {
            return NextResponse.json({ error: "Work Location not found" });
        }
        return NextResponse.json(workLocation);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching work location" });
    }
}
