'use server'
import { EmailTemplate } from "@/components/email-template"
import { getBusinessInfo } from "@/lib/business"
import { getErrorMessage } from "@/lib/error"
import prisma from "@/lib/prisma"
import { EmployeeSchema } from "@/lib/types"
import { rootDomain } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"


export async function saveEmployee(prevState: unknown, formData: FormData) {
    const parsed = EmployeeSchema.safeParse({ ...Object.fromEntries(formData), inviteUser: formData.get('inviteUser') === 'true' })
    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }


    const { id, dateOfBirth, dateOfJoining, reportingManagerId, inviteUser, ...rest } = parsed.data
    void id

    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            return business
        }

        const { businessId, userId, businessName } = business.data

        // check if employee with same email already exists 

        const employee = await prisma.employee.findUnique({
            where: {
                tenantId_email:{
                    tenantId: businessId,
                    email: parsed.data.workEmail
                }
            }
        })

        if (employee) {
            return {
                status: false,
                message: 'Employee with same email already exists',
                error: null
            }
        }

        await prisma.employee.create({
            data: {
                ...rest,
                tenantId: businessId,
                dateOfBirth: new Date(dateOfBirth),
                dateOfJoining: new Date(dateOfJoining),
                reportingManagerId: reportingManagerId || null,
                inviteUser,
            }
        })


        if (inviteUser) {
            
            const userAlreadyExists = await prisma.user.findUnique({
                where: {
                    email: parsed.data.workEmail
                }
            })
            
            if (userAlreadyExists) {
                // checks if user already part of the business
                const userAlreadyPartOfBusiness = await prisma.tenantUser.findUnique({
                    where: {
                        userId_tenantId: {
                            userId: userAlreadyExists.id,
                            tenantId: businessId
                        }
                    }
                })

                if (userAlreadyPartOfBusiness) {
                    return {
                        status: true,
                        message: 'Employee created successfully',
                        error: null
                    }
                }

            }

            // if user not exist/not part of business, invite user

            const invite = await prisma.invite.create({
                data: {
                    tenantId: businessId,
                    invitedBy: userId,
                    name: parsed.data.name,
                    email: parsed.data.workEmail,
                    role: parsed.data.role
                },
                include: {
                    inviter: true
                }
            })

            const resend = new Resend(process.env.RESEND_API_KEY)
            const result = await resend.emails.send({
                from: `${businessName} <noreply@invite.worksphere.icu>`,
                to: parsed.data.workEmail,
                subject: `Invitation from ${businessName}`,
                react: EmailTemplate({ name: parsed.data.name, businessName, inviteLink: `${rootDomain}/business/invites`, invitedBy: invite.inviter?.name ?? 'Admin', inviteEmail: parsed.data.workEmail }),

            })

            if (result.error) {
                return {
                    status: false,
                    message: 'Failed to send invite',
                    error: result.error
                }
            }

        }


        return {
            status: true,
            message: 'Employee created successfully',
            error: null
        }
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error: error
        }
    }

}

export async function updateEmployee(prevState: unknown, formData: FormData) {
    const parsed = EmployeeSchema.safeParse({ ...Object.fromEntries(formData), inviteUser: formData.get('inviteUser') === 'true' })
    if (!parsed.success) {
        return {
            status: false,
            message: parsed.error.message,
            error: parsed.error.message
        }
    }

    const { dateOfBirth, dateOfJoining, reportingManagerId, ...rest } = parsed.data

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        const employee = await prisma.employee.findUnique({
            where: {
                tenantId_id: {
                    id: parsed.data.id,
                    tenantId: businessId
                }
            }
        })

        if (!employee) {
            return {
                status: false,
                message: 'Employee not found',
                error: null
            }
        }

        await prisma.employee.update({
            where: {
                tenantId_id: {
                    id: parsed.data.id,
                    tenantId: businessId
                }
            },
            data: {
                ...rest,
                dateOfBirth: new Date(dateOfBirth),
                dateOfJoining: new Date(dateOfJoining),
                reportingManagerId: reportingManagerId || null,
            }
        })

        revalidatePath('/employees')

        return {
            status: true,
            message: 'Employee updated successfully',
            error: null
        }
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        }
    }

}

export async function deleteEmployee(id: string) {
    if (!id) return {
        status: false,
        message: 'Employee ID not found',
        error: null
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        const employee = await prisma.employee.findUnique({
            where: {
                id: id
            }
        })

        if (!employee || employee.tenantId !== businessId) {
            return {
                status: false,
                message: 'Employee not found',
                error: null
            }
        }
        await prisma.employee.delete({
            where: {
                id
            },
        })
        revalidatePath('/employees')

        return {
            status: true,
            message: 'Employee deleted successfully',
            error: null
        }
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        }
    }

}

