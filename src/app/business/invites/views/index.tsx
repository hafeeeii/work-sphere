import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import BackButton from '@/components/ui/buttons/back-button'
import prisma from '@/lib/prisma'
import { getValidSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import ActionButtons from './action-buttons'

export default async function Invites() {
  const session = await getValidSession()

  if (!session.status) {
    return redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.data?.userId
    }
  })

  if (!user) {
    return redirect('/login')
  }

  const invites = await prisma.invite.findMany({
    where: {
      email: user.email,
    },
    include: {
      tenant: true,
      inviter: true
    }
  })

  return (
    <div className='mx-auto max-w-5xl p-6'>
      <div className='mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-bold'>Pending Invites</h1>
          <p className='text-sm text-muted-foreground'>View and manage your pending invitations to join businesses</p>
        </div>

        <BackButton className='self-end sm:self-auto' path='/business' />
      </div>

      <div className='space-y-4'>
        {invites && invites.length > 0 ? (
          invites.map((val, idx) => (
            <div
              key={idx}
              className='flex flex-col items-center justify-between gap-4 rounded-lg border px-4 py-4 shadow-sm sm:flex-row'
            >
              <div className='flex gap-4 self-start sm:self-auto'>
                <Avatar>
                  <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className='flex-1'>
                  <p className='text-base font-medium'>{val.tenant.name}</p>
                  <p className='text-sm text-muted-foreground'>Invited by {val.inviter.name}</p>
                </div>
              </div>
              <div className='self-end sm:self-auto'>
                <ActionButtons id={val.id} status={val.status} />
              </div>
            </div>
          ))
        ) : (
          <div className='flex items-center justify-center'>
            <p className='mt-10 text-sm text-muted-foreground'>You have no pending invites</p>
          </div>
        )}
      </div>
    </div>
  )
}
