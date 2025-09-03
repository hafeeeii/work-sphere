'use client'
import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { Input } from '@/components/ui/input'
import { CheckCheck, Settings } from 'lucide-react'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { markAllAsRead } from './actions'

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
      <div className='mb-6 flex flex-col items-center justify-between lg:flex-row lg:gap-60 gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>Notifications</h1>
          <p className='text-sm text-muted-foreground'>Stay updated with your latest activities and messages </p>
        </div>
        <div className='flex gap-2 self-end'>
          <Button variant='outline'>
            <Settings />
            Settings
          </Button>
          <LoadingButton onClick={handleMarkAsRead} isValid={status} isLoading={isPending} icon={<CheckCheck />}>
            Mark All as Read
          </LoadingButton>
        </div>
      </div>

      <Input placeholder='Search notifications...' className='mb-4' />
    </div>
  )
}

export default Header
