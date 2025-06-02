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

    try {
        await prisma.department.create({
            data: result.data
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
        message: 'Department created successfully'
    }

}



export async function updateDepartment(prevState: any, formData: FormData) {
    const parsed = departmentSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        await prisma.department.update({
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
        message: 'Department updated successfully',
        error: null
    }
}