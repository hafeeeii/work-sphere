import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cookies } from 'next/headers'
import { decrypt, User } from '@/lib/session'
import { getUser } from '@/services/user'
import { BusinessList } from './business-list'
import { getBusinessInfo } from '@/lib/business'
import SetBusinessCookie from './set-business-cookie'
import { Loader } from 'lucide-react'
import prisma from '@/lib/prisma'
import { InviteStatus } from '@prisma/client'

const Business = async () => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value

  if (!cookie) {
    return (
      <Card>
        <CardContent>
          <p>Please login to create a business.</p>
        </CardContent>
      </Card>
    )
  }

  const session = await decrypt(cookie)

  if (!(session as User).userId) {
   return null
  }

  const user = await getUser((session as User).userId)
  const business = await getBusinessInfo()

  const hasPendingInvites = await prisma.invite.count({
    where: {
     email: user?.email,
     status:InviteStatus.PENDING
    }
  })

  return (
    <div className='p-4'>
      {business.status ? (
        <div className='flex h-screen w-full flex-col items-center justify-center'>
          <Loader className='animate-spin' />
          <h1 className='mt-4 text-2xl font-bold'>Setting up your business</h1>
        </div>
      ) : (
        <BusinessList businesses={user?.tenantUsers} hasPendingInvites={hasPendingInvites > 0}/>
      )}
      {business.data && <SetBusinessCookie businessId={business.data?.businessId} />}
    </div>
  )
}

export default Business
