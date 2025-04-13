import { Prisma } from '@/generated/prisma'
import { PrismaClient } from '../src/generated/prisma'
const prisma = new PrismaClient()

const department: Prisma.DepartmentCreateInput = {
  name: 'Human Resources',
}

const designation: Prisma.DesignationCreateInput = {
  name: 'Developer',
}

const workLocation: Prisma.WorkLocationCreateInput = {
  name: 'Bangalore',
}

const employee: Prisma.EmployeeCreateInput = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  gender: 'Male',
  dateOfBirth: new Date('1995-06-15'),
  designation: designation.name,
  department: department.name,
  manager: 'Jane Manager',
  employeementType: 'Full-Time',
  dateOfJoining: new Date('2023-01-01'),
  workLocation: workLocation.name,
}

async function main() {
    await prisma.designation.create({
      data: department,
    })
  
    await prisma.department.create({
      data: designation,
    })
  
    await prisma.workLocation.create({
      data: workLocation,
    })
  
    await prisma.employee.create({
      data: employee,
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