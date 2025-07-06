import { Designation } from '@prisma/client'
import {  getCookieValue, isDev, protocol, rootDomain } from "@/lib/utils"

const endPoint = '/api/designations';

export const getDesignations = async ( cookie:string, queryParams?: { [key: string]: string },): Promise<Designation[]> => {
  const subdomain = getCookieValue(cookie, 'subdomain')
  const mainUrl = isDev ? `${protocol}://localhost:3000${endPoint}` : `${protocol}://${subdomain}.${rootDomain}${endPoint}`
  let params = new URLSearchParams()
  if (queryParams) {
    const { sortBy, sortOrder, name, page, pageSize } = queryParams
    if (sortBy) params.append('sortBy', sortBy)
    if (sortOrder) params.append('sortOrder', sortOrder)
    if (name) params.append('name', name)
    if (page) params.append('page', page)
    if (pageSize) params.append('pageSize', pageSize)
  }

  try {
    const res = await fetch(`${mainUrl}?${params.toString()}`, {
      headers:{
        Cookie: cookie
      }
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching designation:', error)
    return []
  }
}


export const getDesignation = async (id: string): Promise<Designation | null> => {
  try {
    const res = await fetch(`${endPoint}/${id}`,)
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching designation:', error)
    return null
  }
}