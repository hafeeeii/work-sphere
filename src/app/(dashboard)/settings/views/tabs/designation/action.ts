'use server'

import prisma from "@/lib/prisma"
import { designationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveDesignation(prevState: any,
    formData: FormData
) {
    
    const result = designationSchema.safeParse(Object.fromEntries(formData))
    if (!result.success) {
        return {
            status:false,
            message: 'Invalid designation'
        }
    }
    await prisma.designation.create({
        data: result.data
    })
    revalidatePath('/settings')
    return {
        status:true,
        message: 'Designation created successfully'
    }
}