import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const workLocations = await prisma.workLocation.findMany();
    return NextResponse.json(workLocations);
  } catch (error) {
    console.error(error, "Error fetching work locations");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}