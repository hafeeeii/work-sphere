
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Department ID missing" });
    }

    try {
        const department = await prisma.department.findUnique({
            where: {
                id: id
            }
        })
        if (!department) {
            return NextResponse.json({ error: "department not found" });
        }
        return NextResponse.json(department);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching department" });
    }
}
