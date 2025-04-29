import { z } from "zod";
import {FIELD_METADATA} from '@/data/field-metadata'

const {designation, department, departmentCode, departmentDescription, workLocation, state, city, pincode, addressLine1, addressLine2, password, name, email} = FIELD_METADATA

export const designationSchema = z.object({
    [designation.name]:designation.schema
})

export type DesignationFormValues = z.infer<typeof designationSchema>

export const departmentSchema = z.object({
    [department.name]:department.schema,
    [departmentCode.name]: departmentCode.schema,
    [departmentDescription.name]:departmentDescription.schema
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>

export const workLocationSchema = z.object({
    [workLocation.name]: workLocation.schema,
    [state.name]: state.schema,
    [city.name]: city.schema,
    [pincode.name]: pincode.schema,
    [addressLine1.name]: addressLine1.schema,
    [addressLine2.name]: addressLine2.schema
})

export type WorkLocationFormValues = z.infer<typeof workLocationSchema>

export const SignUpSchema = z.object({
    name: name.schema,
    email: email.schema,
    password: password.schema
})

export type SignUpFormValues = z.infer<typeof SignUpSchema>

export const LoginSchema = z.object({
    email: email.schema,
    password: password.schema
})

export type LoginFormValues = z.infer<typeof LoginSchema>