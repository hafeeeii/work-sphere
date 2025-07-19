import { cookies } from 'next/headers'
import 'server-only'
import prisma from './prisma'
import { getValidSession } from './session'

export async function fetchBusinessIdFromSubdomain(subdomain: string, userId: string) {
    const business = await prisma.tenant.findUnique({
        where: { subdomain },
        select: { id: true, name: true }
    })

    if (!business) return {
        status: false,
        message: 'Business not found',
        error: null,
        data: null
    }

    const tenantUser = await prisma.tenantUser.findUnique({
        where: { userId_tenantId: { tenantId: business?.id, userId } },
    })

    if (!tenantUser) return {
        status: false,
        message: 'Business not found',
        error: null,
        data: null
    }


    return {
        status: true,
        message: '',
        error: null,
        data: {
            businessId: business.id,
            businessName: business.name,
            userId
        }
    }
}

export async function getBusinessInfo() {
    const cookieStore = await cookies()
    const subdomain = cookieStore.get('subdomain')?.value
    const session = await getValidSession()

    if (!session.status) return {
        status: false,
        message: 'Session expired, please login again',
        error: null,
        data: null
    }

    const userId = session.data?.userId as string

    if (!subdomain) return {
        status: false,
        message: 'Subdomain not found',
        error: null,
        data: null
    }

    const business = await fetchBusinessIdFromSubdomain(subdomain, userId)


    if (!business?.data) return {
        status: false,
        message: 'Business not found',
        error: null,
        data: null
    }

    return business
}
