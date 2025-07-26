'use client'
import { SharedTable } from '@/components/shared-table'
import React from 'react'
import Form from './form'
import { WorkLocation } from '@prisma/client'
import { getWorkLocation } from '@/services/work-location'
import { deleteWorkLocation } from './action'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { checkPermission } from '@/lib/auth'

type WorkLocationTabProps = {
  workLocations: WorkLocation[]
}

const WorkLocationTab = ({ workLocations }: WorkLocationTabProps) => {
  const [showForm, setShowForm] = React.useState(false)
  const [workLocation, setWorkLocation] = React.useState<WorkLocation | null>(null)

  const toggleForm = () => {
    setShowForm(!showForm)
    if (showForm) {
      setWorkLocation(null)
    }
  }

  type TableData = {
    editMode: 'toggle' | 'redirect'
    visibleActions: ('details' | 'edit' | 'delete')[]
    columnData: {
      header: string
      accessorKey: keyof WorkLocation[][number]
      sortable?: boolean
      filterable?: boolean
    }[]
    data: WorkLocation[]
  }

  const tableData: TableData = {
    editMode: 'toggle',
    visibleActions: ['edit', 'delete'],
    columnData: [
      { header: 'Name', accessorKey: 'name', sortable: true },
      { header: 'State', accessorKey: 'state', sortable: true },
      { header: 'City', accessorKey: 'city', sortable: true },
      { header: 'Pincode', accessorKey: 'pincode', sortable: true, filterable: true },
      { header: 'Total Employees', accessorKey: 'totalEmployees' }
    ],
    data: workLocations ?? []
  }

  const onEdit = async (id: string) => {
    if (!id) return null
    const workLocations = await getWorkLocation(id)
    setWorkLocation(workLocations)
    toggleForm()
  }
  const { businessUser } = useBusinessUser()

  let isAllowedToCreate = false
  let isAllowedToDelete = false
  let isAllowedToEdit = false

  if (businessUser) {
    if (checkPermission(businessUser, 'create', 'work-location')) {
      isAllowedToCreate = true
    }
    if (checkPermission(businessUser, 'delete', 'work-location')) {
      isAllowedToDelete = true
    }
    if (checkPermission(businessUser, 'update', 'work-location')) {
      isAllowedToEdit = true
    }
  }

  return (
    <div className='flex flex-col items-end gap-6'>
      {isAllowedToCreate && <Form workLocation={workLocation} showForm={showForm} toggleForm={toggleForm} />}
      <SharedTable
        tableData={tableData}
        onEdit={onEdit}
        onDelete={deleteWorkLocation}
        isAllowedToDelete={isAllowedToDelete}
        isAllowedToEdit={isAllowedToEdit}
      />
    </div>
  )
}

export default WorkLocationTab
