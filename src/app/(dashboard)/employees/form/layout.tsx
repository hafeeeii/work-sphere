
import MultistepFormProvider from './multistep-form-provider'
import StepperHeader from './views/stepper-header'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex flex-col h-full w-full items-center'>
      <MultistepFormProvider>
        <div className='w-full flex flex-col lg:px-52 py-6 gap-6'>
          <StepperHeader/>
        {children}
        </div>
        </MultistepFormProvider>
    </main>
  )
}
