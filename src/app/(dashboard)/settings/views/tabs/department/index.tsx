import { getDepartments } from '@/services/department'
import React from 'react'
import Form from './form'
import { SharedTable } from '@/components/shared-table'
import { Department } from '@/generated/prisma'


  type TableData = {
    columnData:{
      header: string,
      accessorKey: keyof Department,
    }[],
    data: Department[]
  }
  
const DepartmentTab = async () => {
  const departments = await getDepartments()
  const tableData:TableData = {
    columnData: [
      { header: "Name", accessorKey: "name" },
      { header: "Code", accessorKey: "code" },  
      { header: "Description", accessorKey: "description" },
      { header: "Total Employees", accessorKey: "totalEmployees" },
    ],
    data: departments,
  };
  return (
    <div className="flex flex-col gap-6">
    <Form />
   <SharedTable tableData={tableData} />
 </div>
  )
}

export default DepartmentTab