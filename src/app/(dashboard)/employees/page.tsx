import { getEmployees } from '@/services/employee'
import { cookies } from 'next/headers'
import EmployeeList from './views'

const EmployeeListPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) => {
  const queryParams = await searchParams
  const employees = await getEmployees((await cookies()).toString(), queryParams)

  return <EmployeeList employees={employees} />
}

export default EmployeeListPage
