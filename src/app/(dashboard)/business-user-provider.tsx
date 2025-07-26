'use client'
import { TenantUser } from '@prisma/client'
import { createContext, ReactNode, useContext } from 'react'

const BusinessUserContext = createContext<{ businessUser: TenantUser | null }>({
  businessUser: null
})

export const BusinessUserProvider = ({
  businessUser,
  children
}: {
  businessUser: TenantUser | null
  children: ReactNode
}) => {
  return <BusinessUserContext.Provider value={{ businessUser }}>{children}</BusinessUserContext.Provider>
}

export const useBusinessUser = () => {
  const context = useContext(BusinessUserContext)
  if (!context) {
    throw new Error('useBusinessUser must be used within a BusinessUserProvider')
  }
  return context
}
