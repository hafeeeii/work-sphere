import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { checkPermission } from '@/lib/auth'
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
    <div >

      <Tabs defaultValue={tabs[0].tab} className='h-full'>
        <TabsList>
          {tabs.map(tab => (
            <TabsTrigger key={tab.tab} value={tab.tab}>
              {tab.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.tab} value={tab.tab} className='h-full'>
            <div className='h-full'>{tab.content}</div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default Leaves
