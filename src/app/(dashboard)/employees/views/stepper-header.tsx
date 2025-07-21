'use client'
import { Stepper } from '@/components/ui/stepper'
import { useMultistepForm } from '../form/multistep-form-provider'

export const steps = ['Personal Details', 'Employment Details', 'Bank Details']
const StepperHeader = () => {
  const { currentStep } = useMultistepForm()

  return (
    <div className='flex h-32 items-center justify-center bg-background p-6'>
      <div className='w-full max-w-4xl'>
        <div className='mb-12'>
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      </div>
    </div>
  )
}

export default StepperHeader
