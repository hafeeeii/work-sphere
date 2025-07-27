'use client'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Avatar } from '@radix-ui/react-avatar'
import { useRouter } from 'next/navigation'

export default function ReporteesCard({
  employee
}: {
  employee: {
    id: string
    name: string
    designationMeta: {
      name: string
    }
  }
}) {
  const router = useRouter()
  return (
    <div className='flex gap-4 rounded-lg border bg-card px-2 py-3 hover:cursor-pointer' onClick={() => router.push(`/employees/${employee.id}`)}>
      <Avatar className='h-[50px] w-[50px] overflow-hidden rounded-full'>
        <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='flex flex-col'>
        <h4>{employee.name}</h4>
        <p className='text-sm opacity-40'>{employee.designationMeta?.name}</p>
      </div>
    </div>
  )
}
