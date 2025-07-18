import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LeaveSummaryTab from './tabs/leave-summary'
import LeaveBalanceTab from './tabs/leave-balance'
import LeaveRequestTab from './tabs/leave-request'


export default async function MyDataTab({searchParams}:{searchParams:{[key:string]:string}}) {
  const tabs = [
    { tab: 'Leave Summary', content: <LeaveSummaryTab searchParams={searchParams}/> },
    { tab: 'Leave Balance', content: <LeaveBalanceTab /> },
    { tab: 'Leave Request', content: <LeaveRequestTab /> },

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
            <Card>
              <CardContent className='py-2'>{tab.content}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
