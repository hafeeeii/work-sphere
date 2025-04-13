import { Department } from "@/generated/prisma"

export const getDepartments = async ():Promise<Department[]> => {
  try {
    const res = await fetch(`http://localhost:3000/api/departments`)
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}
