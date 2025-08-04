import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cookies } from 'next/headers'
import { decrypt, User } from '@/lib/session'
import { getUser } from '@/services/user'
import { BusinessList } from './business-list'
import { getBusinessInfo } from '@/lib/business'
import SetBusinessCookie from './set-business-cookie'

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
    return (
      <Card>
        <CardContent>
          <p>Please login to create a business.</p>
        </CardContent>
      </Card>
    )
  }

  const user = await getUser((session as User).userId)
  const business = await getBusinessInfo()
  

  return (
    <div className='p-4'>
      <BusinessList businesses={user?.tenantUsers} />
      {business.data && (
      <SetBusinessCookie businessId={business.data?.businessId}/>
      )}
    </div>
  )
}

export default Business
