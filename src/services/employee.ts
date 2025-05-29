import { EmployeeWithRelations } from "@/lib/types"
import { toast } from "sonner"

const BASE_URL = 'http://localhost:3000/api/employees'

export const getEmployees = async (queryParams: { [key: string]: string }): Promise<EmployeeWithRelations[]> => {
  const { sortBy, sortOrder, name, email } = queryParams

  let params = new URLSearchParams()
  if (sortBy) params.append('sortBy', sortBy)
  if (sortOrder) params.append('sortOrder', sortOrder)
  if (name) params.append('name', name)
  if (email) params.append('email', email)

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`)
    const data = await res.json()
    console.log(data, 'am data')
    return data
  } catch (error) {
    toast.error('Error fetching employees')
    return []
  }
}


export const getEmployee = async (id:string):Promise<EmployeeWithRelations | null> => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    toast.error('Error fetching employee')
    return null
  }
}