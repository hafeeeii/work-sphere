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
    <Tabs defaultValue={tabs[0].tab} className='h-full flex flex-col '>
      <TabsList className='self-start'>
        {tabs.map(tab => (
          <TabsTrigger key={tab.tab} value={tab.tab}>
            {tab.tab}
          </TabsTrigger>
        ))}
      </TabsList>
     <div className='h-full overflow-y-auto'>
       {tabs.map(tab => (
        <TabsContent key={tab.tab} value={tab.tab} className='h-full'>
          {tab.content}
        </TabsContent>
      ))}
     </div>
    </Tabs>
  )
}
