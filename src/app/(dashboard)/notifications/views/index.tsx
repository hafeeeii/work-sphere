import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Header from './header'
import NotifCard from './NotifCard'

// const notifications = [
//   {
//     title: 'New Ticket Assigned',
//     description: 'You have been assigned to ticket #1234 - Website Redesign',
//     type: 'Ticket',
//     time: '5 minutes ago',
//     status: 'unread'
//   },
//   {
//     title: 'New Message',
//     description: 'Sarah Johnson sent you a message in the Website Redesign project',
//     type: 'Message',
//     time: '1 hour ago',
//     status: 'unread'
//   },
//   {
//     title: 'Team Update',
//     description: 'New team member John Smith has joined the project',
//     type: 'Team',
//     time: '2 hours ago',
//     status: 'read'
//   },
//   {
//     title: 'Ticket Status Update',
//     description: 'Ticket #1235 - Bug Fix has been marked as completed',
//     type: 'Ticket',
//     time: '3 hours ago',
//     status: 'read'
//   },
//   {
//     title: 'New Message',
//     description: 'Michael Brown mentioned you in a comment on ticket #1236',
//     type: 'Message',
//     time: '5 hours ago',
//     status: 'read'
//   },
//   {
//     title: 'Team Update',
//     description: 'Project deadline has been updated to June 15, 2024',
//     type: 'Team',
//     time: '1 day ago',
//     status: 'read'
//   },
//   {
//     title: 'New Ticket Created',
//     description: 'A new ticket has been created: #1237 - API Integration',
//     type: 'Ticket',
//     time: '1 day ago',
//     status: 'read'
//   },
//   {
//     title: 'New Message',
//     description: 'Emily Davis shared a document in the Website Redesign project',
//     type: 'Message',
//     time: '2 days ago',
//     status: 'read'
//   },
//   {
//     title: 'New Ticket Created',
//     description: 'A new ticket has been created: #1237 - API Integration',
//     type: 'Ticket',
//     time: '1 day ago',
//     status: 'read'
//   },
//   {
//     title: 'New Message',
//     description: 'Emily Davis shared a document in the Website Redesign project',
//     type: 'Message',
//     time: '2 days ago',
//     status: 'read'
//   },
//   {
//     title: 'New Ticket Created',
//     description: 'A new ticket has been created: #1237 - API Integration',
//     type: 'Ticket',
//     time: '1 day ago',
//     status: 'read'
//   },
//   {
//     title: 'New Message',
//     description: 'Emily Davis shared a document in the Website Redesign project',
//     type: 'Message',
//     time: '2 days ago',
//     status: 'read'
//   }
// ] as const

export default async function Notifications() {
  const business = await getBusinessInfo()

  if (!business.status || !business.data) {
    return null
  }

  const { businessId, userId, role } = business?.data

  if (!businessId || !userId) {
    return redirect('/login')
  }

  const notifications = await prisma.notification.findMany({
    where: {
      tenantId: businessId,
      OR: [
        { userId: userId },
        {
          AND: [
            {
              userId: null,
              targetRoles: { has: role }
            }
          ]
        }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      notificationsRead: {
        where: {
          userId
        },
        select: {
          readAt: true
        }
      }
    }
  })

  const hasItems = notifications.length > 0

  const markAllAsReadStatus = notifications.every((notif) => notif.notificationsRead.length > 0)

  return (
    <div className='mx-auto max-w-5xl p-6'>
      <Header status={!markAllAsReadStatus}/>

      {hasItems ? (
        <div className='divide-y rounded-lg border'>
          {notifications.map((notifications, idx) => (
            <NotifCard notif={notifications} key={idx} index={idx} />
          ))}
        </div>
      ) : (
        <div className='flex h-40 items-center justify-center'>
          <p className='text-sm text-muted-foreground'>No notifications found</p>
        </div>
      )}
    </div>
  )
}
