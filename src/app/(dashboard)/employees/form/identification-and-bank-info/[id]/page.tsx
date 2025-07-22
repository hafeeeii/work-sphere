import { getBusinessInfo } from '@/lib/business'
import { redirect } from 'next/navigation'
import IdentificationAndBankInfoEdit from '@/dashboard/employees/form/views/edit/identification-and-bank-info'
import React from 'react'
import prisma from '@/lib/prisma'

export default async function IdentificationAndBankInfoEditPage({ params }: { params: Promise<{ id: string }> }) {
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

  return <IdentificationAndBankInfoEdit employee={employee} />
}
