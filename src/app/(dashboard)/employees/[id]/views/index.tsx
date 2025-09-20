import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getBusinessInfo } from '@/lib/business'
import prisma from '@/lib/prisma'
import { Mail, Phone } from 'lucide-react'
import { redirect } from 'next/navigation'
import InviteButton from './invite-button'
import ProfileTab from './tabs/profile'
import Reportees from './tabs/reportees'
import BackButton from '@/components/ui/buttons/back-button'
import { Card, CardContent } from '@/components/ui/card'
import { checkPermission } from '@/lib/authz'

export default async function EmployeeDetails({ id }: { id: string }) {
  const business = await getBusinessInfo()
  if (!business || !business.data) {
    redirect('/login')
  }

  const { email, businessId, userId, role } = business.data

  const tenantUser = { email, role, tenantId: businessId, userId }

  let isAllowedToView = false
  if (checkPermission(tenantUser, 'view', 'dashboard')) {
    isAllowedToView = true
  }

  if (!isAllowedToView) {
    redirect('/unauthorized')
  }

  const employee = await prisma.employee.findUnique({
    where: {
      tenantId_id: {
        id,
        tenantId: businessId
      }
    },
    include: {
      designationMeta: {
        select: {
          name: true
        }
      },
      workLocationMeta: {
        select: {
          state: true,
          city: true
        }
      },
      departmentMeta: {
        select: {
          name: true
        }
      },
      reportingManager: {
        select: {
          name: true
        }
      }
    }
  })

  const reportees = await prisma.employee.findUnique({
    where: {
      tenantId_id: {
        id,
        tenantId: businessId
      }
    },
    select: {
      reportees: {
        select: {
          id: true,
          name: true,
          designationMeta: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  if (!employee) {
    return <div>Employee not found</div>
  }

  const tabs = [
    { tab: 'Profile', content: <ProfileTab employee={employee} /> },
    { tab: 'Reportees', content: <Reportees reportees={reportees?.reportees ?? []} /> }

    // { tab: 'Holidays', content: '' }
  ]

  return (
    <div className='flex h-[calc(100vh-120px)] w-full flex-col space-y-6'>
      <BackButton path='/employees' className='w-fit self-start py-2' />
      {/* Shows invite button if employee is not invited */}
      <InviteButton employee={employee} hasNotBeenInvited={!employee.inviteUser} />
      {/* Header Section */}
      <Card>
        <CardContent className='flex flex-col items-center gap-8 p-4 lg:flex-row'>
          <Avatar className='h-[80px] w-[80px]'>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex w-full flex-col items-center text-center lg:flex-row lg:text-start'>
            <div className='flex-1'>
              <h2 className='text-xl font-semibold'>{employee?.name}</h2>
              <p className='text-sm text-muted-foreground'>{employee?.designationMeta?.name}</p>
              <p className='text-sm text-muted-foreground'>
                {employee?.workLocationMeta?.city}, {employee?.workLocationMeta?.state}, {employee?.nationality}
              </p>
            </div>

            <div className='flex flex-1 flex-col justify-end gap-1'>
              <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail size={15} /> {employee?.workEmail}
              </p>
              <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Phone size={15} />
                +91 {employee?.phoneNumber || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue='Profile' className='flex h-full w-full flex-col overflow-hidden'>
        <TabsList className='mb-4 flex self-start'>
          {tabs.map(tab => (
            <TabsTrigger key={tab.tab} value={tab.tab}>
              {tab.tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className='flex-1 overflow-y-auto'>
          {tabs.map(tab => (
            <TabsContent key={tab.tab} value={tab.tab} className='h-full'>
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  )
}
