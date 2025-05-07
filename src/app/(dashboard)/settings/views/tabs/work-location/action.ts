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