'use client'
import { User } from "@/lib/session";
import { createContext, ReactNode, useContext } from "react";


const UserContext = createContext<{user:User | null, subdomain?:string | null}>({
    user:null,
    subdomain: null
})

export const UserProvider = ({user,subdomain, children}:{
    user:User | null,
    subdomain?:string | null
    children: ReactNode
}) => {
    return (
        <UserContext.Provider value={{user, subdomain}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}