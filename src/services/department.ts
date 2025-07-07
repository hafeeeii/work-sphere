
import { getCookieValue, isDev, protocol, rootDomain } from '@/lib/utils';
import { Department } from '@prisma/client'

const endPoint = '/api/departments';
export const getDepartments = async ( cookie:string,queryParams?: { [key: string]: string }): Promise<Department[]> => {
  const subdomain = getCookieValue(cookie, 'subdomain')
  const mainUrl = isDev ? `${protocol}://localhost:3000${endPoint}` : `${protocol}://${subdomain}.${rootDomain}${endPoint}`
  let params = new URLSearchParams()
  if (queryParams) {
    const { sortBy, sortOrder, name,code, page, pageSize } = queryParams
    if (sortBy) params.append('sortBy', sortBy)
    if (sortOrder) params.append('sortOrder', sortOrder)
    if (name) params.append('name', name)
    if (code) params.append('code', code)
    if (page) params.append('page', page)
    if (pageSize) params.append('pageSize', pageSize)
  }

  try {
    const res = await fetch(`${mainUrl}?${params.toString()}`, {
      headers: {
        Cookie: cookie
      }
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching department: ',error)
    return []
  }
}


export const getDepartment = async (id: string): Promise<Department | null> => {
  try {
    const res = await fetch(`${endPoint}/${id}`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching department:', error)
    return null
  }
}