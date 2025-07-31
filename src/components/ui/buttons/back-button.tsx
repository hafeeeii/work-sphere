'use client'
import React from 'react'
import { Button, ButtonProps } from '../button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton(props?:ButtonProps) {
    const router = useRouter()
  return (
    <Button {...props} onClick={() => router.back()} variant={'outline'}>
        <ChevronLeft/>
        Back
    </Button>
  )
}
