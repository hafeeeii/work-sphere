import { Designation } from "@/generated/prisma"
import { toast } from "sonner"

const BASE_URL = 'http://localhost:3000/api/designations'

export const getDesignations = async (queryParams?: { [key: string]: string }): Promise<Designation[]> => {

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
    toast.error('Error fetching designation')
    return []
  }
}


export const getDesignation = async (id: string): Promise<Designation | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching designation')
    return null
  }
}