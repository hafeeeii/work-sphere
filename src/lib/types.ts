import { Department, Designation, Employee, Prisma, WorkLocation } from "@/generated/prisma";
import { z } from "zod";

const required = (name:string) => z.string().min(1, {message:`${name} is required`}).trim()

export const designationSchema = z.object({
    name:required('designation'),
})

export type DesignationFormValues = z.infer<typeof designationSchema>

export const departmentSchema = z.object({
    id:z.string(),
    name:required('department'),
    code:z.string(),
    description:z.string(),
})


export type DepartmentFormValues = z.infer<typeof departmentSchema>

export const workLocationSchema = z.object({
    name: required('work location'),
    state: required('state'),
    city: required('city'),
    pincode: required('pincode'),
    addressLine1: required('address line 1'),
    addressLine2: required('address line 2')
})


export type WorkLocationFormValues = z.infer<typeof workLocationSchema>

export const SignUpSchema = z.object({
    name: required('Name'),
    email: required('Email'),
    password: required('Password'),
})

export type SignUpFormValues = z.infer<typeof SignUpSchema>

export const LoginSchema = z.object({
    email: required('Email'),
    password: required('Password')
})


export type LoginFormValues = z.infer<typeof LoginSchema>

export const EmployeeSchema = z.object({
    id:z.string(),
    name: required('Name'),
    dateOfBirth: required('Date of birth'),
    gender: required('Gender'),
    dateOfJoining: required('Date of joining'),
    email: required('Email'),
    designation: required('Designation'),
    department: required('Department'),
    workLocation: required('Work Location'),
    employmentType: required('Employment Type'),
})

export type EmployeeFormValues = z.infer<typeof EmployeeSchema>

export type EmployeeWithRelations = Employee & {
    workLocationMeta: WorkLocation,
    departmentMeta: Department,
    designationMeta: Designation
}



