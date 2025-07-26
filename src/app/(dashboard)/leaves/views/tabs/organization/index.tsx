import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { checkPermission } from '@/lib/auth'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import OnLeaveTab from './tabs/on-leave'
import PendingRequestTab from './tabs/pending-request'

export default async function OrganizationTab() {
  const business = await getBusinessInfo()
  if (!business || !business.data) {
    redirect('/login')
  }

  const tenantUser = await prisma.tenantUser.findUnique({
    where: {
      userId_tenantId: {
        tenantId: business.data.businessId,
        userId: business.data.userId
      }
    }
  })

  let isAllowedToViewPendingRequest = false

  if (tenantUser) {
    if (checkPermission(tenantUser, 'view', 'leave-pending-request')) {
      isAllowedToViewPendingRequest = true
    }
  }

  const tabs = [
    { tab: 'On Leave', content: <OnLeaveTab /> },
    ...(isAllowedToViewPendingRequest ? [{ tab: 'Pending Request', content: <PendingRequestTab /> }] : [])

    // { tab: 'Holidays', content: '' }
  ]

  return (
    <div className='flex flex-col gap-4'>
      <Tabs defaultValue={tabs[0].tab}>
        <TabsList className='grid w-full grid-cols-2'>
          {tabs.map(tab => (
            <TabsTrigger key={tab.tab} value={tab.tab}>
              {tab.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.tab} value={tab.tab}>
            <div className='h-full'>{tab.content}</div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
