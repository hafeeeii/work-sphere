'use server'

import { getBusinessInfo } from "@/lib/business"
import prisma from "@/lib/prisma"
import { LeaveSchema } from "@/lib/types"
import { LeaveStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const applyLeave = async (prev: unknown, formData: FormData) => {
    const parsed = LeaveSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        throw new Error ('Please fill all the required fields')
    }

    const { id, from, to, ...rest } = parsed.data
    void id
    const leaveDays = Math.floor((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)) + 1
    const year = new Date(from).getFullYear()


    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            throw new Error(business.message)
        }

        const { businessId, userId } = business.data

        await prisma.$transaction(async (tx) => {
            const leave = await tx.leave.create({
                data: {
                    ...rest,
                    tenantId: businessId,
                    userId: userId,
                    status: LeaveStatus.PENDING,
                    from: new Date(from),
                    to: new Date(to)
                }
            })

            const { leaveTypeId, } = leave

            const leaveBalance = await tx.leaveBalance.findUnique({
                where: {
                    tenantId_userId_leaveTypeId_year: {
                        tenantId: businessId,
                        userId,
                        leaveTypeId,
                        year
                    }
                }
            })

            if (!leaveBalance) {
              throw new Error('Leave balance not found')
            }

            if (leaveBalance.available !== null && leaveBalance.available < leaveDays) {
             throw new Error('Insufficient leave balance')
            }

            await tx.leaveBalance.update({
                where: {
                    tenantId_userId_leaveTypeId_year: {
                        tenantId: businessId,
                        userId,
                        leaveTypeId,
                        year
                    }
                },
                data: {
                    available: {
                        decrement: leaveDays
                    },
                    booked: {
                        increment: leaveDays
                    }
                }
            })
        })



        revalidatePath('/leaves')

        return {
            status: true,
            message: 'Leave applied successfully',
            error: null
        }
    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: err?.message || 'Data base error occurred' ,
            error: err
        }
    }
}


// export async function updateEmployee(prevState: unknown, formData: FormData) {
//     const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
//     if (!parsed.success) {
//         return {
//             status: false,
//             message: 'Please fill all the required fields',
//             error: parsed.error.message
//         }
//     }

//     try {
//         const business = await getBusinessInfo()

//         if (!business.status) {
//             return business
//         }

//         const businessId = business.data?.businessId as string

//         const employee = await prisma.employee.findUnique({
//             where: {
//                 id: parsed.data.id
//             }
//         })
//         if (!employee || employee.tenantId !== businessId) {
//             return {
//                 status: false,
//                 message: 'Employee not found',
//                 error: null
//             }
//         }

//         await prisma.employee.update({
//             where: {
//                 id: parsed.data.id
//             },
//             data: parsed.data
//         })

//         revalidatePath('/employee')

//         return {
//             status: true,
//             message: 'Employee updated successfully',
//             error: null
//         }
//     } catch (error) {
//         const err = error as Error
//         return {
//             status: false,
//             message: 'Data base error occurred: ' + err?.message,
//             error: err
//         }
//     }
// }

// export async function deleteEmployee(id: string) {
//     if (!id) return {
//         status: false,
//         message: 'Employee ID not found',
//         error: null
//     }

//     try {
//         const business = await getBusinessInfo()

//         if (!business.status) {
//             return business
//         }

//         const businessId = business.data?.businessId as string

//         const employee = await prisma.employee.findUnique({
//             where: {
//                 id: id
//             }
//         })

//         if (!employee || employee.tenantId !== businessId) {
//             return {
//                 status: false,
//                 message: 'Employee not found',
//                 error: null
//             }
//         }
//         await prisma.employee.delete({
//             where: {
//                 id
//             },
//         })
//         revalidatePath('/employee')

//         return {
//             status: true,
//             message: 'Employee deleted successfully',
//             error: null
//         }
//     } catch (error) {
//         const err = error as Error
//         return {
//             status: false,
//             message: 'Data base error occurred: ' + err?.message,
//             error: err
//         }
//     }

// }
