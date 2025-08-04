import React from 'react'
import { Button, ButtonProps } from '../button'
import { Loader } from 'lucide-react'

type LoadingButtonProps = ButtonProps & {
  isLoading: boolean
  isValid?: boolean
  icon?: React.ReactNode
}

const LoadingButton = ({ children, isLoading, isValid = true, icon, ...props }: LoadingButtonProps) => {
  return (
    <Button {...props} disabled={!isValid || isLoading} type='submit'>
      {isLoading && <Loader className='animate-spin' />}
      {!isLoading && icon && icon}
      {children}
    </Button>
  )
}

export default LoadingButton
