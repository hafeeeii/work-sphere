import React from 'react'
import EmployeeDetails from './views'

export default async function EmployeeDetailsPage({params}:{params:Promise<{id:string}>}) {
  const id = (await params).id
  return (
    <EmployeeDetails id={id}/>
  )
}
