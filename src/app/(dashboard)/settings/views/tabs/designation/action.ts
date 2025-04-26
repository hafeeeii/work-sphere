'use server'

import prisma from "@/lib/prisma"
import { designationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveDesignation(prevState: string,
    formData: FormData
) {
    const designationValue = formData.get('designation')
    
    const validateData = designationSchema.safeParse({
        designation: designationValue
    })
    if (validateData.success) {
         await prisma.designation.create({
            data: {
                name: validateData.data.designation
            }
        })
        revalidatePath('/settings')
        return 'sucess'
    } else {
        return "failed"
    }
}