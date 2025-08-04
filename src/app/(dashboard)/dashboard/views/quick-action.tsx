'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, Mail, FileText, Calendar, Users, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

const actions = [
  {
    id: 1,
    title: 'Add Employee',
    description: 'Create new employee profile',
    icon: UserPlus,
    variant: 'outline' as const,
    href: '/employees/form/personal-details'
  },
  {
    id: 2,
    title: 'Send Invite',
    description: 'Invite new user',
    icon: Mail,
    variant: 'outline' as const,
    href: '/invite-user'
  },
  {
    id: 3,
    title: 'Generate Report',
    description: 'Create analytics report',
    icon: FileText,
    variant: 'outline' as const,
    href: '/'
  },
  {
    id: 4,
    title: 'Schedule Meeting',
    description: 'Book team meeting',
    icon: Calendar,
    variant: 'outline' as const,
    href: '/'
  },
  {
    id: 5,
    title: 'Manage Departments',
    description: 'Edit department',
    icon: Users,
    variant: 'outline' as const,
    href: '/settings'
  },
  {
    id: 6,
    title: 'Settings',
    description: 'Configure workspace',
    icon: Settings,
    variant: 'outline' as const,
    href: '/settings'
  }
]

export const QuickActions = () => {
  const router = useRouter()
  return (
    <Card className='border-0 bg-card shadow-sm'>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {actions.map(action => (
            <Button
              key={action.id}
              variant={action.variant}
              className='hover:bg-primary-light/20 h-auto justify-start space-x-3 p-4 transition-colors'
              onClick={() => router.push(action.href)}
            >
              <action.icon className='h-5 w-5 text-primary' />
              <div className='text-wrap text-left'>
                <p className='text-sm font-medium'>{action.title}</p>
                <p className='text-xs text-muted-foreground'>{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
