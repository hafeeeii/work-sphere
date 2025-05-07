import { WorkLocation } from "@/generated/prisma"

export const getWorkLocations = async ():Promise<WorkLocation[]> => {
    try {
      const res = await fetch(`http://localhost:3000/api/work-locations`)
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
      return []
    }
  }
  