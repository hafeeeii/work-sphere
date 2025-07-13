import { Invite } from "@prisma/client"


const endPoint = '/api/invites'
export const getInvite = async (id:string):Promise<Invite | null> => {
  try {
    const res = await fetch(`${endPoint}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching invite:', error)
    return null
  }
}

