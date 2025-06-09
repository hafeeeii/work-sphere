'use server'

import prisma from "@/lib/prisma"
import { workLocationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveWorkLocation(prevState: any,
    formData: FormData
) {

    const parsed = workLocationSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return {
            status: false,
            message: 'Invalid work location'
        }
    }

    try {
        await prisma.workLocation.create({
            data: parsed.data
        })
    } catch (err) {
        return {
            status: false,
            message: 'Data base error occurred',
        }
    }

    revalidatePath('/settings')
    return {
        status: true,
        message: 'Work location created successfully'
    }
}

export async function updateWorkLocation(prevState: any, formData: FormData) {
    const parsed = workLocationSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        await prisma.workLocation.update({
            where: {
                id: parsed.data.id
            },
            data: parsed.data
        })
    } catch (err) {
        return {
            status: false,
            message: 'Data base error occurred',
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

export async function deleteWorkLocation(id:string) {
    if (!id) return {
        status: false,
        message: 'Work location not found',
        error: null
    }

    try {
        await prisma.workLocation.delete({
            where: {
                id: id
            },
        })
    } catch (err) {
        return {
            status: false,
            message: 'Data base error occurred',
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
