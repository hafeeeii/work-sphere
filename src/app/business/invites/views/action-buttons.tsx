'use client'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { Check, X } from 'lucide-react'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { acceptInvite, declineInvite } from './actions'
import { Badge } from '@/components/ui/badge'
import { InviteStatus } from '@prisma/client'

export default function ActionButtons({ id, status }: { id: string; status:InviteStatus}) {
  const [acceptState, acceptAction, acceptIsPending] = useActionState(acceptInvite, undefined)
  const [declineState, declineAction, declineIsPending] = useActionState(declineInvite, undefined)

  const state = acceptState || declineState

  useEffect(() => {
    if (state && state.message) {
      toast.error(state.message)
    }
  }, [state])

  const handleAccept = () => {
    const acceptActionWithId = acceptAction.bind(null, id)
    startTransition(() => acceptActionWithId())
  }

  const handleDecline = () => {
    const declineActionWithId = declineAction.bind(null, id)
    startTransition(() => declineActionWithId())
  }

  return (
    <div className='flex gap-2'>
      {status === 'PENDING' && (
        <>
          <LoadingButton isLoading={acceptIsPending} onClick={handleAccept} icon={<Check />}>
            Accept
          </LoadingButton>
          <LoadingButton variant={'outline'} isLoading={declineIsPending} onClick={handleDecline} icon={<X />}>
            Decline
          </LoadingButton>
        </>
      )}
      {status === 'ACCEPTED' && <Badge className='bg-green-100 text-green-500 hover:bg-green-100'>{status}</Badge>}
      {status === 'DECLINED' && <Badge className='bg-red-100 text-red-500 hover:bg-red-100'>{status}</Badge>}
    </div>
  )
}
