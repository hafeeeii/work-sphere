import { createDefaultBusinessLeaveBalanceForUser, defaultLeaveTypes } from '../src/lib/leave'
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from "bcrypt"
import { businessData, departmentsData, designationsData, getEmployeesData, invitesData, userData, workLocationsData } from './seed-data'
const prisma = new PrismaClient()

const { email, name, password, id: userId } = userData
const { subdomain, id: businessId, name: businessName } = businessData



async function main() {
    // create user
    await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            id: userId,
            email,
            name,
            passwordHash: await bcrypt.hash(password, 10),
        },
    })

    // create tenant
    await prisma.tenant.upsert({
        where: { subdomain },
        update: {},
        create: {
            subdomain,
            name: businessName,
            id: businessId,
        },
    })

    // link tenantUser
    await prisma.tenantUser.upsert({
        where: { userId_tenantId: { userId, tenantId: businessId } },
        update: {},
        create: {
            userId,
            tenantId: businessId,
            role: Role.OWNER,
            email,
        },
    })

    // create leave types 
    await prisma.leaveType.createMany({
        data: defaultLeaveTypes.map((name) => ({
            name,
            tenantId: businessId,
        })),
        skipDuplicates: true,
    })

    // create default leave balance
    await createDefaultBusinessLeaveBalanceForUser(businessId, userId, prisma)

    // seed departments
    const departments = await prisma.department.createManyAndReturn({
        data: departmentsData,
        skipDuplicates: true,
    })

    // seed designations
    const designations = await prisma.designation.createManyAndReturn({
        data: designationsData,
        skipDuplicates: true,
    })

    // seed work locations
    const workLocations = await prisma.workLocation.createManyAndReturn({
        data: workLocationsData,
        skipDuplicates: true,
    })

    // seed invites
    await prisma.invite.createMany({
        data: invitesData,
        skipDuplicates: true,
    })

    await prisma.employee.createMany({
        data: getEmployeesData(designations, departments, workLocations),
        skipDuplicates: true
    })

    console.log("✅ Seeding completed successfully!")
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("❌ Seeding error:", e)
        await prisma.$disconnect()
        process.exit(1)
    })