import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const designations = await prisma.designation.findMany();
    return NextResponse.json(designations);
  } catch (error) {
    console.error(error, "Error fetching designations");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}