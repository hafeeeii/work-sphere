import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const validSortFields = ['name', 'code'];
const validSortOrders = ['asc', 'desc'];

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams
    const sortByParam = searchParams.get('sortBy') || 'name'
    const sortOrderParam = searchParams.get('sortOrder') || 'asc'
    const name = searchParams.get('name')
    const code = searchParams.get('code')

    const sortBy = validSortFields.includes(sortByParam) ? sortByParam : 'name'
    const sortOrder = validSortOrders.includes(sortOrderParam.toLowerCase()) ? sortOrderParam : 'asc'


    const departments = await prisma.department.findMany({
      include: {
        employees: true
      },
      where: {
        ...(name && { name: { contains: name } }),
        ...(code && { code: { contains: code } }),
      },
      orderBy: [
        {
          [sortBy]: sortOrder
        }
      ],
    });
    const udpatedDepartments = departments.map((item) => ({
      ...item,
      totalEmployees: item.employees.length
    }))

    return NextResponse.json(udpatedDepartments);
  } catch (error) {
    console.error(error, "Error fetching departments");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


