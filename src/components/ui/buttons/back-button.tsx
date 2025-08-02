'use client'
import React from 'react'
import { Button, ButtonProps } from '../button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton(props?:ButtonProps & {
  path?:string
}) {
    const router = useRouter()
  return (
    <Button {...props} onClick={() => props?.path ? router.push(props.path) : router.back()} variant={'outline'}>
        <ChevronLeft/>
        Back
    </Button>
  )
}
