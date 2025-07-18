'use client'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { Check, X } from 'lucide-react'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { approveLeave, rejectLeave } from './actions'

export default function ActionButtons({ id }: { id: string; }) {
  const [approveState, approveAction, approveIsPending] = useActionState(approveLeave, undefined)
  const [rejectState, rejectAction, rejectIsPending] = useActionState(rejectLeave, undefined)

  const state = approveState || rejectState

  useEffect(() => {
    if (state && state.message) {
      toast.error(state.message)
    }
  }, [state])

  const handleAccept = () => {
    const acceptActionWithId = approveAction.bind(null, id)
    startTransition(() => acceptActionWithId())
  }

  const handleDecline = () => {
    const declineActionWithId = rejectAction.bind(null, id)
    startTransition(() => declineActionWithId())
  }

  return (
    <div className='flex gap-2'>
      <>
        <LoadingButton isLoading={approveIsPending} onClick={handleAccept} icon={<Check />}>
          Approve
        </LoadingButton>
        <LoadingButton variant={'outline'} isLoading={rejectIsPending} onClick={handleDecline} icon={<X />}>
          Reject    
        </LoadingButton>
      </>
    </div>
  )
}
