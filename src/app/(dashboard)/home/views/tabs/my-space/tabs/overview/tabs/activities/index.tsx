import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getBusinessInfo } from '@/lib/business'
import React from 'react'

export default async function ActivitiesTab() {
  const {data} = await getBusinessInfo()

  if (!data) return null
  
  return (
    <div className='h-full'>
      <div className='h-20 w-full rounded-sm flex gap-4 items-center border bg-card px-2'>
        <Avatar className='h-[50px] w-[50px]'>
          <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div>
          <h4 className='text-sm'>Good Evening {data.userName}</h4>
          <p className='text-xs text-muted-foreground'>Have a productive day!</p>
        </div>
      </div>
    </div>
  )
}
