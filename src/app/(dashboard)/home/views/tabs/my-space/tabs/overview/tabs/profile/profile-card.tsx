import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

interface ProfileCardProps {
  title: string
  list: Array<{ label: string; value?: string | null }>
  maxRows: number
}

const rowClasses: Record<number, string> = {
  1: 'grid-rows-1',
  2: 'grid-rows-2',
  3: 'grid-rows-3',
  4: 'grid-rows-4',
  5: 'grid-rows-5'
}

export default function ProfileCard({ title, list, maxRows }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent className={cn('grid grid-flow-row grid-cols-2 gap-y-2', rowClasses[maxRows] || 'grid-rows-3')}>
        {list.map((item, idx) => (
          <div key={idx} className='flex text-xs'>
            <p className='w-1/3 text-muted-foreground'>{item.label}</p>
            <p>{item.value ? item.value : "-"} </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
