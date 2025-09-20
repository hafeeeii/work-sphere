import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { checkPermission } from '@/lib/authz'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import HolidaysTab from './tabs/holidays'
import MyDataTab from './tabs/my-data'
import OrganizationTab from './tabs/organization'

const Leaves = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
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

  let isAllowedToViewMyData = false

  if (tenantUser) {
    if (checkPermission(tenantUser, 'view', 'leave-my-data')) {
      isAllowedToViewMyData = true
    }
  }

  const tabs = [
    ...(isAllowedToViewMyData ? [{ tab: 'My Data', content: <MyDataTab searchParams={searchParams} /> }] : []),
    { tab: 'Organization', content: <OrganizationTab /> },
    { tab: 'Holidays', content: <HolidaysTab /> }
  ]

  return (
    <div className='h-[calc(100vh-120px)] w-full'>
      <Tabs defaultValue={tabs[0].tab} className='flex h-full flex-col'>
        <TabsList className='self-start'>
          {tabs.map(tab => (
            <TabsTrigger key={tab.tab} value={tab.tab}>
              {tab.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='h-full overflow-y-auto'>
          {tabs.map(tab => (
            <TabsContent key={tab.tab} value={tab.tab}>
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}

export default Leaves
