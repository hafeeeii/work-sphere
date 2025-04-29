import React from 'react'

const InputErrorMessage = ({message}:{message:string}) => {
  return (
    <p className='text-xs mt-2 text-destructive'>{message}</p>
  )
}

export default InputErrorMessage