'use client'

import { useEffect, useState } from 'react'

import { Bell, BriefcaseBusiness, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { baseUrl, cn, getInitials } from '@/lib/utils'
import { getUnreadNotificationsCount } from '@/services/user'
import { TenantUser, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Badge } from './badge'
import { logout } from '@/app/(auth)/actions'

export function AccountMenu({
  tenantUser
}: {
  tenantUser:
    | (TenantUser & {
        user: User
      })
    | null
}) {
  const [notificationsCount, setNotificationsCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      getUnreadNotificationsCount().then(count => {
        console.log(count,'this is log')
        setNotificationsCount(count ?? 0)
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const user = tenantUser?.user

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='size-9 cursor-pointer rounded-lg'>
          <AvatarImage src={undefined} alt={user.name} />
          <AvatarFallback className='rounded-lg'>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-56 space-y-1 rounded-lg' side='bottom' align='end' sideOffset={4}>
        <DropdownMenuItem key={user.email} className={cn('p-0')}>
          <div className='flex w-full items-center justify-between gap-2 px-1 py-1.5'>
            <Avatar className='size-9 rounded-lg'>
              <AvatarImage src={undefined} alt={user.name} />
              <AvatarFallback className='rounded-lg'>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{user.name}</span>
              <span className='truncate text-xs capitalize'>{tenantUser.role.toLocaleLowerCase()}</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => router.push(`${baseUrl}/business`)} className='cursor-pointer'>
            <BriefcaseBusiness />
            Business
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => router.push(`/notifications`)} className='relative cursor-pointer'>
            <Bell />
            Notifications
            <Badge className='absolute right-2 h-5 min-w-5 rounded-full font-mono tabular-nums' variant='destructive'>
              {notificationsCount}
            </Badge>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
