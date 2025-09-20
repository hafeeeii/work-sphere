import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { checkPermission } from '@/lib/authz'
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
    <Tabs defaultValue={tabs[0].tab} className='flex h-full flex-col overflow-hidden'>
      <TabsList className='self-start'>
        {tabs.map(tab => (
          <TabsTrigger key={tab.tab} value={tab.tab}>
            {tab.tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className='h-full'>
        {tabs.map(tab => (
          <TabsContent key={tab.tab} value={tab.tab} className='h-full'>
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
