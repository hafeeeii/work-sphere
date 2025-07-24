'use server'
import { createDefaultBusinessLeaveBalanceForUser } from "@/lib/leave"
import prisma from "@/lib/prisma"
import { getValidSession } from "@/lib/session"
import { InviteStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"


export const acceptInvite = async (prev: unknown, inviteId: string) => {
    try {
        const session = await getValidSession()

        if (!session.status) {
            return {
                status: false,
                message: 'Not authenticated'
            }
        }

        const userId = session.data?.userId as string

        const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId
            },
        })

        if (!invite) {
            return {
                status: false,
                message: 'Invite not found'
            }
        }


        //   check if user already part of the business

        const alreadyPartOfBusiness = await prisma.tenantUser.findUnique({
            where: {
                userId_tenantId: {
                    userId,
                    tenantId: invite.tenantId
                }
            }
        })

        if (alreadyPartOfBusiness) {
            return {
                status: false,
                message: 'Already part of this business',
            }
        }

        await prisma.$transaction(async (tx) => {

            //  add user to tenant

            await tx.tenantUser.create({
                data: {
                    tenantId: invite.tenantId,
                    userId,
                    role: invite.role
                },
            })

            // create default leave balance

            await createDefaultBusinessLeaveBalanceForUser(invite.tenantId, userId, tx)

            // mark as accepted
            await tx.invite.update({
                where: {
                    id: inviteId,
                },
                data: {
                    acceptedAt: new Date(),
                    status: InviteStatus.ACCEPTED
                }
            })
        })




        revalidatePath('/business/invites')

        return {
            status: true,
            message: 'Invite accepted successfully',
        }

    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
        }

    }

}

export const declineInvite = async (prev: unknown, inviteId: string) => {
    try {
        const session = await getValidSession()

        if (!session.status) {
            return {
                status: false,
                message: 'Not authenticated'
            }
        }
        const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId
            },
        })

        if (!invite) {
            return {
                status: false,
                message: 'Invite not found'
            }
        }

        await prisma.invite.update({
            where: {
                id: inviteId
            },
            data: {
                declinedAt: new Date(),
                status: InviteStatus.DECLINED
            }
        })



        revalidatePath('/business/invites')

        return {
            status: true,
            message: 'Invite declined successfully',
            error: null,
            data: null
        }

    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
        }
    }

}