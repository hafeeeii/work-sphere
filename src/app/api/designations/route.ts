import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const designations = await prisma.designation.findMany({
      include:{
        employees:true
      }
    });
    const udpatedDesignations = designations.map((item) => ({
      ...item,
      totalEmployees: item.employees.length 
    }))
    return NextResponse.json(udpatedDesignations);
  } catch (error) {
    console.error(error, "Error fetching designations");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}