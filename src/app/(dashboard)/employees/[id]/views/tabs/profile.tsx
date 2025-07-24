import { Card, CardContent } from '@/components/ui/card'
import { getFormattedDate } from '@/lib/date'
import { Employee } from '@prisma/client'
import { differenceInYears } from 'date-fns'
import EditButton from '../edit-button'

type ProfileTabProps = {
  employee:
    | (Employee & {
        designationMeta: {
          name: string
        }
        workLocationMeta: {
          state: string
          city: string
        }
        departmentMeta: {
          name: string
        }
        reportingManager: {
          name: string
        } | null
      })
    | null
}
export default function ProfileTab({ employee }: ProfileTabProps) {
  const personalInfo = [
    { label: 'Name', value: employee?.name },
    { label: 'Mobile', value: employee?.phoneNumber },
    { label: 'Email', value: employee?.email },
    {
      label: 'Date of Birth',
      value: employee?.dateOfBirth ? getFormattedDate(employee.dateOfBirth) : 'N/A'
    },
    { label: 'Age', value: employee?.dateOfBirth ? differenceInYears(new Date(), employee.dateOfBirth) : 'N/A' },
    { label: 'Marital Status', value: employee?.maritalStatus },
    { label: 'Gender', value: employee?.gender },
    { label: 'Language known', value: employee?.language },
    { label: 'Address Line 1', value: employee?.addressLine1 || 'N/A' },
    { label: 'Address Line 2', value: employee?.addressLine2 || 'N/A' }
  ]

  const identificationInfo = [
    { label: 'Aadhar Number', value: employee?.aadhaarNumber || 'N/A' },
    { label: 'PAN Number', value: employee?.panNumber || 'N/A' },
    { label: 'Driver License Number', value: employee?.driverLicenseNumber || 'N/A' }
  ]

  const employmentDetails = [
    { label: 'Designation', value: employee?.designationMeta?.name || 'N/A' },
    { label: 'Department', value: employee?.departmentMeta?.name || 'N/A' },
    { label: 'Work Location', value: `${employee?.workLocationMeta?.state}, ${employee?.workLocationMeta?.city}` },
    { label: 'Work Email', value: employee?.workEmail || 'N/A' },
    { label: 'Employment Type', value: employee?.employmentType || 'N/A' },
    { label: 'Date of Joining', value: employee?.dateOfJoining ? getFormattedDate(employee.dateOfJoining) : 'N/A' },
    { label: 'Role', value: employee?.role },
    { label: 'Reporting Manager', value: employee?.reportingManager?.name || 'N/A' }
  ]

  const bankInfo = [
    { label: 'Bank Name', value: employee?.bankName },
    { label: 'Bank Account Number', value: employee?.bankAccountNumber },
    { label: 'Bank Account Type', value: employee?.bankAccountType },
    { label: 'IFSC Code', value: employee?.bankIfscCode },
    { label: 'Branch', value: employee?.bankBranch }
  ]

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {/* Personal Info */}
      <Card className='col-span-2'>
        <CardContent className='space-y-2 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>Personal Information</h3>
            <EditButton path={`/employees/form/personal-details/${employee?.id}`} />
          </div>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            {personalInfo.map((item, index) => (
              <div key={index}>
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ID Proof */}
      <Card>
        <CardContent className='space-y-2 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>ID Proof</h3>
            <EditButton path={`/employees/form/identification-and-bank-info/${employee?.id}`} />
          </div>
          <div className='space-y-4 text-sm'>
            {identificationInfo.map((item, index) => (
              <div key={index}>
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Details */}
      <Card className='col-span-3'>
        <CardContent className='space-y-2 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>Employment Details</h3>
            <EditButton path={`/employees/form/employment-details/${employee?.id}`} />
          </div>
          <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-3'>
            {employmentDetails.map((item, index) => (
              <div key={index}>
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bank Info */}
      <Card className='col-span-3'>
        <CardContent className='space-y-2 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>Bank Information</h3>
            <EditButton path={`/employees/form/identification-and-bank-info/${employee?.id}`} />
          </div>
          <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-3'>
            {bankInfo.map((item, index) => (
              <div key={index}>
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
