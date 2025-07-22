'use client'
import { Stepper } from '@/components/ui/stepper'
import { usePathname } from 'next/navigation'
import { useMultistepForm } from '../multistep-form-provider'

export const steps = ['Personal Details', 'Employment Details', 'Bank Details']
const StepperHeader = () => {
  const { currentStep } = useMultistepForm()
  const pathName = usePathname()
  const isEditPage = pathName.split('/').filter(Boolean).length > 3
  const editPageTitle = pathName.split('/').filter(Boolean)[2] as
    | 'personal-details'
    | 'employment-details'
    | 'identification-and-bank-info'

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

  return (
    <div className='flex h-32 items-center justify-center bg-background p-6'>
      {isEditPage ? (
        <h1 className='text-2xl font-semibold'>{formattedTitle()}</h1>
      ) : (
        <div className='w-full max-w-4xl'>
          <div className='mb-12'>
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </div>
      )}
    </div>
  )
}

export default StepperHeader
