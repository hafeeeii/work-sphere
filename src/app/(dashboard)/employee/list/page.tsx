import React from 'react'
import EmployeeList from './views'
import { getDepartments } from '@/services/department'
import { getDesignations } from '@/services/designation'
import { getWorkLocations } from '@/services/work-location'
import { getEmployees } from '@/services/employee'

const EmployeeListPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) => {
  const queryParams = await searchParams
  const employees = await getEmployees(queryParams)
  const departments = await getDepartments()
  const designations = await getDesignations()
  const workLocations = await getWorkLocations()


  return <EmployeeList employees={employees} departments={departments} designations={designations} workLocations={workLocations} />
}

export default EmployeeListPage
