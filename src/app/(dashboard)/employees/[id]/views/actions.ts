'use server'
import { EmailTemplate } from "@/components/email-template"
import { getBusinessInfo } from "@/lib/business"
import { getErrorMessage } from "@/lib/error"
import prisma from "@/lib/prisma"
import { EmployeeSchema } from "@/lib/types"
import { rootDomain } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"


export async function inviteEmployee(prevState: unknown, formData: FormData) {
    const parsed = EmployeeSchema.safeParse({ ...Object.fromEntries(formData), inviteUser: formData.get('inviteUser') === 'true' })
    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status || !business.data) {
            return business
        }

        const { businessId, userId, businessName } = business.data

        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                email: parsed.data.email
            }
        })

        if (userAlreadyExists) {
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
                    status: false,
                    message: 'User already part of business',
                    error: null
                }
            }
        }

        const invite = await prisma.invite.create({
            data: {
                tenantId: businessId,
                invitedBy: userId,
                email: parsed.data.email,
                name: parsed.data.name,
                role: parsed.data.role

            },
            include: {
                inviter: true
            }
        })

        const resend = new Resend(process.env.RESEND_API_KEY)
        const result = await resend.emails.send({
            from: `${businessName} <noreply@invite.worksphere.icu>`,
            to: parsed.data.email,
            subject: `Invitation from ${businessName}`,
            react: EmailTemplate({ name: parsed.data.name, businessName, inviteLink: `${rootDomain}/business/invites`, invitedBy: invite.inviter?.name ?? 'Admin', inviteEmail: parsed.data.email }),

        })

        if (result.error) {
            return {
                status: false,
                message: 'Failed to send email',
                error: result.error
            }
        }

        await prisma.invite.update({
            where: {
                id: invite.id
            },
            data: {
                emailSent: true
            }
        })

        await prisma.employee.update({
            where: {
                tenantId_id: {
                    id: parsed.data.id,
                    tenantId: businessId
                }
            },
            data: {
                inviteUser: true
            }
        })

        revalidatePath(`/employees/${parsed.data.id}`)

        return {
            status: true,
            message: 'Email sent successfully',
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