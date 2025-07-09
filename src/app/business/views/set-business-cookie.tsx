'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SetBusinessCookie({ businessId }: { businessId: string }) {
  const router = useRouter()
  useEffect(() => {
    const handleBusinessCookie = async () => {
      const res = await fetch('/api/set-business-cookie', {
        method: 'POST',
        body: JSON.stringify({ businessId }),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()

      if (data.status) {
        router.push('/dashboard')
      }
    }
    handleBusinessCookie()
  }, [businessId, router])
  return null
}
