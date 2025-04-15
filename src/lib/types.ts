import { z } from "zod";
import {FIELD_METADATA} from '@/data/field-metadata'

const {designation, department, departmentCode, departmentDescription} = FIELD_METADATA

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