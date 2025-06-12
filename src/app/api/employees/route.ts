import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const validSortFields = ['name', 'email'];
const validSortOrders = ['asc', 'desc'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sortByParam = searchParams.get('sortBy') || 'name'
    const sortOrderParam = searchParams.get('sortOrder') || 'asc'
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const page = searchParams.get('page') || '0'
    const pageSize = searchParams.get('pageSize') || '10'

    const sortBy = validSortFields.includes(sortByParam) ? sortByParam : 'name'
    const sortOrder = validSortOrders.includes(sortOrderParam.toLowerCase()) ? sortOrderParam : 'asc'


    const employees = await prisma.employee.findMany({
      skip: parseInt(page) * parseInt(pageSize),
      take: parseInt(pageSize),
      where: {
        ...(name && { name: { contains: name } }),
        ...(email && { email: { contains: email } }),
      },
      orderBy: [
        {
          [sortBy]: sortOrder
        }
      ],
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error(error, "Error fetching employees");
    return NextResponse.json({ error: "Error fetching employees", status: 500 });
  }
}


