
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Designation ID missing" });
    }

    try {
        const designation = await prisma.designation.findUnique({
            where: {
                id: id
            }
        })
        if (!designation) {
            return NextResponse.json({ error: "Designation not found" });
        }
        return NextResponse.json(designation);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching designation" });
    }
}
