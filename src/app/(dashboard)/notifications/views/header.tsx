'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { startTransition, useActionState, useEffect } from 'react'
import { markAllAsRead } from './actions'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'

function Header({ status }: { status: boolean }) {
  const [state, action, isPending] = useActionState(markAllAsRead, undefined)

  useEffect(() => {
    if (state?.message) {
      if (state.status) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  const handleMarkAsRead = () => {
    startTransition(() => action())
  }
  return (
    <div>
      <div className='mb-6 flex flex-col items-center justify-between sm:flex-row'>
        <div>
          <h1 className='text-2xl font-bold'>Notifications</h1>
          <p className='text-sm text-muted-foreground'>Stay updated with your latest activities and messages </p>
        </div>
        <div className='flex gap-2 self-end'>
          <Button variant='outline'>Settings</Button>
          <Button disabled={isPending || status} onClick={handleMarkAsRead}>
            {isPending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            Mark All as Read
          </Button>
        </div>
      </div>

      <Input placeholder='Search notifications...' className='mb-4' />
    </div>
  )
}

export default Header
