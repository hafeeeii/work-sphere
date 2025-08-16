'use client'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function NotFoundPage() {
    const router = useRouter()
  return (
    <div className='flex h-screen flex-col items-center justify-center space-y-6 px-10 pt-20 text-white sm:h-screen'>
      <h1 className='text-[140px] font-semibold leading-none tracking-tight  sm:text-[295px]'>404</h1>

      <p className='max-w-2xl text-center text-sm tracking-wide text-gray-500 sm:text-base'>
        The page you are trying to access cannot be found or may have been relocated. Kindly return to the homepage.
      </p>
      <Button onClick={() => router.replace('/home')}>
        <Home/>
        Back to Home
      </Button>
    </div>
  )
}
