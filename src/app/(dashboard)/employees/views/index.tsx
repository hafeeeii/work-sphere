'use client'
import { SharedTable } from '@/components/shared-table'
import { Button } from '@/components/ui/button'
import { EmployeeWithRelations } from '@/lib/types'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteEmployee } from './action'

type EmployeeListProps = {
  employees?: EmployeeWithRelations[]
}

const EmployeeList =  ({ employees }: EmployeeListProps) => {

  const processedEmployees =
    employees?.map(employee => {
      return {
        ...employee,
        departmentName: employee.departmentMeta?.name || '',
        designationName: employee.designationMeta?.name || '',
        workLocationName: employee.workLocationMeta?.name || ''
      }
    }) ?? []

  type TableData = {
    editMode: 'toggle' | 'redirect',
    visibleActions: ('details' | 'edit' | 'delete')[]
    columnData: {
      header: string
      accessorKey: keyof (typeof processedEmployees)[number]
      sortable?: boolean
      filterable?: boolean
    }[]
    data: typeof processedEmployees
  }

  const tableData: TableData = {
    editMode: 'toggle',
    visibleActions:['details','details'],
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
      { header: 'Email', accessorKey: 'email', sortable: true, filterable: true },
      { header: 'Department', accessorKey: 'departmentName' },
      { header: 'Designation', accessorKey: 'designationName' },
      { header: 'Work Location', accessorKey: 'workLocationName' }
      // { header: "Phone", accessorKey: "phone" },
    ],
    data: processedEmployees
  }

  const router = useRouter()

  return (
    <div className='flex flex-col items-end gap-6'>
    <Button onClick={() => router.push('/employees/form/personal-details')}>
      <PlusIcon/>
      Create Employee
    </Button>
      <SharedTable tableData={tableData}  onDelete={deleteEmployee}/>
    </div>
  )
}

export default EmployeeList
