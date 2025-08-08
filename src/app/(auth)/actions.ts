'use server'

import { getErrorMessage } from "@/lib/error"
import prisma from "@/lib/prisma"
import { createSession, deleteSession } from "@/lib/session"
import { LoginSchema, SignUpSchema } from "@/lib/types"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"


export async function signUp(prevState: unknown, formData: FormData) {
    const cookieStore = await cookies()
    const subdomain = cookieStore.get('subdomain')?.value


    // check subdomain exists

    if (subdomain) {
        const tenant = await prisma.tenant.findUnique({
            where: {
                subdomain: subdomain,
            }
        })


        if (!tenant) {
            return {
                status: false,
                message: 'Subdomain not found',
                error: null
            }
        }

    }

    const parsed = SignUpSchema.safeParse(Object.fromEntries(formData))

    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }

    const { email } = parsed.data

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })


        if (user?.id) {
            return {
                status: false,
                message: 'Email already exists',
                error: null
            }
        }


        const newUser = await prisma.user.create({
            data: {
                email: parsed.data.email,
                name: parsed.data.name,
                passwordHash: await bcrypt.hash(parsed.data.password, 10),
            }
        })

        await createSession(newUser.id)
    } catch (error) {
        return {
            status: false,
            message: getErrorMessage(error),
            error: null
        }
    }

    redirect('/dashboard')

}

export async function login(prevState: unknown, formData: FormData) {

    const cookieStore = await cookies()
    const subdomain = cookieStore.get('subdomain')?.value
    let tenantId = null

    // check subdomain exists

    if (subdomain) {
        const tenant = await prisma.tenant.findUnique({
            where: {
                subdomain: subdomain
            }
        })

        if (!tenant) {
            return {
                status: false,
                message: 'Subdomain not found',
                error: null
            }
        }

        tenantId = tenant.id

    }


    const parsed = LoginSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
        return {
            status: false,
            message: 'Validation failed',
            error: parsed.error.message
        }
    }

    const { email, password } = parsed.data

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return {
                status: false,
                message: 'No user found',
                error: null
            }
        }

        if (tenantId && subdomain) {
            // check if user is part of the tenant

            const tenantUser = await prisma.tenantUser.findUnique({
                where: {
                    tenantId_email: {
                        email,
                        tenantId
                    }
                }
            })

            if (!tenantUser) {
                return {
                    status: false,
                    message: 'User is not part of the business',
                    error: null
                }
            }
        }

        const isValidPassword = await bcrypt.compare(password, user?.passwordHash)

        if (!isValidPassword) {
            return {
                status: false,
                message: 'Invalid email or password',
                error: null
            }
        }

        await createSession(user.id)
    } catch (err) {
        return {
            status: false,
            message: 'Data base error occurred' + err,
            error: null
        }
    }
    redirect('/business')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}