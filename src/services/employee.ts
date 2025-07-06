import { EmployeeWithRelations } from "@/lib/types"
import { getCookieValue, isDev, protocol, rootDomain } from "@/lib/utils"


const endPoint = '/api/employees';

export const getEmployees = async (cookie: string, queryParams: { [key: string]: string }): Promise<EmployeeWithRelations[]> => {
  const { sortBy, sortOrder, name, email, page, pageSize } = queryParams
  const subdomain = getCookieValue(cookie, 'subdomain')
  const mainUrl = isDev ? `${protocol}://localhost:3000${endPoint}` : `${protocol}://${subdomain}.${rootDomain}${endPoint}`
  let params = new URLSearchParams()
  if (sortBy) params.append('sortBy', sortBy)
  if (sortOrder) params.append('sortOrder', sortOrder)
  if (name) params.append('name', name)
  if (email) params.append('email', email)
  if (page) params.append('page', page)
  if (pageSize) params.append('pageSize', pageSize)

  try {
    const res = await fetch(`${mainUrl}?${params.toString()}`, {
      headers: {
        Cookie: cookie
      }
    })
    const data = await res.json()
     console.log(data,'data')
    return data
  } catch (error) {
    console.error('Error fetching employees')
    return []
  }
}


export const getEmployee = async (id:string):Promise<EmployeeWithRelations | null> => {
  try {
    const res = await fetch(`${endPoint}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching employee')
    return null
  }
}