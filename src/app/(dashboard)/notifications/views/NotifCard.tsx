import { cn } from '@/lib/utils'
import { Notification } from '@prisma/client'
import { Hand, Mail, Megaphone, Ticket, Users } from 'lucide-react'
import Link from 'next/link'

type NotifCardProps = {
  notif: Notification & {
    notificationsRead: {
      readAt: Date
    }[]
  }
  index: number
}

export default function NotifCard({ notif, index }: NotifCardProps) {
  const iconMap = {
    TICKET: <Ticket className='h-5 w-5 text-blue-500' />,
    MESSAGE: <Mail className='h-5 w-5 text-green-500' />,
    TEAM: <Users className='h-5 w-5 text-purple-500' />,
    ANNOUNCEMENT: <Megaphone className='h-5 w-5 text-red-500' />,
    REQUEST: <Hand className='h-5 w-5 text-yellow-500' />,
  }

  const status = notif.notificationsRead.length > 0 ? 'read' : 'unread'
  return (
    <div
      className={cn(
        'w-full',
        status === 'unread' && 'bg-muted/70',
        status === 'unread' && index === 0 && 'rounded-t-lg',
        status === 'unread' && index === notif.notificationsRead.length - 1 && 'rounded-b-lg'
      )}
    >
      <Link href={'/'}>
        <div className='flex items-start gap-4 px-4 py-4'>
          <div>{iconMap[notif.type]}</div>
          <div className='flex-1'>
            <p className='font-medium leading-none'>{notif.title}</p>
            <p className='text-sm text-muted-foreground'>{notif.message}</p>
          </div>
          <div className='whitespace-nowrap text-right text-sm'>
            <div>{notif.createdAt.toLocaleDateString()}</div>
          </div>
        </div>
      </Link>
    </div>
  )
}
