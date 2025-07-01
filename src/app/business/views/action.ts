'use server'

import prisma from "@/lib/prisma"
import { getValidSession } from "@/lib/session"
import { BusinessSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"


export async function saveBusiness(prevState: any,
    formData: FormData
) {

    const parsed = BusinessSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return {
            status: false,
            message: 'Invalid business data'
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
                message: 'Subdomain already taken. Please choose another.'
            };
        }

        const user = await prisma.user.findUnique({
            where: { id: ownerId },
        });


        if (!user) {
            return {
                status: false,
                message: 'User does not exist.'
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
                    role: 'OWNER'
                }
            })

            return tenant;
        })

    } catch (err: any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
        }
    }

    revalidatePath('/business')
    return {
        status: true,
        message: 'Business created successfully'
    }
}
