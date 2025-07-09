import { UserWithRelations } from "@/lib/types"
import { baseUrl } from "@/lib/utils"




export const getUser = async (id: string): Promise<UserWithRelations | null> => {
  try {
    const res = await fetch(`${baseUrl}/api/users/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export const getUnreadNotificationsCount = async (): Promise<number | null> => {
  try {
    const res = await fetch(`/api/notifications/unread-count`)
    const data = await res.json()
    return data?.unreadCount

  } catch (err) {
    console.error('Error fetching notifications count', err)
    return null
  }
}