import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import ProfileCard from './profile-card'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { getFormattedDate } from '@/lib/date'

export default async function ProfileTab() {
  const { data } = await getBusinessInfo()
  if (!data) return null

  const { email, businessId } = data

  const employeeData = await prisma.employee.findUnique({
    where: {
      tenantId_email: {
        tenantId: businessId,
        email
      }
    },
    include: {
      departmentMeta: true,
      designationMeta: true,
      workLocationMeta: true,
      reportingManager: true
    }
  })

  if (!employeeData) return (
    <p className='text-sm text-center text-muted-foreground w-full h-full justify-center flex flex-col'>
      Not available
    </p>
  )

  const {
    name,
    gender,
    dateOfBirth,
    maritalStatus,
    language,
    nationality,
    phoneNumber,
    workEmail,
    addressLine1,
    addressLine2,
    aadhaarNumber,
    panNumber,
    driverLicenseNumber,
    departmentMeta,
    designationMeta,
    workLocationMeta,
    employmentType,
    dateOfJoining,
    reportingManager,
    role,
    bankAccountHolderName,
    bankAccountNumber,
    bankAccountType,
    bankBranch,
    bankIfscCode,
    bankName
  } = employeeData

  const employeeFormMeta = {
    personalInfo: {
      title: 'Personal Information',
      data: [
        { label: 'Name', value: name },
        { label: 'Gender', value: gender },
        { label: 'Date of Birth', value: getFormattedDate(dateOfBirth, 'MMM d, yyyy') },
        { label: 'Marital Status', maritalStatus },
        { label: 'Language', value: language },
        { label: 'Nationality', value: nationality }
      ],
      maxRows: 3
    },

    contactInfo: {
      title: 'Contact Information',
      data: [
        { label: 'Phone Number', value: phoneNumber },
        { label: 'Personal Email', value: email },
        { label: 'Work Email', value: workEmail },
        { label: 'Address Line 1', value: addressLine1 },
        { label: 'Address Line 2', value: addressLine2 }
      ],
      maxRows: 3
    },

    identification: {
      title: 'Identification',
      data: [
        { label: 'Aadhaar Number', value: aadhaarNumber },
        { label: 'PAN Number', value: panNumber },
        { label: 'Driver License Number', value: driverLicenseNumber }
      ],
      maxRows: 2
    },

    employmentDetails: {
      title: 'Employment Details',
      data: [
        { label: 'Designation', value: designationMeta.name },
        { label: 'Department', value: departmentMeta.name },
        { label: 'Employment Type', value: employmentType },
        { label: 'Date of Joining', value: getFormattedDate(dateOfJoining, 'MMM d, yyyy') },
        { label: 'Work Location', value: workLocationMeta.name },
        { label: 'Reporting Manager ID', value: reportingManager?.name },
        { label: 'Role', value: role }
      ],
      maxRows: 4
    },

    bankDetails: {
      title: 'Bank Details',
      data: [
        { label: 'Bank Name', value: bankName },
        { label: 'Account Holder Name', value: bankAccountHolderName },
        { label: 'Account Number', value: bankAccountNumber },
        { label: 'Account Type', value: bankAccountType },
        { label: 'IFSC Code', value: bankIfscCode },
        { label: 'Branch', value: bankBranch }
      ],
      maxRows: 3
    }
  }

  return (
    <div className='flex h-full flex-col gap-2 overflow-y-auto p-2'>
      <Card className='h-full'>
        <CardContent className='flex h-full justify-between text-xs'>
          <div className='flex w-full flex-col gap-2'>
            <div className='flex flex-col'>
              <p className='text-muted-foreground'>Department</p>
              <p>{departmentMeta.name}</p>
            </div>
            <div>
              <p className='text-muted-foreground'>Email</p>
              <p>{email}</p>
            </div>
          </div>
          <div className='flex w-full flex-col gap-1'>
            <p className='text-muted-foreground'>Shift</p>
            <p>General (09:00 AM - 06:00 PM)</p>
          </div>
          <div className='flex w-full flex-col gap-1'>
            <p className='text-muted-foreground'>Time zone</p>
            <p>(GMT+05:30)</p>
          </div>
        </CardContent>
      </Card>
      {Object.keys(employeeFormMeta).map((key, idx) => {
        const item = employeeFormMeta[key as keyof typeof employeeFormMeta]
        return (
          <React.Fragment key={idx}>
            <ProfileCard list={item.data} title={item.title} maxRows={item.maxRows} />
          </React.Fragment>
        )
      })}
    </div>
  )
}
