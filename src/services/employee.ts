import { EmployeeWithRelations } from "@/lib/types"

export const getEmployees = async (): Promise<EmployeeWithRelations[]> => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees`)
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
      return []
    }
  }
  