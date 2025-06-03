import { WorkLocation } from "@/generated/prisma"
import { toast } from "sonner"

const BASE_URL = 'http://localhost:3000/api/work-locations'

export const getWorkLocations = async (queryParams?: { [key: string]: string }): Promise<WorkLocation[]> => {

  let params = new URLSearchParams()
  if (queryParams) {
    const { sortBy, sortOrder, name } = queryParams
    if (sortBy) params.append('sortBy', sortBy)
    if (sortOrder) params.append('sortOrder', sortOrder)
    if (name) params.append('name', name)
  }

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching work location')
    return []
  }
}


export const getWorkLocation = async (id: string): Promise<WorkLocation | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching work location')
    return null
  }
}