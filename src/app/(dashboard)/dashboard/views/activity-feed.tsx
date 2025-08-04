import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserPlus, Calendar, Mail, Building } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'join',
    user: 'Sarah Chen',
    action: 'joined the Marketing team',
    time: '2 hours ago',
    icon: UserPlus,
    color: 'text-success'
  },
  {
    id: 2,
    type: 'leave',
    user: 'Michael Rodriguez',
    action: 'submitted a leave request for Dec 25-29',
    time: '4 hours ago',
    icon: Calendar,
    color: 'text-warning'
  },
  {
    id: 3,
    type: 'invite',
    user: 'Emma Thompson',
    action: 'was invited to join Engineering',
    time: '6 hours ago',
    icon: Mail,
    color: 'text-info'
  },
  {
    id: 4,
    type: 'department',
    user: 'Alex Johnson',
    action: 'created new department: Data Science',
    time: '1 day ago',
    icon: Building,
    color: 'text-purple'
  },
  {
    id: 5,
    type: 'join',
    user: 'Lisa Wang',
    action: 'completed onboarding process',
    time: '2 days ago',
    icon: UserPlus,
    color: 'text-success'
  }
]

export const ActivityFeed = () => {
  return (
    <Card className='border-0 bg-card shadow-sm'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {activities.map(activity => (
          <div
            key={activity.id}
            className='flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-muted/50'
          >
            <div className={`rounded-full bg-muted p-2 ${activity.color}`}>
              <activity.icon className='h-4 w-4' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    <span className='font-semibold'>{activity.user}</span> {activity.action}
                  </p>
                  <p className='mt-1 text-xs text-muted-foreground'>{activity.time}</p>
                </div>
                <Avatar className='ml-3 h-8 w-8'>
                  <AvatarImage src='/placeholder.svg' alt={activity.user} />
                  <AvatarFallback className='bg-primary-light text-xs text-primary'>
                    {activity.user
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
