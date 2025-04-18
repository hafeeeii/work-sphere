'use server'

import prisma from "@/lib/prisma"
import { workLocationSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"
import {FIELD_METADATA} from '@/data/field-metadata'

const {workLocation, state, city, pincode, addressLine1, addressLine2} = FIELD_METADATA

export async function saveWorkLocation(prevState: string,
    formData: FormData
) {
    const workLocationValue = formData.get(workLocation.name)
    const stateValue = formData.get(state.name)
    const cityValue = formData.get(city.name)
    const pincodeValue = formData.get(pincode.name)
    const addressLine1Value = formData.get(addressLine1.name)
    const addressLine2Value = formData.get(addressLine2.name)

    const validateData = workLocationSchema.safeParse({
        [workLocation.name]: workLocationValue,
        [state.name]: stateValue,
        [city.name]: cityValue,
        [pincode.name]: pincodeValue,
        [addressLine1.name]: addressLine1Value,
        [addressLine2.name]: addressLine2Value
    })

    if (validateData.success) {
        await prisma.workLocation.create({
            data: {
                name: validateData.data.workLocationName,
                state: validateData.data.state,
                city: validateData.data.city,
                pincode: validateData.data.pincode,
                addressLine1: validateData.data.addressLine1,
                addressLine2: validateData.data.addressLine2
            }
        })
        revalidatePath('/settings')
        return 'sucess'
    } else {
        return "failed"
    }
    

}