import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OnLeaveTab from './tabs/on-leave'
import PendingRequestTab from './tabs/pending-request'

export default async function OrganizationTab() {
  const tabs = [
    { tab: 'On Leave', content: <OnLeaveTab /> },
    { tab: 'Pending Request', content: <PendingRequestTab /> }

    // { tab: 'Holidays', content: '' }
  ]

  return (
    <div className='flex flex-col gap-4'>
      <Tabs defaultValue={tabs[0].tab}>
        <TabsList className='grid w-full grid-cols-3'>
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
