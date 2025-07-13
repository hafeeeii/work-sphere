'use server'

import { getBusinessInfo } from "@/lib/business"
import prisma from "@/lib/prisma"
import { workLocationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveWorkLocation(prevState: unknown,
    formData: FormData
) {

    const parsed = workLocationSchema.safeParse(Object.fromEntries(formData))


    if (!parsed.success) {
        return {
            status: false,
            message: 'Invalid work location'
        }
    }

    const { id, ...rest } = parsed.data
    void id

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        await prisma.workLocation.create({
            data: {
                ...rest,
                tenantId: businessId
            }
        })
    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
        }
    }

    revalidatePath('/settings')
    return {
        status: true,
        message: 'Work location created successfully'
    }
}

export async function updateWorkLocation(prevState: unknown, formData: FormData) {
    const parsed = workLocationSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string

        const workLocation = await prisma.workLocation.findUnique({
            where: {
                id: parsed.data.id
            }
        })
        if (!workLocation || workLocation.tenantId !== businessId) {
            return {
                status: false,
                message: 'Work location not found',
                error: null
            }
        }
        await prisma.workLocation.update({
            where: {
                id: parsed.data.id
            },
            data: parsed.data
        })
    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/settings')

    return {
        status: true,
        message: 'Work location updated successfully',
        error: null
    }
}

export async function deleteWorkLocation(id: string) {
    if (!id) return {
        status: false,
        message: 'Work location not found',
        error: null
    }

    try {
        const business = await getBusinessInfo()

        if (!business.status) {
            return business
        }

        const businessId = business.data?.businessId as string
        const workLocation = await prisma.workLocation.findUnique({
            where: {
                id: id
            }
        })
        if (!workLocation || workLocation.tenantId !== businessId) {
            return {
                status: false,
                message: 'Work location not found',
                error: null
            }
        }
        await prisma.workLocation.delete({
            where: {
                id
            },
        })
    } catch (error) {
        const err = error as Error
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/settings')

    return {
        status: true,
        message: 'Work location deleted successfully',
        error: null
    }
}
