import { EmployeeWithRelations } from "@/lib/types"

export const getEmployees = async (queryParams: { [key: string]: string }): Promise<EmployeeWithRelations[]> => {
  const { sortBy, sortOrder, name, email } = queryParams

  let params = new URLSearchParams()
  if (sortBy) params.append('sortBy', sortBy)
  if (sortOrder) params.append('sortOrder', sortOrder)
  if (name) params.append('name', name)
  if (email) params.append('email', email)

  try {
    const res = await fetch(`http://localhost:3000/api/employees?${params.toString()}`)
    const data = await res.json()
    console.log(data, 'am data')
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}
