import React from 'react'
import EmploymentDetailsEdit from '@/app/(dashboard)/employees/form/views/edit/employment-details'
import { redirect } from 'next/navigation'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

export default async function EmploymentDetailsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const business = await getBusinessInfo()
  if (!business || !business.data) {
    redirect('/login')
  }

  const {
    data: { businessId: tenantId }
  } = business
  const departments = await prisma.department.findMany({
    where: { tenantId }
  })
  const designations = await prisma.designation.findMany({
    where: { tenantId }
  })
  const workLocations = await prisma.workLocation.findMany({
    where: { tenantId }
  })

  const managers = await prisma.employee.findMany({
    where: {
      tenantId,
      role: Role.MANAGER
    },
  })

  const employee = await prisma.employee.findUnique({
    where: {
      tenantId_id: {
        id: id,
        tenantId: business.data.businessId
      }
    }
  })

  if (!employee) {
    return <div>Employee not found</div>
  }

  return (
    <EmploymentDetailsEdit
      departments={departments}
      designations={designations}
      workLocations={workLocations}
      managers={managers}
      employee={employee}
    />
  )
}
