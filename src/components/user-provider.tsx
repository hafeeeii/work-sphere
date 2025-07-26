'use client'
import { User } from "@/lib/session";
import { createContext, ReactNode, useContext } from "react";


const UserContext = createContext<{user:User | null}>({
    user:null
})

export const UserProvider = ({user, children}:{
    user:User | null,
    children: ReactNode
}) => {
    return (
        <UserContext.Provider value={{user}}>
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