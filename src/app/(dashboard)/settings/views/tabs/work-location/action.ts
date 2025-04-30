'use server'

import prisma from "@/lib/prisma"
import { workLocationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveWorkLocation(prevState: any,
    formData: FormData
) {

    const result = workLocationSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            status: false,
            message: 'Invalid work location'
        }
    }

    await prisma.workLocation.create({
        data: result.data
    })
    revalidatePath('/settings')
    return {
        status: true,
        message: 'Work location created successfully'
    }
}