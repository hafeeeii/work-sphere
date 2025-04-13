import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany();
    return NextResponse.json(departments);
  } catch (error) {
    console.error(error, "Error fetching departments");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}