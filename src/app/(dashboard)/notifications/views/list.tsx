import { cn } from '@/lib/utils'
import { Notification } from '@prisma/client'
import { Mail, Megaphone, Ticket, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type ListProps = {
  notif: Notification & {
    notificationRead: {
      readAt: Date
    }[]
  }
  index: number
}

export default function List({ notif, index }: ListProps) {
  const iconMap = {
    Ticket: <Ticket className='h-5 w-5 text-blue-500' />,
    Message: <Mail className='h-5 w-5 text-green-500' />,
    Team: <Users className='h-5 w-5 text-purple-500' />,
    Announcement: <Megaphone className='h-5 w-5 text-red-500' />
  }

  const status = notif.notificationRead.length > 0 ? 'read' : 'unread'
  return (
    <div
      className={cn(
        'w-full',
        status === 'unread' && 'bg-muted/70',
        status === 'unread' && index === 0 && 'rounded-t-lg',
        status === 'unread' && index === notif.notificationRead.length - 1 && 'rounded-b-lg'
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
