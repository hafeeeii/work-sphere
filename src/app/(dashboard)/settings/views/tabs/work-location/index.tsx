import React from 'react'
import Form from './form'
import { SharedTable } from '@/components/shared-table'
import { getWorkLocations } from '@/services/work-location'

const WorkLocationTab = async () => {
  const departments = await getWorkLocations()

  const tableData = {
    columnData: [
      { header: 'Name', accessorKey: 'name' },
      { header: 'State', accessorKey: 'state' },
      { header: 'City', accessorKey: 'city' },
      { header: 'Pincode', accessorKey: 'pincode' },
      { header: 'Address Line 1', accessorKey: 'addressLine1' },
      { header: 'Address Line 2', accessorKey: 'addressLine2' }
    ],
    data: departments
  }
  return (
    <div className='flex flex-col gap-6'>
      <Form />
      <SharedTable tableData={tableData} />
    </div>
  )
}

export default WorkLocationTab
