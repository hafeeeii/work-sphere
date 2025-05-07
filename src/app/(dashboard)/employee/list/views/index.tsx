import { SharedTable } from '@/components/shared-table'
import React from 'react'
import Form from './form'
import { getDepartments } from '@/services/department'
import { getDesignations } from '@/services/designation'
import { getWorkLocations } from '@/services/work-location'
import Typography from '@/components/ui/typography'
import { getEmployees } from '@/services/employee'

const EmployeeList = async () => {
  const employees = await getEmployees()
  const departments = await getDepartments()
  const designations = await getDesignations()
  const workLocations = await getWorkLocations()

  const processedEmployees = employees.map(employee => {
    return {
      ...employee,
      departmentName: employee.departmentMeta?.name || '',
      designationName: employee.designationMeta?.name || '',
      workLocationName: employee.workLocationMeta?.name || ''
    }
  })

  type TableData = {
    columnData: { header: string; accessorKey: keyof (typeof processedEmployees)[number] }[]
    data: typeof processedEmployees
  }

  const tableData: TableData = {
    columnData: [
      // { header: 'ID', accessorKey: 'id' },
      { header: 'Name', accessorKey: 'name' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Department', accessorKey: 'departmentName' },
      { header: 'Designation', accessorKey: 'designationName' },
      { header: 'Work Location', accessorKey: 'workLocationName' }
      // { header: "Phone", accessorKey: "phone" },
    ],
    data: processedEmployees
  }

  return (
    <div className='flex flex-col gap-6'>
      <Typography variant='h5'>Employees</Typography>
      <Form departments={departments} designations={designations} workLocations={workLocations} />
      <SharedTable tableData={tableData} />
    </div>
  )
}

export default EmployeeList
