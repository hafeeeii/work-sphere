
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id

    if (!id) {
        return NextResponse.json({ error: "Employee ID missing" });
    }

    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id: id
            }
        })
        if (!employee) {
            return NextResponse.json({ error: "Employee not found" });
        }
        return NextResponse.json(employee);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching employee" });
    }
}
