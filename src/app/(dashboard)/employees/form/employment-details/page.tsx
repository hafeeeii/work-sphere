import React from 'react'
import prisma from '@/lib/prisma'
import { getBusinessInfo } from '@/lib/business'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import EmploymentDetails from '@/app/(dashboard)/employees/form/views/steps/employment-details'
export default async function EmploymentDetailsPage() {
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

  const managers = await prisma.tenantUser.findMany({
    where:{
      tenantId,
      role:Role.MANAGER
    },
    include:{
      user:true
    }
  })

  return <EmploymentDetails managers={managers} departments={departments} designations={designations} workLocations={workLocations} />
}
