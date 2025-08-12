'use client'
import { SharedTable } from '@/components/shared-table'
import React from 'react'
import dynamic from 'next/dynamic'
import { Department } from '@prisma/client'
import { getDepartment } from '@/services/department'
import { deleteDepartment } from './action'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { checkPermission } from '@/lib/authz'

const DynamicForm = dynamic(() => import('./form'), {
  ssr:false
})

type DepartmentTabProps = {
  departments: Department[]
}

const DepartmentTab = ({ departments }: DepartmentTabProps) => {
  const [showForm, setShowForm] = React.useState(false)
  const [department, setDepartment] = React.useState<Department | null>(null)

  const toggleForm = () => {
    setShowForm(!showForm)
    if (showForm) {
      setDepartment(null)
    }
  }

  type TableData = {
    editMode: 'toggle' | 'redirect'
    visibleActions: ('details' | 'edit' | 'delete')[]
    columnData: {
      header: string
      accessorKey: keyof Department[][number]
      sortable?: boolean
      filterable?: boolean
    }[]
    data: Department[]
  }

  const tableData: TableData = {
    editMode: 'toggle',
    visibleActions: ['edit', 'delete'],
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
      { header: 'Code', accessorKey: 'code', sortable: true, filterable: true },
      { header: 'Description', accessorKey: 'description' },
      { header: 'Total Employees', accessorKey: 'totalEmployees' }
    ],
    data: departments ?? []
  }

  const onEdit = async (id: string) => {
    if (!id) return null
    const department = await getDepartment(id)
    setDepartment(department)
    toggleForm()
  }

  const { businessUser } = useBusinessUser()

  let isAllowedToCreate = false
  let isAllowedToDelete = false
  let isAllowedToEdit = false

  if (businessUser) {
    if (checkPermission(businessUser, 'create', 'department')) {
      isAllowedToCreate = true
    }
    if (checkPermission(businessUser, 'delete', 'department')) {
      isAllowedToDelete = true
    }
    if (checkPermission(businessUser, 'update', 'department')) {
      isAllowedToEdit = true
    }
  }

  return (
    <div className='flex flex-col items-end gap-6'>
      {isAllowedToCreate && <DynamicForm department={department} showForm={showForm} toggleForm={toggleForm} />}
      <SharedTable
        tableData={tableData}
        onEdit={onEdit}
        onDelete={deleteDepartment}
        isAllowedToDelete={isAllowedToDelete}
        isAllowedToEdit={isAllowedToEdit}
      />
    </div>
  )
}

export default DepartmentTab
