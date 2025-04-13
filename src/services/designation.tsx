import { Designation } from "@/generated/prisma"

export const getDesignations = async (): Promise<Designation[]> => {
    try {
      const res = await fetch(`http://localhost:3000/api/designations`)
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
      return []
    }
  }
  