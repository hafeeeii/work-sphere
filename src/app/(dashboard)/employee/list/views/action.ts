'use server'
import prisma from "@/lib/prisma"
import { EmployeeSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"


export async function saveEmployee(prevState: any, formData: FormData) {
    console.log(Object.fromEntries(formData),'this is form data')
    const parsed = EmployeeSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Please fill all the required fields',
            error:parsed.error.message
        }
    }

    try {
        await prisma.employee.create({ data: parsed.data })
    } catch (err) {
        return {
            status: false,
            message: 'Data base error occurred',
            error:err
        }
    }
    revalidatePath('/employee/list')

    return {
        status: true,
        message: 'Employee created successfully',
        error: null
    }

}