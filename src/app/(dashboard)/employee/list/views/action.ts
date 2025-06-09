'use server'
import prisma from "@/lib/prisma"
import { EmployeeSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveEmployee(prevState: any, formData: FormData) {
    const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        await prisma.employee.create({ data: parsed.data })
    } catch (err) {
        return {
            status: false,
            message: 'Data base error occurred',
            error: err
        }
    }
    revalidatePath('/employee/list')

    return {
        status: true,
        message: 'Employee created successfully',
        error: null
    }

}

export async function updateEmployee(prevState: any, formData: FormData) {
    const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error: parsed.error.message
        }
    }

    try {
        await prisma.employee.update({
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
    revalidatePath('/employee/list')

    return {
        status: true,
        message: 'Employee updated successfully',
        error: null
    }
}

export async function deleteEmployee(id:string) {
    if (!id) return {
        status: false,
        message: 'Employee not found',
        error: null
    }

    try {
        await prisma.employee.delete({
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
    revalidatePath('/employee/list')

    return {
        status: true,
        message: 'Employee deleted successfully',
        error: null
    }
}

