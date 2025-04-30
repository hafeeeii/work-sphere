'use server'

import prisma from "@/lib/prisma"
import { departmentSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function saveDepartment(prevState: any,
    formData: FormData
) {

    const result = departmentSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            status: false,
            message: 'Invalid department'
        }
    }

    await prisma.department.create({
        data: result.data
    })
    revalidatePath('/settings')
    return {
        status: true,
        message: 'Department created successfully'
    }

}