'use server'

import prisma from "@/lib/prisma"
import { departmentSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"
import {FIELD_METADATA} from '@/data/field-metadata'

const {department, departmentCode, departmentDescription} = FIELD_METADATA

export async function saveDepartment(prevState: string,
    formData: FormData
) {
    const departmentValue = formData.get(department.name)
    const departmentCodeValue = formData.get(departmentCode.name)
    const departmentDescriptionValue = formData.get(departmentDescription.name)
    
    const validateData = departmentSchema.safeParse({
        [department.name]: departmentValue,
        [departmentCode.name]: departmentCodeValue,
        [departmentDescription.name]: departmentDescriptionValue
    })
    if (validateData.success) {
         await prisma.department.create({
            data: {
                name: validateData.data.department,
                code: validateData.data.departmentCode ?? '',
                description: validateData.data.departmentDescription ?? ''
            }
        })
        revalidatePath('/settings')
        return 'sucess'
    } else {
        return "failed"
    }
}