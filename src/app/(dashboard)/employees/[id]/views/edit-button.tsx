'use client'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { Button } from '@/components/ui/button'
import { checkPermission } from '@/lib/auth'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EditButton({ path }: { path: string }) {
  const router = useRouter()
  const { businessUser } = useBusinessUser()

  let isAllowedToEdit = false

  if (businessUser) {
    if (checkPermission(businessUser, 'update', 'employee')) {
      isAllowedToEdit = true
    }
  }

  return isAllowedToEdit && (
    <Button size={'icon'} variant={'ghost'} onClick={() => router.push(path)}>
      <Pencil className='h-4 w-4' />
    </Button>
  )
}
