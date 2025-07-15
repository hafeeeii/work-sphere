import React from 'react'
import Leaves from './views'

export default async function LeavesPage({searchParams}:{searchParams:Promise<{[key:string]:string}>}) {
  const params = await searchParams
  return (
    <Leaves searchParams={params}/>
  )
}
