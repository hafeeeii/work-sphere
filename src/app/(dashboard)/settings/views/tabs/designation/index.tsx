'use client'
import { SharedTable } from '@/components/shared-table'
import React from 'react'
import { getDesignation } from '@/services/designation'
import { Designation } from '@prisma/client'
import { deleteDesignation } from './action'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { checkPermission } from '@/lib/authz'
import dynamic from 'next/dynamic'


const DynamicForm  = dynamic(() => import('./form'), {
  ssr:false
})

type DesignationTabProps = {
  designations: Designation[]
}

const DesignationTab = ({ designations }: DesignationTabProps) => {
  const [showForm, setShowForm] = React.useState(false)
  const [designation, setDesignation] = React.useState<Designation | null>(null)

  const toggleForm = () => {
    setShowForm(!showForm)
    if (showForm) {
      setDesignation(null)
    }
  }

  type TableData = {
    editMode: 'toggle' | 'redirect'
    visibleActions: ('details' | 'edit' | 'delete')[]
    columnData: {
      header: string
      accessorKey: keyof Designation[][number]
      sortable?: boolean
      filterable?: boolean
    }[]
    data: Designation[]
  }

  const tableData: TableData = {
    editMode: 'toggle',
    visibleActions: ['edit', 'delete'],
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true, filterable: true },
      { header: 'Total Employees', accessorKey: 'totalEmployees' }
    ],
    data: designations ?? []
  }

  const onEdit = async (id: string) => {
    if (!id) return null
    const designation = await getDesignation(id)
    setDesignation(designation)
    toggleForm()
  }

  const { businessUser } = useBusinessUser()

  let isAllowedToCreate = false
  let isAllowedToDelete = false
  let isAllowedToEdit = false

  if (businessUser) {
    if (checkPermission(businessUser, 'create', 'designation')) {
      isAllowedToCreate = true
    }
    if (checkPermission(businessUser, 'delete', 'designation')) {
      isAllowedToDelete = true
    }
    if (checkPermission(businessUser, 'update', 'designation')) {
      isAllowedToEdit = true
    }
  }

  return (
    <div className='flex flex-col items-end gap-6'>
      {isAllowedToCreate && <DynamicForm designation={designation} showForm={showForm} toggleForm={toggleForm} />}
      <SharedTable
        tableData={tableData}
        onEdit={onEdit}
        onDelete={deleteDesignation}
        isAllowedToDelete={isAllowedToDelete}
        isAllowedToEdit={isAllowedToEdit}
      />
    </div>
  )
}

export default DesignationTab
