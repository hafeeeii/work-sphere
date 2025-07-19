import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MyDataTab from './tabs/my-data'
import OrganizationTab from './tabs/organization'
import HolidaysTab from './tabs/holidays'

const Leaves = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const tabs = [
    { tab: 'My Data', content: <MyDataTab searchParams={searchParams} /> },
    { tab: 'Organization', content: <OrganizationTab /> },
    { tab: 'Holidays', content: <HolidaysTab/> }
  ]

  return (
    <div className='h-full rounded-lg border p-4'>
      <Tabs defaultValue={tabs[0].tab} className='h-full'>
        <TabsList className='grid w-full grid-cols-3'>
          {tabs.map(tab => (
            <TabsTrigger key={tab.tab} value={tab.tab}>
              {tab.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.tab} value={tab.tab} className='h-full'>
            <div className='h-full '>{tab.content}</div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default Leaves
