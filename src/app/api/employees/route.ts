import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
     include:{
       designationMeta:true,
       departmentMeta:true,
       workLocationMeta:true
     }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error, "Error fetching employees");
    return NextResponse.json({ error: "Error fetching employees", status: 500 });
  }
}