import React from 'react'
import Settings from './views'

const SettingsPage = async({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) => {
   const queryParams = await searchParams
  return (
    <Settings searchParams={queryParams}/>
  )
}

export default SettingsPage