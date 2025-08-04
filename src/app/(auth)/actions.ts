'use server'

import prisma from "@/lib/prisma"
import { createSession, deleteSession } from "@/lib/session"
import { LoginSchema, SignUpSchema } from "@/lib/types"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"
import { getErrorMessage } from "@/lib/error"


export async function signUp(prevState: unknown, formData: FormData) {
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