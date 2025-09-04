import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MySpaceTab from './tabs/my-space'
import TeamTab from './tabs/team'
import OrganizationTab from './tabs/organization'

export default function Home() {
  return (
    <div className='flex h-full w-full flex-col gap-6'>
      <Tabs defaultValue='mySpace' className='flex h-full flex-col'>
        <TabsList className='flex self-start'>
          {[
            { value: 'mySpace', label: 'My Space' },
            { value: 'team', label: 'Team' },
            { value: 'organization', label: 'Organization' }
          ].map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {[
          { value: 'mySpace', content: <MySpaceTab /> },
          { value: 'team', content: <TeamTab /> },
          { value: 'organization', content: <OrganizationTab /> }
        ].map(tab => (
          <TabsContent key={tab.value} value={tab.value} className='h-full'>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
