'use client'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EditButton({ path }: { path: string }) {
  const router = useRouter()
  return (
    <Button size={'icon'} variant={'ghost'} onClick={() => router.push(path)}>
      <Pencil className='h-4 w-4' />
    </Button>
  )
}
