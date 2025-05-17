import React from 'react'
import EmployeeList from './views'

const EmployeeListPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string }>
}) => {
  const queryParams = await searchParams
  return <EmployeeList queryParams={queryParams} />
}

export default EmployeeListPage
