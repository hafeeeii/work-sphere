import { Prisma } from '@/generated/prisma'
import { PrismaClient } from '../src/generated/prisma'
const prisma = new PrismaClient()

const department: Prisma.DepartmentCreateInput = {
  name: 'Human Resources',
  code: 'HR',
  description: 'HR department',
}

const designation: Prisma.DesignationCreateInput = {
  name: 'Developer',
}

const workLocation: Prisma.WorkLocationCreateInput = {
  name: 'Bangalore',
  addressLine1: 'Bangalore',
  addressLine2: 'Bangalore',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560001',
}


async function main() {
    await prisma.designation.create({
      data: designation,
    })
  
    await prisma.department.create({
      data: department,
    })
  
    await prisma.workLocation.create({
      data: workLocation,
    })
  
  }
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })