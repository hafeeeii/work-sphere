'use server'

import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library"
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
    const {id, ...rest} = parsed.data
    try {
        await prisma.designation.create({
            data: rest
        })
    } catch (err:any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
        }
    }

    revalidatePath('/settings')
    return {
        status:true,
        message: 'Designation created successfully'
    }
}

export async function updateDesignation(prevState: any, formData: FormData) {
    const parsed = designationSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        await prisma.designation.update({
            where: {
                id: parsed.data.id
            },
            data: parsed.data
        })
    } catch (err:any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
    revalidatePath('/settings')

    return {
        status: true,
        message: 'Designation updated successfully',
        error: null
    }
}

export async function deleteDesignation(id:string) {
    if (!id) return {
        status: false,
        message: 'Designation not found',
        error: null
    }

    try {
        await prisma.designation.delete({
            where: {
                id: id
            },
        })
    } catch (err:any) {
        return {
            status: false,
            message: 'Data base error occurred: ' + err?.message,
            error: err
        }
    }
     revalidatePath('/settings')

    return {
        status: true,
        message: 'Designation deleted successfully',
        error: null
    }
}
