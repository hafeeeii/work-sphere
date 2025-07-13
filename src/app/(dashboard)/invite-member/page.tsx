import React from 'react'
import MemberInvite from './views'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'

export default async function MemberInvitePage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams
  const { sortBy = 'email', sortOrder = 'desc', email, page = '0', pageSize = '10' } = queryParams

  const business = await getBusinessInfo()
  if (!business.status || !business.data?.businessId) {
    return null
  }

  const { businessId } = business.data

  const invites = await prisma.invite.findMany({
    skip: parseInt(page) * parseInt(pageSize),
    take: parseInt(pageSize),
    where: {
      tenantId: businessId,
      ...(email && { email: { contains: email } }),
      emailSent:true
    },
    orderBy: [
      {
        [sortBy]: sortOrder
      }
    ]
  })


  return <MemberInvite invites={invites} />
}
