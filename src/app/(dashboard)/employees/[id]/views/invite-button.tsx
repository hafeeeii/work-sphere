'use client'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { Card, CardContent } from '@/components/ui/card'
import { Employee } from '@prisma/client'
import { Send } from 'lucide-react'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { inviteEmployee } from './actions'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { checkPermission } from '@/lib/auth'

export default function InviteButton({
  employee,
  hasNotBeenInvited
}: {
  employee: Employee & {
    workLocationMeta: {
      state: string
      city: string
    }
    departmentMeta: {
      name: string
    }
    designationMeta: {
      name: string
    }
  }
  hasNotBeenInvited: boolean
}) {
  const [inviteState, inviteAction, isInvitePending] = useActionState(inviteEmployee, undefined)

  useEffect(() => {
    if (inviteState?.message) {
      if (inviteState.status) {
        toast.success(inviteState.message)
      } else {
        toast.error(inviteState.message)
      }
    }
  }, [inviteState])

  const handleInvite = () => {
    const formData = new FormData()
    Object.keys(employee).forEach(key => {
      const value = employee[key as keyof typeof employee]
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString())
      }
    })

    startTransition(() => inviteAction(formData))
  }

  const { businessUser } = useBusinessUser()

  let isAllowedToEdit = false

  if (businessUser) {
    if (checkPermission(businessUser, 'update', 'employee')) {
      isAllowedToEdit = true
    }
  }

  return (
    hasNotBeenInvited &&
    isAllowedToEdit && (
      <Card>
        <CardContent className='flex items-center justify-between py-4'>
          <p className='text-sm'>
            {' '}
            An invitation has not been sent to this employee yet. Click the &quot;Invite&quot; button to send now
          </p>
          <LoadingButton onClick={handleInvite} isLoading={isInvitePending} icon={<Send />}>
            Invite
          </LoadingButton>
        </CardContent>
      </Card>
    )
  )
}
