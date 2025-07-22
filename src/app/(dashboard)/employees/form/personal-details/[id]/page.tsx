import React from 'react'
import PersonalDetailsEdit from '@/app/(dashboard)/employees/form/views/edit/personal-details'
import prisma from '@/lib/prisma'
import { getBusinessInfo } from '@/lib/business'
import { redirect } from 'next/navigation'
export default async function PersonalDetailsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const business = await getBusinessInfo()
  if (!business || !business.data) {
    redirect('/login')
  }
  const employee = await prisma.employee.findUnique({
    where: {
      tenantId_id: {
        id,
        tenantId: business.data.businessId
      }
    }
  })

  if (!employee) {
    return <div>Employee not found</div>
  }

  return <PersonalDetailsEdit employee={employee} />
}
