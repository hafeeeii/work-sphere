import { AppSidebar } from '@/components/app-sidebar'
import { AccountMenu } from '@/components/ui/account-menu'
import { SearchDialog } from '@/components/ui/search-dialog'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { deleteSession } from '@/lib/session'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BusinessUserProvider } from './business-user-provider'

export const metadata: Metadata = {
  title: 'WorkSphere',
  description: 'A workspace-centric management tool'
}

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const business = await getBusinessInfo()
  if (!business || !business.data) {
    redirect('/login')
  }
  const { businessId, userId } = business?.data
  const tenantUser = await prisma.tenantUser.findUnique({
    where: {
      userId_tenantId: {
        tenantId: businessId,
        userId
      }
    },
    include: {
      user: true
    }
  })

  if (!tenantUser) {
    deleteSession()
    redirect('/login')
  }

  return (
    <BusinessUserProvider businessUser={tenantUser}>
      <SidebarProvider className='flex h-screen w-screen min-h-screen overflow-x-hidden'>
        <AppSidebar />

        <div className='flex h-full w-full flex-col bg-background'>
          <header className='flex h-12 w-full shrink-0 items-center gap-2 border-b ease-linear'>
            <div className='flex w-full items-center justify-between px-4 lg:px-6'>
              <div className='flex items-center gap-1 lg:gap-2'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation='vertical' className='mx-2' />
                <SearchDialog />
              </div>
              <div className='flex items-center gap-2'>
                <ThemeSwitcher />
                <AccountMenu tenantUser={tenantUser} />
              </div>
            </div>
          </header>
          <div className='min-h-[calc(100%-48px)]  p-4'>
            <div className='border h-full rounded-md p-4'> 
           {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </BusinessUserProvider>
  )
}
