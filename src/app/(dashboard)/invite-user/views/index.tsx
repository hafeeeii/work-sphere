'use client'
import { SharedTable } from '@/components/shared-table'
import { checkPermission } from '@/lib/auth'
import { getInvite } from '@/services/invite'
import { Invite } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useBusinessUser } from '../../business-user-provider'
import { deleteInvite } from './action'
import Form from './form'

export default function UserInvite({ invites }: { invites: Invite[] }) {
  const [showForm, setShowForm] = React.useState(false)
  const [invite, setInvite] = React.useState<Invite | null>(null)

  const toggleForm = () => {
    setShowForm(!showForm)
    if (showForm) {
      setInvite(null)
    }
  }

  type TableData = {
    editMode: 'toggle' | 'redirect'
    visibleActions: ('details' | 'edit' | 'delete')[]
    columnData: {
      header: string
      accessorKey: keyof Invite
      sortable?: boolean
      filterable?: boolean
    }[]
    data: Invite[]
  }

  const tableData: TableData = {
    editMode: 'toggle',
    visibleActions: ['edit', 'delete'],
    columnData: [
      { header: 'Email', accessorKey: 'email', sortable: true, filterable: true },
      { header: 'Role', accessorKey: 'role' },
      { header: 'Status', accessorKey: 'status' }
      // { header: 'Invited By', accessorKey: 'invitedBy' }
    ],
    data: invites
  }

  const onEdit = async (id: string) => {
    if (!id) return null
    const invite = await getInvite(id)
    setInvite(invite)
    toggleForm()
  }

  const { businessUser } = useBusinessUser()

  let isAllowedToCreate = false
  let isAllowedToView = false

  if (businessUser) {
    if (checkPermission(businessUser, 'create', 'invite-user')) {
      isAllowedToCreate = true
    }

    if (checkPermission(businessUser, 'view', 'invite-user')) {
      isAllowedToView = true
    }
  }

  const router = useRouter()
  if (!isAllowedToView) {
    router.replace('/unauthorized')
    return null
  }

  return (
    <div className='mt-4 flex flex-col items-end gap-6'>
      {isAllowedToCreate && <Form showForm={showForm} invite={invite} toggleForm={toggleForm} />}
      <SharedTable tableData={tableData} onEdit={onEdit} onDelete={deleteInvite} />
    </div>
  )
}
