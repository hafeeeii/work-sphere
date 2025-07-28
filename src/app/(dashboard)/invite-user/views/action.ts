'use server'

import { EmailTemplate } from "@/components/email-template"
import { getBusinessInfo } from "@/lib/business"
import { getErrorMessage } from "@/lib/error"
import prisma from "@/lib/prisma"
import { InviteSchema } from "@/lib/types"
import { rootDomain } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { Resend } from 'resend'



export async function createInvite(prevState: unknown, formData: FormData) {
    const parsed = InviteSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }

    const { id, ...rest } = parsed.data
    void id

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
                ...rest,
                tenantId: businessId,
                invitedBy: userId,
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

        revalidatePath('/user-member')

        return {
            status: true,
            message: 'Email sent successfully',
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

export async function updateInvite(prevState: unknown, formData: FormData) {
    const parsed = InviteSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }


    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        const invite = await prisma.invite.findUnique({
            where: {
                id: parsed.data.id
            }
        })
        if (!invite || invite.tenantId !== businessId) {
            return {
                status: false,
                message: 'Invitation not found',
                error: null
            }
        }

        await prisma.invite.update({
            where: {
                id: parsed.data.id
            },
            data: parsed.data
        })

        revalidatePath('/user-member')

        return {
            status: true,
            message: 'Invite updated successfully',
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

export async function deleteInvite(id: string) {
    if (!id) return {
        status: false,
        message: 'Invite ID missing',
        error: null
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        const invite = await prisma.invite.findUnique({
            where: {
                id: id
            }
        })

        if (!invite || invite.tenantId !== businessId) {
            return {
                status: false,
                message: 'Invitation not found',
                error: null
            }
        }
        await prisma.invite.delete({
            where: {
                id
            },
        })
        revalidatePath('/user-member')

        return {
            status: true,
            message: 'Invitation deleted successfully',
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