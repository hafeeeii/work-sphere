import { FIELD_METADATA } from "@/data/field-metadata";
import { z } from "zod";

const {
    dateOfBirth,
    firstName,
    lastName,
    gender,
    email,
    employeeId,
    manager,
    designation,
    department,
    employeementType,
    dateOfJoining,
    workLocation
} = FIELD_METADATA

export const employeeFormSchema = z.object({
    [firstName.name]: z.string(),
    [lastName.name]: z.string(),
    [dateOfBirth.name]: z.date(),
    [gender.name]: z.string(),
    [email.name]: z.string().email(),
    [employeeId.name]: z.string(),
    [manager.name]: z.string(),
    [designation.name]: z.string(),
    [department.name]: z.string(),
    [employeementType.name]: z.string(),
    [dateOfJoining.name]: z.date(),
    [workLocation.name]: z.string(),
})

export type TEmployeeFormSchema = z.infer<typeof employeeFormSchema>