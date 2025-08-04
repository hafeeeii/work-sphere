import { BankAccountType, Department, Designation, Employee, EmploymentType, Gender, MaritalStatus, Role, Tenant, TenantUser, User, WorkLocation } from '@prisma/client';
import { z } from "zod";

const required = (name: string) => z.string().min(1, { message: `${name} is required` }).trim()

export const designationSchema = z.object({
    id: z.string(),
    name: required('designation'),
})

export type DesignationFormValues = z.infer<typeof designationSchema>

export const departmentSchema = z.object({
    id: z.string(),
    name: required('department'),
    code: z.string(),
    description: z.string(),
})


export type DepartmentFormValues = z.infer<typeof departmentSchema>

export const workLocationSchema = z.object({
    id: z.string(),
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
    id: z.string(),
    //  Personal Information
    name: required("Name"),
    gender: z.nativeEnum(Gender), 
    dateOfBirth: required("Date of birth"),
    maritalStatus: z.nativeEnum(MaritalStatus), 
    language: z.string().optional(),
    nationality: z.string().optional(),

    // Contact Information
    phoneNumber: required("Phone number").regex(/^\d{10}$/,'Invalid phone number'),
    email: required("Email").email("Invalid email"),
    workEmail: z.string().email("Invalid email").optional().or(z.literal('')),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),

    //  Identification
    aadhaarNumber: z.string().regex(/^[2-9][0-9]{11}$/,'Invalid Aadhaar number').or(z.literal('')),
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN number').or(z.literal('')),
    driverLicenseNumber: z.string().optional(),

    //  Employment Details
    designation: required("Designation"),
    department: required("Department"),
    employmentType: z.nativeEnum(EmploymentType), 
    dateOfJoining: required("Date of joining"),
    workLocation: required("Work Location"),
    reportingManagerId: z.string().optional(),
    role: z.nativeEnum(Role),

    //  Bank Details
    bankName: required("Bank name"),
    bankAccountHolderName: required("Bank account holder name"),
    bankAccountNumber: required("Bank account number"),
    bankAccountType:  z.nativeEnum(BankAccountType),
    bankIfscCode: required("Bank IFSC code").regex(/^[A-Z]{4}0[A-Z0-9]{6}$/,'Invalid IFSC code').or(z.literal('')),
    bankBranch: required("Bank branch"),
    inviteUser: z.boolean()
})

export type EmployeeFormValues = z.infer<typeof EmployeeSchema>

export type EmployeeWithRelations = Employee & {
    workLocationMeta: WorkLocation,
    departmentMeta: Department,
    designationMeta: Designation
}

export type TenantUserWithRelations = TenantUser & {
    user: User,
    tenant: Tenant
}
export type UserWithRelations = User & {
    tenantUsers: TenantUserWithRelations[]
}


export const BusinessSchema = z.object({
    ownerId: required('Owner ID'),
    name: required('Name'),
    subdomain: required('Subdomain').regex(/^[a-z0-9-]+$/, {
        message: 'Only lowercase letters, numbers, and hyphens are allowed.'
    }),
})

export type BusinessFormValues = z.infer<typeof BusinessSchema>

export const InviteSchema = z.object({
    id: z.string(),
    name: required('Name'),
    email: required('Email').email('Invalid email'),
    role: z.nativeEnum(Role),
})

export type InviteFormValues = z.infer<typeof InviteSchema>

export const LeaveSchema = z.object({
    id: z.string(),
    leaveTypeId: required('Type'),
    from: required('Start date'),
    to: required('End date'),
    reason: z.string()
})

export type LeaveFormValues = z.infer<typeof LeaveSchema>