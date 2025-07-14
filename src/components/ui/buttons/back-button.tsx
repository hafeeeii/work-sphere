'use client'
import React from 'react'
import { Button } from '../button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
    const router = useRouter()
  return (
    <Button onClick={() => router.back()} variant={'outline'}>
        <ChevronLeft/>
        Back
    </Button>
  )
}
