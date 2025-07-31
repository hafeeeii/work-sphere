'use client'
import { Button } from '@/components/ui/button'
import Typography from '@/components/ui/typography'
import { TenantUserWithRelations } from '@/lib/types'
import { protocol, rootDomain } from '@/lib/utils'
import { Building2, LogOut, Mailbox, Users } from 'lucide-react'
import AddBusiness from './add-business'
import { BusinessCard } from './business-card'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/(auth)/actions'

export function BusinessList(props: { businesses?: TenantUserWithRelations[] }) {
  const businesses = props.businesses?.map(item => ({
    ...item,
    tenant: {
      ...item.tenant,
      subdomain: item.tenant.subdomain ? `${protocol}://${item.tenant.subdomain}.${rootDomain}` : ''
    }
  }))

  const handleRedirectToBusiness = async (domain: string) => {
    if (!domain) return
    const achorElem = document.createElement('a')
    achorElem.href = domain
    achorElem.target = '_blank'
    achorElem.rel = 'noopener noreferrer'
    achorElem.click()
  }

  const router = useRouter()

  return (
    <div className='min-h-screen'>
      <div className='border-b'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          {/* Header Content */}

          <div className='flex h-24 flex-col items-center sm:h-16 sm:justify-between md:flex-row gap-4'>
            <div className='flex items-center space-x-3 self-start sm:self-auto'>
              <Typography variant='h5'>Business Dashboard</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant={'outline'} onClick={() => router.push('/business/invites')}>
                <Mailbox size={10} />
                Pending Invites
              </Button>
              <AddBusiness />
              <Button
                onClick={() => logout()}
                variant={'outline'}
                size={'icon'}
                className='bg-destructive/20 hover:bg-destructive'
              >
                <LogOut />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Stats */}
        <div className='mb-8'>
          <div className='flex items-center space-x-2'>
            <Users className='h-5 w-5' />
            <span className='text-sm font-medium'>
              You have access to {businesses && businesses.length} business
              {businesses && businesses.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {/* Business Grid */}
        {businesses && businesses.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {businesses.map((business, index) => (
              <BusinessCard key={index} business={business} onRedirect={handleRedirectToBusiness} />
            ))}
          </div>
        ) : (
          <div className='py-12 text-center'>
            <Building2 className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <h3 className='mb-2 text-lg font-medium text-gray-600'>No businesses yet</h3>
            <p className='mb-6 text-gray-500'>Get started by adding your first business</p>
          </div>
        )}
      </div>
    </div>
  )
}
