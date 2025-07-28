'use server'

import { getErrorMessage } from "@/lib/error"
import { createDefaultBusinessLeaveBalanceForUser, defaultLeaveTypes } from "@/lib/leave"
import prisma from "@/lib/prisma"
import { getValidSession } from "@/lib/session"
import { BusinessSchema } from "@/lib/types"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"


export async function createBusiness(prevState: unknown,
    formData: FormData
) {

    const parsed = BusinessSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }

    const { name, subdomain } = parsed.data
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    try {
        const existingTenant = await prisma.tenant.findUnique({
            where: { subdomain: sanitizedSubdomain }
        });

        const session = await getValidSession()
        if (!session.status) {
            return session
        }

        const ownerId = session.data?.userId as string

        if (existingTenant) {
            return {
                status: false,
                message: 'Subdomain already taken. Please choose another.',
                error: null
            };
        }

        const user = await prisma.user.findUnique({
            where: { id: ownerId },
        });


        if (!user) {
            return {
                status: false,
                message: 'User does not exist.',
                error: null
            };
        }

        await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: name,
                    subdomain: sanitizedSubdomain
                }
            })

            await tx.tenantUser.create({
                data: {
                    userId: ownerId,
                    tenantId: tenant.id,
                    role: Role.OWNER
                }
            })

            await tx.leaveType.createMany({
                data: defaultLeaveTypes.map((name) => (
                    {
                        name,
                        tenantId: tenant.id,
                    }
                ))
            })

            await createDefaultBusinessLeaveBalanceForUser(tenant.id, ownerId, tx)

            return tenant;
        })

        revalidatePath('/business')
        return {
            status: true,
            message: 'Business created successfully',
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
