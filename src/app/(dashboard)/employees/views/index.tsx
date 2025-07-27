'use client'
import { SharedTable } from '@/components/shared-table'
import { Button } from '@/components/ui/button'
import { checkPermission } from '@/lib/auth'
import { EmployeeWithRelations } from '@/lib/types'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBusinessUser } from '../../business-user-provider'
import { deleteEmployee } from './action'

type EmployeeListProps = {
  employees?: EmployeeWithRelations[]
}

const EmployeeList = ({ employees }: EmployeeListProps) => {
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
    editMode: 'toggle' | 'redirect'
    visibleActions: ('details' | 'edit' | 'delete')[]
    detailsRedirectPath?: string
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
    visibleActions: ['details', 'delete'],
    detailsRedirectPath: '/employees',
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
      { header: 'Work Email', accessorKey: 'workEmail', sortable: true, filterable: true },
      { header: 'Department', accessorKey: 'departmentName' },
      { header: 'Designation', accessorKey: 'designationName' },
      { header: 'Work Location', accessorKey: 'workLocationName' }
      // { header: "Phone", accessorKey: "phone" },
    ],
    data: processedEmployees
  }

  const router = useRouter()
    const { businessUser } = useBusinessUser()

    let isAllowedToCreate = false
    let isAllowedToDelete = false
    let isAllowedToEdit = false

    if (businessUser) {
      if (checkPermission(businessUser, 'create', 'employee')) {
        isAllowedToCreate = true
      }
      if (checkPermission(businessUser, 'delete', 'employee')) {
        isAllowedToDelete = true
      }
      if (checkPermission(businessUser, 'update', 'employee')) {
        isAllowedToEdit = true
      }
    }

    console.log(tableData.data,'this is data',employees)

  return (
    <div className='flex flex-col items-end gap-6'>
      {isAllowedToCreate && (
        <Button onClick={() => router.push('/employees/form/personal-details')}>
          <PlusIcon />
          Create Employee
        </Button>
      )}
      <SharedTable tableData={tableData} onDelete={deleteEmployee} isAllowedToDelete={isAllowedToDelete}  isAllowedToEdit={isAllowedToEdit} />
    </div>
  )
}

export default EmployeeList
