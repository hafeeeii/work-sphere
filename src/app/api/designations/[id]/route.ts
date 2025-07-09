
import { getBusinessInfo } from '@/lib/business';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Designation ID missing" });
    }

    try {

        const business = await getBusinessInfo()

        if (!business.status) {
            return NextResponse.json(business, { status: 401 });
        }

        const businessId = business.data?.businessId as string

        const designation = await prisma.designation.findUnique({
            where: {
                tenantId_id: {
                    tenantId: businessId,
                    id
                }

            }
        })
        if (!designation) {
            return NextResponse.json({ error: "Designation not found" });
        }
        return NextResponse.json(designation);
    } catch (error) {
        console.error(error, "Error");
        return NextResponse.json({ error: "Error fetching designation" });
    }
}
