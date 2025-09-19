import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OverviewTab from './tabs/overview'

export default function MySpaceTab() {
  return (
    <div className='flex h-full w-full flex-col gap-6'>
      <Tabs defaultValue='overview' className='flex h-full flex-col'>
        <TabsList className='flex self-start'>
          {[
            { value: 'overview', label: 'Overview' },
            { value: 'dashboard', label: 'Dashboard' }
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {[{ value: 'overview', content: <OverviewTab /> }].map(tab => (
          <TabsContent key={tab.value} value={tab.value} className='h-[calc(100%-50px)] '>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
