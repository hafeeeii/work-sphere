import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getBusinessInfo } from '@/lib/business'
import { redirect } from 'next/navigation'
import ActivitiesTab from './tabs/activities'
import ApprovalsTab from './tabs/approvals'
import LeaveTab from './tabs/leave'
import ProfileTab from './tabs/profile'

export default async function OverviewTab() {
  const business = await getBusinessInfo()
  if (!business || !business.data) {
    redirect('/login')
  }
  const { role, userName } = business.data

  return (
    <div className='flex h-full w-full gap-4'>
      {/* left */}
      <Card className='h-full w-full max-w-[20%]'>
        <CardContent className='flex h-full w-full flex-col items-center'>
          <Avatar className='h-[100px] w-[100px]'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h4 className='mt-2 text-sm'>{userName}</h4>
          <p className='text-xs text-muted-foreground'>{role}</p>

          <Separator orientation='horizontal' className='my-2' />
        </CardContent>
      </Card>

      {/* right */}

      <Card className='h-full w-full'>
        <CardContent className='flex w-full flex-col gap-6'>
          <Tabs defaultValue='activities'>
            <TabsList>
              {[
                { value: 'activities', label: 'Activities' },
                { value: 'approvals', label: 'Approvals' },
                { value: 'leave', label: 'Leave' },
                { value: 'profile', label: 'Profile' }
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Separator orientation='horizontal' className='mt-2 w-full' />
            {[
              { value: 'activities', content: <ActivitiesTab /> },
              { value: 'approvals', content: <ApprovalsTab /> },
              { value: 'leave', content: <LeaveTab /> },
              { value: 'profile', content: <ProfileTab /> }
            ].map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
