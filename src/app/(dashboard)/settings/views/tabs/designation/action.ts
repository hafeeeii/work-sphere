'use server'

import prisma from "@/lib/prisma"
import { designationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveDesignation(prevState: any,
    formData: FormData
) {
    
    const parsed = designationSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status:false,
            message: 'Invalid designation'
        }
    }
    try {
        await prisma.designation.create({
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
        status:true,
        message: 'Designation created successfully'
    }
}