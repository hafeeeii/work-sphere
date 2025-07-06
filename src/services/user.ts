import { UserWithRelations } from "@/lib/types"
import { baseUrl } from "@/lib/utils"



const BASE_URL = baseUrl + '/api/users'

export const getUser = async (id:string):Promise<UserWithRelations | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}