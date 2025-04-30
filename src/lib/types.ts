import { z } from "zod";

const required = (name:string) => z.string().min(1, {message:`${name} is required`}).trim()

export const designationSchema = z.object({
    name:required('designation'),
})

export type DesignationFormValues = z.infer<typeof designationSchema>

export const departmentSchema = z.object({
    name:required('department'),
    code:required('department code'),
    description:required('department description')
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

// export const EmployeeSchema = z.object({
//     firstName:name.schema,
//     lastName:name.schema,
//     dateOfBirth: name.schema,
//     gender: name.schema,
//     dateOfJoining: name.schema,
//     email: email.schema,
//     password: password.schema,
//     designation: designation.schema,
//     department: department.schema,
//     workLocation: workLocation.schema
// })