import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LeaveBalanceTab from './tabs/leave-balance'
import LeaveRequestTab from './tabs/leave-request'
import LeaveSummaryTab from './tabs/leave-summary'

export default async function MyDataTab({ searchParams }: { searchParams: { [key: string]: string } }) {
  const tabs = [
    { tab: 'Leave Summary', content: <LeaveSummaryTab searchParams={searchParams} /> },
    { tab: 'Leave Balance', content: <LeaveBalanceTab /> },
    { tab: 'Leave Request', content: <LeaveRequestTab /> }

    // { tab: 'Holidays', content: '' }
  ]

  return (
    <Tabs defaultValue={tabs[0].tab} className='flex h-full flex-col'>
      <TabsList className='flex h-auto flex-wrap items-center justify-start space-y-1'>
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
  )
}
