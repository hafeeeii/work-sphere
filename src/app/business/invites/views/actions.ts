'use server'
import { getErrorMessage } from "@/lib/error"
import { createDefaultBusinessLeaveBalanceForUser } from "@/lib/leave"
import prisma from "@/lib/prisma"
import { getValidSession } from "@/lib/session"
import { InviteStatus, NotificationType } from "@prisma/client"
import { revalidatePath } from "next/cache"


export const acceptInvite = async (prev: unknown, inviteId: string) => {
    try {
        const session = await getValidSession()

        if (!session.status) {
            return {
                status: false,
                message: 'Not authenticated',
                error: null
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
                message: 'Invite not found',
                error: null
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
                error: null
            }
        }

        await prisma.$transaction(async (tx) => {

            //  add user to tenant

            await tx.tenantUser.create({
                data: {
                    tenantId: invite.tenantId,
                    userId,
                    role: invite.role,
                    email: invite.email
                },
            })

            await tx.notification.create({
                data: {
                    title: 'New User Joined',
                    message: `${invite.name} has joined your business`,
                    tenantId: invite.tenantId,
                    type: NotificationType.ANNOUNCEMENT,
                    createdById: userId,
                    targetRoles:['OWNER','ADMIN','HR']
                }
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
            message: 'Invitation accepted successfully',
            error: null,
        }

    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        }

    }

}

export const declineInvite = async (prev: unknown, inviteId: string) => {
    try {
        const session = await getValidSession()

        if (!session.status || !session.data?.userId) {
            return {
                status: false,
                message: 'Not authenticated',
                error: null
            }
        }

        const userId = session.data?.userId
        const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId
            },
        })

        if (!invite) {
            return {
                status: false,
                message: 'Invite not found',
                error: null
            }
        }


        await prisma.$transaction(async (tx) => {

            await tx.invite.update({
                where: {
                    id: inviteId
                },
                data: {
                    declinedAt: new Date(),
                    status: InviteStatus.DECLINED
                }
            })

            await tx.notification.create({
                data: {
                    title: 'Invite Declined',
                    message: `${invite.name} has declined your invite`,
                    tenantId: invite.tenantId,
                    type: NotificationType.ANNOUNCEMENT,
                    createdById: userId,
                    targetRoles:['OWNER','ADMIN','HR']
                }
            })

        })



        revalidatePath('/business/invites')

        return {
            status: true,
            message: 'Invite declined successfully',
            error: null,
        }

    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error
        }
    }

}