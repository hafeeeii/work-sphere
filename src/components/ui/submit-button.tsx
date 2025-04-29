import React from 'react'
import { Button, ButtonProps } from './button'
import { Loader } from 'lucide-react'

type SubmitButtonProps = ButtonProps & {
  isLoading: boolean
  isValid: boolean
}

const SubmitButton = ({ children, isLoading, isValid, ...props }: SubmitButtonProps) => {
  return (
    <Button disabled={!isValid || isLoading} {...props} type='submit'>
      {isLoading && <Loader className='animate-spin' />}
      {children}
    </Button>
  )
}

export default SubmitButton
