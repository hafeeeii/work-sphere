import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple'
}

// const variantStyles = {
//   default: 'bg-card hover:bg-card-hover',
//   success: 'bg-success-light hover:bg-success-light/80',
//   warning: 'bg-warning-light hover:bg-warning-light/80',
//   info: 'bg-info-light hover:bg-info-light/80',
//   purple: 'bg-purple-light hover:bg-purple-light/80'
// }

// const iconStyles = {
//   default: 'text-primary bg-primary-light',
//   success: 'text-success bg-success',
//   warning: 'text-warning bg-warning',
//   info: 'text-info bg-info',
//   purple: 'text-purple bg-purple'
// }

export const StatsCard = ({ title, value, icon: Icon, trend }: StatsCardProps) => {
  return (
    <Card className={`border-0 shadow-sm transition-all duration-200 `}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>{title}</p>
            <p className='text-3xl font-bold text-foreground'>{value}</p>
            {trend && <p className='text-xs text-muted-foreground'>{trend}</p>}
          </div>
          <div className={`rounded-xl p-3 `}>
            <Icon className='h-6 w-6' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
