import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const validSortFields = ['name'];
const validSortOrders = ['asc', 'desc'];

export async function GET(request: NextRequest) {

  try {
    const searchParams = request.nextUrl.searchParams
    const sortByParam = searchParams.get('sortBy') || 'name'
    const sortOrderParam = searchParams.get('sortOrder') || 'asc'
    const name = searchParams.get('name')
    const page = searchParams.get('page') || '0'
    const pageSize = searchParams.get('pageSize') || '10'

    const sortBy = validSortFields.includes(sortByParam) ? sortByParam : 'name'
    const sortOrder = validSortOrders.includes(sortOrderParam.toLowerCase()) ? sortOrderParam : 'asc'


    const designations = await prisma.designation.findMany({
      skip: parseInt(page) * parseInt(pageSize),
      take: parseInt(pageSize),
      include: {
        employees: true
      },
      where: {
        ...(name && { name: { contains: name } }),
      },
      orderBy: [
        {
          [sortBy]: sortOrder
        }
      ],
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


