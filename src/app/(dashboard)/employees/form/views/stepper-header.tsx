'use client'
import { Stepper } from '@/components/ui/stepper'
import { usePathname } from 'next/navigation'

type StepPath  = 'personal-details' | 'employment-details' | 'identification-and-bank-info'

export const steps = ['Personal Details', 'Employment Details', 'Bank Details']
const StepperHeader = () => {
  const pathName = usePathname()
  const isEditPage = pathName.split('/').filter(Boolean).length > 3
  const editPageTitle = pathName.split('/').filter(Boolean)[2] as StepPath 

  const formattedTitle = () => {
    switch (editPageTitle) {
      case 'personal-details':
        return 'Personal Details'
      case 'employment-details':
        return 'Employment Details'
      case 'identification-and-bank-info':
        return 'Identification & Bank Info'
    }
  }

  const currentStepName = pathName.split('/').filter(Boolean)[2] as StepPath 
  const currentStep = () => {
    switch (currentStepName) {
      case 'personal-details':
        return 0
      case 'employment-details':
        return 1
      case 'identification-and-bank-info':
        return 2
    }
  }

  return (
    <div className='flex h-20 items-center justify-center bg-background px-8'>
      {isEditPage ? (
        <h1 className='text-2xl font-medium'>{formattedTitle()}</h1>
      ) : (
        <div className='w-full max-w-4xl'>
          <div className='mb-12'>
            <Stepper steps={steps} currentStep={currentStep()} />
          </div>
        </div>
      )}
    </div>
  )
}

export default StepperHeader
